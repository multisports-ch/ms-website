import type { Metadata } from "next";
import { Overpass } from "next/font/google";
import "./globals.css";

const overpass = Overpass({
    variable: "--font-overpass",
    subsets: ["latin"]
});

export const metadata: Metadata = {
    title: "Multisports: Explore, joue, recommence !",
    description:
        "Association multisportive pour les passionnés de sport, permettant d'essayer plusieurs sports sans engagement."
};

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr">
            <body className={`${overpass.variable} antialiased`}>{children}</body>
        </html>
    );
}
