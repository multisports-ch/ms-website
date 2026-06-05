import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();

    if (!session || session.user.role !== "admin") {
        redirect("/login");
    }

    return (
        <div className="min-h-screen flex bg-gray-100">
            <AdminSidebar user={session.user} />
            <main className="flex-1 p-8 overflow-y-auto">{children}</main>
        </div>
    );
}
