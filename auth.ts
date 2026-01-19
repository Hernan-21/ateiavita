import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    adapter: PrismaAdapter(prisma) as any,
    session: { strategy: "jwt" },
    providers: [
        ...authConfig.providers.filter((p: any) => p.id !== "credentials"), // Remove placeholder credentials
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                const email = credentials.email as string
                const password = credentials.password as string

                const user = await prisma.user.findUnique({
                    where: { email },
                })

                if (!user || !user.password) {
                    return null
                }

                const passwordsMatch = await bcrypt.compare(password, user.password)

                if (passwordsMatch) {
                    return user
                }

                return null
            },
        }),
    ],
    events: {
        async createUser({ user }) {
            if (!user.email || !user.id || !user.name) return;

            const { resend } = await import("@/lib/resend");
            const { WelcomeEmail } = await import("@/emails/WelcomeEmail");
            const { render } = await import("@react-email/render");

            // 1. Send Welcome Email Immediately
            try {
                // Fetch the first available school class to get a code (Mock logic for "first course code")
                const firstClass = await prisma.schoolClass.findFirst({
                    where: { isArchived: false },
                    select: { code: true }
                });

                const courseCode = firstClass?.code || "CODIGO-PENDIENTE";

                const emailHtml = await render(WelcomeEmail({
                    userFirstname: user.name.split(" ")[0],
                    courseCode: courseCode
                }));

                await resend.emails.send({
                    from: 'Teia Vita <hola@ateiavita.pro>',
                    to: user.email,
                    subject: '¡Bienvenido a la plataforma!',
                    html: emailHtml,
                });
            } catch (error) {
                console.error("Error sending welcome email:", error);
            }

            // 2. Schedule Drip Campaign
            const now = new Date();
            const daysToMilliseconds = (days: number) => days * 24 * 60 * 60 * 1000;

            const scheduledEmails = [
                { type: "DAY_3_GRAMMAR", delay: 3 },
                { type: "DAY_7_TEST", delay: 7 },
                { type: "DAY_15_MOTIVATION", delay: 15 },
            ];

            try {
                const userId = user.id as string;
                await (prisma as any).scheduledEmail.createMany({
                    data: scheduledEmails.map(email => ({
                        userId: userId,
                        type: email.type,
                        scheduledFor: new Date(now.getTime() + daysToMilliseconds(email.delay)),
                        status: "PENDING"
                    }))
                });
            } catch (error) {
                console.error("Error scheduling drip emails:", error);
            }
        },
    },
})

