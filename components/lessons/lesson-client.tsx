"use client";

import { Button } from "@/components/ui/Button";
import { Check, ChevronLeft, CircleDashed } from "lucide-react";
import Link from "next/link";
import { useUser } from "@/lib/context";
import { TaskRenderer } from "@/components/engines/task-renderer";
import { Task, Level } from "@/types/content";

interface LessonClientProps {
    task: Task | null;
    level: Level | null;
    classId: string;
    lessonId: string;
}

export function LessonClient({ task, level, classId, lessonId }: LessonClientProps) {
    const { isMaterialDone, markMaterialAsDone } = useUser();

    const isDone = task ? isMaterialDone(task.id) : false;

    if (!task || !level) {
        return (
            <div className="flex-1 p-8 text-center pt-20">
                <h1 className="text-xl font-bold text-red-500">Task Not Found (ID: {lessonId})</h1>
                <Link href={`/classes/${classId}`} className="text-blue-500 underline mt-4 block">
                    Return to Class
                </Link>
            </div>
        )
    }

    return (
        <main className="flex-1 pb-20">
            <div className="container mx-auto px-4 md:px-8 py-8">
                {/* Back Navigation */}
                <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
                    <Link href={`/classes/${classId}`} className="hover:text-primary flex items-center gap-1">
                        <ChevronLeft className="h-4 w-4" /> Back to {level.title}
                    </Link>
                </div>

                {/* Lesson Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{task.title}</h1>
                        <p className="text-gray-500 uppercase text-xs font-bold tracking-wider mt-1">{task.type} MODULE</p>
                    </div>

                    <div className={`px-6 py-3 rounded-xl flex items-center gap-2 font-bold text-lg transition-colors ${isDone ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        <span>Status:</span>
                        <span className="text-2xl">{isDone ? 'Completed' : 'Pending'}</span>
                    </div>
                </div>

                {/* Content Engine Area */}
                <div className="mb-12">
                    <TaskRenderer task={task} />
                </div>

                {/* Action Bar */}
                <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-gray-100 shadow-sm sticky bottom-4 z-10">
                    <div className="text-sm text-gray-500 hidden md:block">
                        Completed this task? Stamp it!
                    </div>

                    <Button
                        size="lg"
                        onClick={() => markMaterialAsDone(task.id)}
                        className={`gap-2 transition-all ${isDone ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-primary hover:bg-primary/90 text-white'}`}
                    >
                        {isDone ? (
                            <>
                                <Check className="h-5 w-5" /> Done
                            </>
                        ) : (
                            <>
                                <CircleDashed className="h-5 w-5" /> Mark as Done
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </main>
    )
}
