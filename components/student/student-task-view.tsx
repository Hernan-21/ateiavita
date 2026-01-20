"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, RotateCcw, FileText, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Task, DragDropTask, ConversationTask, MatchingTask, FillBlankTask } from "@/types/content";
import { DragDropTaskPlayer } from "@/components/student/tasks/drag-drop-task";
import { ConversationTaskPlayer } from "@/components/student/tasks/conversation-task";
import { MatchingTaskPlayer } from "@/components/student/tasks/matching-task";
import { FillBlankTaskPlayer } from "@/components/student/tasks/fill-blank-task";
import { saveTaskProgress } from "@/app/actions/student";
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

interface Props {
    task: Task;
    unitTitle: string;
    courseId: string;
    initialScore?: number;
    initialCompleted?: boolean;
}

export function StudentTaskView({ task, unitTitle, courseId, initialScore, initialCompleted }: Props) {
    const router = useRouter();
    const [score, setScore] = useState<number | null>(initialScore ?? null);
    const [isCompleted, setIsCompleted] = useState(initialCompleted ?? false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { width, height } = useWindowSize();
    const [showConfetti, setShowConfetti] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);


    const handleTaskComplete = async (earnedScore: number) => {
        setIsSubmitting(true);
        try {
            const result = await saveTaskProgress(task.id, earnedScore);

            if (result.success) {
                setScore(earnedScore);
                setIsCompleted(true);
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 5000); // Stop confetti after 5s
                router.refresh(); // Refresh to update server-side data if needed
                router.refresh(); // Double refresh just to be safe with server data propagation? No, one is usually enough but sometimes race conditions occur.
            } else {
                console.error("Failed to save progress:", result.error);
                alert(`Error saving progress: ${result.error}`); // Feedback for the user/debugging
            }
        } catch (error) {
            console.error("Failed to save progress", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRetry = () => {
        setIsCompleted(false);
        // We keep the previous score but allow retrying
        // Ideally we reset the specific task player state too, which usually happens on re-mount or key change
    };

    return (
        <div className="max-w-5xl mx-auto px-4 md:px-0 mt-8">
            {isMounted && showConfetti && <Confetti width={width} height={height} numberOfPieces={200} recycle={false} />}

            {/* Header / Nav */}
            <div className="mb-12">
                <Link
                    href={`/student/courses/${courseId}`}
                    className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors text-base"
                >
                    <ChevronLeft className="w-5 h-5 mr-2" />
                    Back to {unitTitle}
                </Link>

                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                    <div className="flex items-center gap-6">
                        {/* Task Icon */}
                        <div className="w-24 h-24 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0 border-4 border-white shadow-sm overflow-hidden">
                            <img
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${task.id}`}
                                alt="Task Icon"
                                className="w-20 h-20"
                            />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">{task.title}</h1>
                            <p className="text-lg text-gray-500 font-medium">{unitTitle}</p>
                        </div>
                    </div>

                    {/* Score Card - Design Match */}
                    {score !== null && (
                        <div className="bg-[#DBE4FF] rounded-2xl px-8 py-5 flex items-center gap-3">
                            <span className="text-indigo-900 font-bold text-lg">Final Score:</span>
                            <span className="text-3xl font-bold text-gray-900">{score}%</span>
                        </div>
                    )}
                </div>
            </div>

            {/* divider */}
            <hr className="border-gray-100 mb-8" />

            {/* Action Bar */}
            <div className="flex items-center justify-between mb-8">
                {isCompleted ? (
                    <button
                        onClick={handleRetry}
                        className="bg-[#5C7CFA] hover:bg-[#4C6EF5] text-white px-8 py-3 rounded-md font-semibold shadow-sm transition-colors flex items-center gap-2 text-lg"
                    >
                        Retry lesson
                        <ChevronLeft className="w-5 h-5 rotate-180" />
                    </button>
                ) : (
                    <div className="h-10"></div>
                )}

                <button className="text-gray-600 hover:text-gray-900 font-bold flex items-center gap-2 transition-colors">
                    <FileText className="w-5 h-5" />
                    PDF version
                </button>
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-none shadow-none min-h-[500px]">
                {isCompleted ? (
                    <div className="mt-8">
                        {/* Results Summary Mockup - Table Style */}
                        <div className="w-full">
                            <div className="space-y-1">
                                <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-sm">
                                    <div className="flex items-center gap-4">
                                        <div className="w-6 h-6 rounded-full bg-green-400 flex items-center justify-center">
                                            <CheckCircle className="w-4 h-4 text-white fill-current" />
                                        </div>
                                        <span className="font-bold text-gray-800">Task Results</span>
                                    </div>
                                    <span className="font-bold text-gray-800">Best Score</span>
                                </div>

                                {/* Item */}
                                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                                    <div className="flex items-center gap-4">
                                        <div className="w-6 h-6 rounded-full bg-green-400 flex items-center justify-center">
                                            <CheckCircle className="w-4 h-4 text-white fill-current" />
                                        </div>
                                        <span className="text-gray-700">Completion Status</span>
                                    </div>
                                    <span className="text-gray-500">Completed</span>
                                </div>

                                {/* Item */}
                                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                                    <div className="flex items-center gap-4">
                                        <div className="w-6 h-6 rounded-full bg-green-400 flex items-center justify-center">
                                            <CheckCircle className="w-4 h-4 text-white fill-current" />
                                        </div>
                                        <span className="text-gray-700">Accuracy</span>
                                    </div>
                                    <span className="text-gray-500">{score}%</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12">
                            {/* Just spacing, maybe stats later */}
                        </div>
                    </div>
                ) : (
                    // Active Player
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                        {task.type === 'drag_drop' ? (
                            <DragDropTaskPlayer payload={(task as DragDropTask).payload} onComplete={handleTaskComplete} />
                        ) : task.type === 'conversation' ? (
                            <ConversationTaskPlayer payload={(task as ConversationTask).payload} onComplete={handleTaskComplete} />
                        ) : task.type === 'matching' ? (
                            <MatchingTaskPlayer key={isCompleted ? 'completed' : 'active'} payload={(task as MatchingTask).payload} onComplete={handleTaskComplete} />
                        ) : task.type === 'fill_blank' ? (
                            <FillBlankTaskPlayer payload={(task as FillBlankTask).payload} onComplete={handleTaskComplete} />
                        ) : (
                            <div className="text-center text-gray-500 py-20">
                                <p>Player not implemented for {task.type} yet.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
