
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { ChevronLeft, CheckCircle, Circle, PlayCircle, Trophy, FileText } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function StudentCoursePage({ params }: { params: Promise<{ courseId: string }> }) {
    const { courseId } = await params;
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const course = await prisma.course.findUnique({
        where: { id: courseId },
        include: {
            units: {
                include: {
                    tasks: {
                        include: {
                            results: {
                                where: { userId: session.user.id }
                            }
                        },
                        orderBy: { order: 'asc' }
                    }
                },
                orderBy: {
                    createdAt: 'asc'
                }
            }
        }
    });

    if (!course) {
        return <div>Course not found</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50/50">
            <Navbar />

            <main className="container mx-auto px-4 md:px-8 py-8 max-w-4xl">
                {/* Header */}
                <div className="mb-10">
                    <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-6 transition-colors">
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Back to Dashboard
                    </Link>

                    <div className="flex items-start gap-6">
                        <div className={cn(
                            "w-20 h-20 rounded-2xl flex items-center justify-center text-4xl font-bold shadow-sm shrink-0",
                            `bg-${course.color}-100 text-${course.color}-600` // Fallback needed if dynamic color fails
                        )}
                            style={{ backgroundColor: '#EEF2FF', color: '#4F46E5' }} // Hardcoded indigo theme for now to ensure look
                        >
                            {course.iconChar}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
                            <p className="text-gray-500 leading-relaxed max-w-2xl">{course.description}</p>
                        </div>
                    </div>
                </div>

                {/* Units List */}
                <div className="space-y-8">
                    {course.units.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trophy className="w-6 h-6 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">No content yet</h3>
                            <p className="text-gray-500">Check back later for new lessons.</p>
                        </div>
                    ) : (
                        course.units.map((unit, index) => (
                            <div key={unit.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                                <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-white">
                                    <div>
                                        <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-1 block">Unit {index + 1}</span>
                                        <h2 className="text-xl font-bold text-gray-900">{unit.title}</h2>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {unit.pdfUrl && (
                                            <a
                                                href={unit.pdfUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors"
                                            >
                                                <FileText className="w-3.5 h-3.5" />
                                                Guide PDF
                                            </a>
                                        )}
                                        {/* Progress Pill - Calculated from tasks */}
                                        <div className="bg-gray-50 px-3 py-1 rounded-full border border-gray-100 text-xs font-semibold text-gray-600">
                                            {unit.tasks.filter(t => t.results?.[0]?.completed).length}/{unit.tasks.length} Completed
                                        </div>
                                    </div>
                                </div>

                                <div className="divide-y divide-gray-50">
                                    {unit.tasks.map((task: any) => {
                                        const result = task.results[0];
                                        const isCompleted = !!result?.completed;
                                        const score = result?.score;

                                        return (
                                            <Link
                                                key={task.id}
                                                href={`/student/courses/${course.id}/tasks/${task.id}`}
                                                className="group block px-8 py-5 hover:bg-gray-50 transition-all duration-200"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-5">
                                                        <div className={cn(
                                                            "w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors",
                                                            isCompleted
                                                                ? "bg-green-50 border-green-500 text-green-500"
                                                                : "bg-white border-gray-200 text-gray-300 group-hover:border-indigo-300"
                                                        )}>
                                                            {isCompleted ? <CheckCircle className="w-6 h-6 fill-green-500 text-white" /> : <div className="w-2.5 h-2.5 rounded-full bg-current" />}
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold text-gray-900 text-lg group-hover:text-indigo-600 transition-colors">
                                                                {task.title}
                                                            </h3>
                                                            <p className="text-sm text-gray-500">Lesson</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-4">
                                                        {isCompleted && score !== undefined && (
                                                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-bold border border-green-100">
                                                                <Trophy className="w-3.5 h-3.5" />
                                                                {score}%
                                                            </div>
                                                        )}

                                                        <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center opacity-0 transform translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200">
                                                            <PlayCircle className="w-5 h-5" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })}

                                    {unit.tasks.length === 0 && (
                                        <div className="px-8 py-10 text-center">
                                            <p className="text-gray-400 italic">No tasks in this unit yet.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}
