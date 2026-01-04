import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const isOnDashboard = req.nextUrl.pathname === "/" || req.nextUrl.pathname.startsWith("/classes") || req.nextUrl.pathname === "/profile"
    const isOnWelcome = req.nextUrl.pathname === "/welcome"
    const isOnLogin = req.nextUrl.pathname === "/login"

    if (isOnDashboard) {
        if (isLoggedIn) return
        return NextResponse.redirect(new URL("/welcome", req.nextUrl))
    }

    if (isOnWelcome || isOnLogin) {
        if (isLoggedIn) {
            return NextResponse.redirect(new URL("/", req.nextUrl))
        }
        return
    }
})

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
