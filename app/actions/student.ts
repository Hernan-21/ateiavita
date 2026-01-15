'use server';

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getStudentFeedback() {
    const session = await auth();
    if (!session?.user?.email) return [];

    const user = await prisma.user.findUnique({
        where: { email: session.user.email }
    });

    if (!user) return [];

    // Cast prisma to any to avoid type errors during dev while types regenerate
    // Properly typed: prisma.feedback.findMany
    const feedbacks = await (prisma as any).feedback.findMany({
        where: {
            studentId: user.id
        },
        include: {
            author: {
                select: { name: true, image: true }
            },
            course: {
                select: { title: true, color: true, iconChar: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    return feedbacks;
}

export async function markFeedbackAsRead(feedbackId: string) {
    const session = await auth();
    if (!session?.user?.email) return { success: false };

    await (prisma as any).feedback.update({
        where: { id: feedbackId },
        data: { isRead: true }
    });

    revalidatePath('/student/feedback');
    return { success: true };
}
