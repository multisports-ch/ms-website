import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    const { pathname } = req.nextUrl;
    const role = req.auth?.user?.role;

    // Redirect admin away from member dashboard
    if (pathname.startsWith("/dashboard") && role === "admin") {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }

    // Protect admin routes
    if (pathname.startsWith("/admin")) {
        if (!req.auth) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
        if (role !== "admin") {
            return NextResponse.redirect(new URL("/", req.url));
        }
    }

    // Protect member routes
    if (pathname.startsWith("/dashboard")) {
        if (!req.auth) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/admin/:path*", "/dashboard/:path*"]
};
