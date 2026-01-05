"use server"

import { signIn, signOut } from "@/auth"

export async function loginAction() {
    await signIn("google", { redirectTo: "/" })
}

export async function credentialsLoginAction(formData: FormData) {
    try {
        await signIn("credentials", {
            email: formData.get("email"),
            password: formData.get("password"),
            redirectTo: "/",
        })
    } catch (error) {
        if ((error as Error).message.includes("CredentialsSignin")) {
            return "Invalid credentials."
        }
        throw error
    }
}

export async function logoutAction() {
    await signOut()
}
