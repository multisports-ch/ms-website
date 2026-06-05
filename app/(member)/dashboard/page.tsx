import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { eventSignups, events, seasons } from "@/db/schema";
import { eq, and, gte } from "drizzle-orm";
import SignOutButton from "@/components/shared/SignOutButton";
import ChangePasswordForm from "@/components/shared/ChangePasswordForm";
import MemberEventSignup from "@/components/member/MemberEventSignup";
import { getCurrentSeason, getUpcomingEvents } from "@/lib/queries";

export default async function MemberDashboardPage() {
    const session = await auth();
    if (!session) redirect("/login");

    const currentSeason = await getCurrentSeason();
    const upcomingEvents = currentSeason ? await getUpcomingEvents(currentSeason.id) : [];

    // Get member's existing signups for upcoming events
    const upcomingEventIds = upcomingEvents.map((e) => e.id);
    const mySignups =
        upcomingEventIds.length > 0
            ? await db
                  .select({ eventId: eventSignups.eventId })
                  .from(eventSignups)
                  .where(eq(eventSignups.userId, session.user.id))
            : [];

    const mySignupEventIds = mySignups.map((s) => s.eventId);

    const upcomingSport = upcomingEvents.find((e) => e.type === "sport") ?? null;
    const upcomingDefi = upcomingEvents.find((e) => e.type === "defi") ?? null;

    return (
        <div className="min-h-screen bg-background">
            {/* Top bar */}
            <header className="border-b border-border bg-card">
                <div className="px-6 md:px-12 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--accent)" }} />
                        <span className="font-bold text-foreground">Espace membre</span>
                    </div>
                    <SignOutButton />
                </div>
            </header>

            <main className="px-6 md:px-12 py-12 max-w-2xl flex flex-col gap-10">
                {/* Welcome */}
                <div>
                    <div className="w-8 h-1 rounded-full mb-3" style={{ backgroundColor: "var(--accent)" }} />
                    <h1 className="text-4xl font-black text-foreground">
                        Bonjour, {session.user.name ?? session.user.email} 👋
                    </h1>
                    <p className="text-muted-foreground mt-2">Bienvenue dans votre espace membre Multisports.</p>
                </div>

                {/* Upcoming event signups */}
                {(upcomingSport || upcomingDefi) && (
                    <div className="bg-card border border-border rounded-2xl p-6">
                        <h2 className="text-lg font-bold text-foreground mb-1">Prochains événements</h2>
                        <p className="text-sm text-muted-foreground mb-6">
                            Inscrivez-vous aux prochains sports et défis.
                        </p>
                        <div className="flex flex-col gap-4">
                            {upcomingSport && (
                                <MemberEventSignup
                                    event={{
                                        ...upcomingSport,
                                        date: upcomingSport.date ? new Date(upcomingSport.date).toISOString() : null
                                    }}
                                    isSignedUp={mySignupEventIds.includes(upcomingSport.id)}
                                />
                            )}
                            {upcomingDefi && (
                                <MemberEventSignup
                                    event={{
                                        ...upcomingDefi,
                                        date: upcomingDefi.date ? new Date(upcomingDefi.date).toISOString() : null
                                    }}
                                    isSignedUp={mySignupEventIds.includes(upcomingDefi.id)}
                                />
                            )}
                        </div>
                    </div>
                )}

                {/* Change password */}
                <div className="bg-card border border-border rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-foreground mb-1">Changer le mot de passe</h2>
                    <p className="text-sm text-muted-foreground mb-6">
                        Choisissez un mot de passe d'au moins 8 caractères.
                    </p>
                    <ChangePasswordForm />
                </div>
            </main>
        </div>
    );
}
