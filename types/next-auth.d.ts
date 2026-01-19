import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            role: string
            isNewUser?: boolean
        } & DefaultSession["user"]
    }

    interface User {
        role: string
        isNewUser?: boolean
    }
}

declare module "next-auth/adapters" {
    interface AdapterUser {
        role: string
        isNewUser?: boolean
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role: string
        isNewUser?: boolean
    }
}
