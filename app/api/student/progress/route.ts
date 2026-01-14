import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const session = await auth();

    if (!session?.user?.id) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const { taskId, score } = await req.json();

        if (!taskId || score === undefined) {
            return new NextResponse("Missing required fields", { status: 400 });
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

        const result = await prisma.taskResult.upsert({
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

        return NextResponse.json(result);
    } catch (error) {
        console.error("[TASK_PROGRESS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
