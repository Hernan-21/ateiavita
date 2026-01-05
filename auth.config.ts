import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"

export const authConfig = {
    providers: [
        Google,
        Credentials({
            async authorize(credentials) {
                return null; // Logic is in auth.ts
            }
        }),
    ],
    pages: {
        signIn: '/login', // Optional: Redirect to login page
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user
            const isOnDashboard = nextUrl.pathname === "/" || nextUrl.pathname.startsWith("/classes") || nextUrl.pathname === "/profile"
            const isOnWelcome = nextUrl.pathname === "/welcome"
            const isOnLogin = nextUrl.pathname === "/login"
            const isOnRegister = nextUrl.pathname === "/register"

            if (isOnDashboard) {
                if (isLoggedIn) return true
                return false // Redirect to login (or pages.signIn)
            } else if (isOnWelcome || isOnLogin || isOnRegister) {
                if (isLoggedIn) {
                    return Response.redirect(new URL("/", nextUrl))
                }
                return true
            }
            return true
        },
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role
            }
            return token
        },
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub
            }
            // Add custom fields to session if needed (e.g. role)
            if (session.user) {
                session.user.role = token.role as string
            }
            return session
        },
    },
} satisfies NextAuthConfig
