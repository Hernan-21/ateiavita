import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Task, DragDropTask, ConversationTask, MatchingTask, FillBlankTask } from "@/types/content";
import { StudentTaskView } from "@/components/student/student-task-view";

export default async function TaskPlayerPage({ params }: { params: Promise<{ courseId: string; taskId: string }> }) {
    const { courseId, taskId } = await params;
    const session = await auth();

    if (!session?.user?.email) {
        redirect("/login");
    }

    const taskData = await prisma.task.findUnique({
        where: { id: taskId },
        include: { unit: true }
    });

    if (!taskData) {
        notFound();
    }

    // Fetch existing result
    const taskResult = await prisma.taskResult.findUnique({
        where: {
            userId_taskId: {
                userId: session.user.id!,
                taskId: taskId
            }
        }
    });

    // Adapt Prisma Task
    const task: Task = {
        id: taskData.id,
        title: taskData.title,
        type: taskData.type as any,
        // @ts-ignore: we trust the DB content
        payload: JSON.parse(taskData.content),
        // @ts-ignore
        settings: JSON.parse(taskData.settings),
        unitId: taskData.unitId,
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <StudentTaskView
                    task={task}
                    unitTitle={taskData.unit.title}
                    courseId={courseId}
                    initialScore={taskResult?.score}
                    initialCompleted={taskResult?.completed}
                />
            </main>
        </div>
    )
}
