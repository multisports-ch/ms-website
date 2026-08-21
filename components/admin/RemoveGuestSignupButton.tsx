"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
    signupId: string;
}

export default function RemoveGuestSignupButton({ signupId }: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleRemove() {
        if (!window.confirm("Supprimer cette inscription invité ?")) return;

        setLoading(true);
        const response = await fetch(`/api/admin/signups/${signupId}`, { method: "DELETE" });
        if (response.ok) {
            router.refresh();
        } else {
            setLoading(false);
        }
    }

    return (
        <button
            type="button"
            onClick={handleRemove}
            disabled={loading}
            className="text-xs font-medium text-red-500 hover:text-red-700 disabled:opacity-50"
        >
            {loading ? "Suppression..." : "Supprimer"}
        </button>
    );
}