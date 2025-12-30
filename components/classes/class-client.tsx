"use client";

import { Footer } from "@/components/layout/Footer"
import { Check, ChevronRight, PlayCircle, CheckCircle2, ChevronLeft, Video, FileText, CheckSquare, Mic } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useUser } from "@/lib/context"
import { getLevelById } from "@/lib/data"
import { useEffect, useState } from "react"

export function ClassPageClient() {
    const params = useParams();
    const router = useRouter();
    const { state, getClassProgress, isMaterialDone } = useUser();
    const classId = params.classId as string;

    const [level, setLevel] = useState(getLevelById(classId));

    useEffect(() => {
        // Refresh level data if needed, but data is static.
        // Check if locked
        if (level && !state.unlockedLevels.includes(level.id)) {
            router.push('/');
        }
    }, [classId, level, state.unlockedLevels, router]);

    if (!level) return <div className="p-8 text-center text-red-500">Level not found</div>;

    return (
        <main className="flex-1 pb-20">

            <div className="container mx-auto px-4 md:px-8 py-8">
                {/* Breadcrumb / Back Navigation */}
                <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
                    <Link href="/" className="hover:text-primary flex items-center gap-1">
                        <ChevronLeft className="h-4 w-4" /> Back to Building (Levels)
                    </Link>
                    <span>/</span>
                    <span className="font-semibold text-gray-800">{level.title}</span>
                </div>

                {/* Header with Color Indicator */}
                <div className="flex items-center gap-4 mb-8">
                    <div className={`h-12 w-2 rounded-full bg-${level.color}-500`}></div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{level.title}</h1>
                        <div className="flex items-center gap-2 text-gray-500">
                            <span className="text-xl">{level.iconChar}</span> {level.description}
                        </div>
                    </div>
                </div>

                <div className="grid gap-10">
                    {/* Content List */}
                    <div className="space-y-8">
                        {level.units.map((unit) => (
                            <div key={unit.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                                    <h2 className="text-xl font-bold text-gray-800">{unit.title}</h2>
                                    <span className="text-sm font-medium text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm border border-gray-200">
                                        {unit.tasks.length} Tasks
                                    </span>
                                </div>

                                <div className="divide-y divide-gray-100">
                                    {unit.tasks.map((task) => {
                                        const isDone = isMaterialDone(task.id);
                                        return (
                                            <Link key={task.id} href={`/classes/${classId}/lessons/${task.id}`} className="block hover:bg-gray-50 transition-colors">
                                                <div className="p-4 md:p-6 flex items-center justify-between group">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isDone ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-primary/20 group-hover:text-primary'}`}>
                                                            {isDone ? <CheckCircle2 className="h-6 w-6" /> : (
                                                                // Dynamic Icon
                                                                <>
                                                                    {task.type === 'video' && <Video className="h-5 w-5" />}
                                                                    {task.type === 'pdf' && <FileText className="h-5 w-5" />}
                                                                    {task.type === 'quiz' && <CheckSquare className="h-5 w-5" />}
                                                                    {task.type === 'audio' && <Mic className="h-5 w-5" />}
                                                                </>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <h3 className={`font-medium text-base md:text-lg ${isDone ? 'text-gray-500 line-through' : 'text-gray-900'}`}>{task.title}</h3>
                                                            <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">{task.type}</p>
                                                        </div>
                                                    </div>

                                                    {isDone ? (
                                                        <div className="flex items-center gap-2 text-green-600 font-bold text-sm">
                                                            <div className="rounded-full bg-green-100 p-0.5"><Check className="h-3 w-3" /></div>
                                                            Done
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-2 text-gray-400 font-medium text-sm group-hover:text-primary">
                                                            Start <ChevronRight className="h-4 w-4" />
                                                        </div>
                                                    )}
                                                </div>
                                            </Link>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                        )}
                    </div>
                </div>
            </div>

        </main >
    )
}
