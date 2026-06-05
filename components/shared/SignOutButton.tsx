"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-sm font-medium text-muted-foreground hover:text-red-500 transition-colors"
        >
            Se déconnecter
        </button>
    );
}
