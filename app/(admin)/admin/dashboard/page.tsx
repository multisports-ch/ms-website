import { auth } from "@/lib/auth";
import Link from "next/link";

const cards = [
    { label: "Content Blocks", href: "/admin/content", description: "Edit page text and images" },
    { label: "Committee", href: "/admin/committee", description: "Manage committee members" },
    { label: "News & Events", href: "/admin/news", description: "Create and edit posts" },
    { label: "Leaderboard", href: "/admin/leaderboard", description: "Update standings" },
    { label: "Documents", href: "/admin/documents", description: "Manage join page files" },
    { label: "Members", href: "/admin/members", description: "Add and remove members" }
];

export default async function AdminDashboardPage() {
    const session = await auth();

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Welcome back, {session?.user.name ?? session?.user.email}
            </h1>
            <p className="text-gray-500 mb-8">Use the sidebar to manage your association website.</p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {cards.map((card) => (
                    <Link
                        key={card.href}
                        href={card.href}
                        className="bg-white rounded-xl shadow p-6 hover:shadow-md transition-shadow"
                    >
                        <p className="font-semibold text-gray-800">{card.label}</p>
                        <p className="text-sm text-gray-500 mt-1">{card.description}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
