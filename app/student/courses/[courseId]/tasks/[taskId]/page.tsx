import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { DragDropTaskPlayer } from "@/components/student/tasks/drag-drop-task";
import { Task, DragDropTask, ConversationTask, MatchingTask, FillBlankTask } from "@/types/content";
import { ConversationTaskPlayer } from "@/components/student/tasks/conversation-task";
import { MatchingTaskPlayer } from "@/components/student/tasks/matching-task";
import { FillBlankTaskPlayer } from "@/components/student/tasks/fill-blank-task";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default async function TaskPlayerPage({ params }: { params: Promise<{ courseId: string; taskId: string }> }) {
    // Await params first
    const { courseId, taskId } = await params;

    // Auth check
    const session = await auth();
    if (!session?.user?.email) {
        redirect("/login");
    }

    // Fetch Task
    const taskData = await prisma.task.findUnique({
        where: { id: taskId },
        include: { unit: true }
    });

    if (!taskData) {
        notFound();
    }

    // Adapt Prisma Task to Application Task Type
    const task: Task = {
        id: taskData.id,
        title: taskData.title,
        type: taskData.type as any,
        // @ts-ignore: we trust the DB content
        payload: JSON.parse(taskData.content),
        // @ts-ignore
        settings: JSON.parse(taskData.settings),
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <Link
                    href={`/student/courses/${courseId}`}
                    className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-8 transition-colors"
                >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back to Unit
                </Link>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 px-8 py-6 border-b border-gray-100 text-center">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">
                            {taskData.unit.title}
                        </span>
                        <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
                    </div>

                    <div className="p-8 min-h-[400px] flex items-center justify-center">
                        {task.type === 'drag_drop' ? (
                            <DragDropTaskPlayer payload={(task as DragDropTask).payload} />
                        ) : task.type === 'conversation' ? (
                            <ConversationTaskPlayer payload={(task as ConversationTask).payload} />
                        ) : task.type === 'matching' ? (
                            <MatchingTaskPlayer payload={(task as MatchingTask).payload} />
                        ) : task.type === 'fill_blank' ? (
                            <FillBlankTaskPlayer payload={(task as FillBlankTask).payload} />
                        ) : (
                            <div className="text-center text-gray-500">
                                <p>Player not implemented for {task.type} yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
