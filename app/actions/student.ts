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

export async function saveTaskProgress(taskId: string, score: number) {
    try {
        const session = await auth();

        // Log session status for debugging (crucial for PROD issues)
        if (!session?.user?.id) {
            console.error("[saveTaskProgress] Unauthorized: No session or user ID found.");
            // In production, NextAuth sometimes needs strict cookie configuration or trust host.
            return { success: false, error: "Unauthorized: Session is invalid or expired." };
        }

        // Get existing result to compare scores
        const existingResult = await prisma.taskResult.findUnique({
            where: {
                userId_taskId: {
                    userId: session.user.id,
                    taskId: taskId
                }
            }
        });

        // Upsert logic: keep the highest score
        const newScore = existingResult ? Math.max(existingResult.score, score) : score;
        const attempts = existingResult ? existingResult.attempts + 1 : 1;

        await prisma.taskResult.upsert({
            where: {
                userId_taskId: {
                    userId: session.user.id,
                    taskId: taskId
                }
            },
            update: {
                score: newScore,
                attempts: attempts,
                completed: true
            },
            create: {
                userId: session.user.id,
                taskId: taskId,
                score: newScore,
                attempts: 1,
                completed: true
            }
        });

        // Revalidate the task page and the course page
        revalidatePath(`/student/courses/[courseId]`, 'layout');

        return { success: true };
    } catch (error: any) {
        console.error("[saveTaskProgress] Critical Error:", error);
        return { success: false, error: error.message || "Internal Server Error" };
    }
}
