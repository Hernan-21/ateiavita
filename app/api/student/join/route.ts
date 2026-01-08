
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { code } = await request.json();

        if (!code) {
            return NextResponse.json({ error: "Code is required" }, { status: 400 });
        }

        // Find Class
        const schoolClass = await prisma.schoolClass.findUnique({
            where: { code: code.toUpperCase() }
        });

        if (!schoolClass) {
            return NextResponse.json({ error: "Invalid class code" }, { status: 404 });
        }

        // Find user
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Check enrollment
        const existing = await prisma.enrollment.findUnique({
            where: {
                userId_classId: {
                    userId: user.id,
                    classId: schoolClass.id
                }
            }
        });

        if (existing) {
            return NextResponse.json({ message: "Already enrolled", classId: schoolClass.id });
        }

        // Enroll
        await prisma.enrollment.create({
            data: {
                userId: user.id,
                classId: schoolClass.id
            }
        });

        return NextResponse.json({ success: true, classId: schoolClass.id });

    } catch (error: any) {
        console.error("Join error:", error);
        return NextResponse.json({ error: "Failed to join class" }, { status: 500 });
    }
}
