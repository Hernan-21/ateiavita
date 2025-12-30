
import { prisma } from "@/lib/prisma";
import { Link, GraduationCap, Users, MoreHorizontal, MessageSquare, PlayCircle, FolderPlus } from "lucide-react";
import { ClassBoardManager } from "@/components/studio/board/class-board-manager";

export default async function ClassDetailPage({ params }: { params: Promise<{ classId: string }> }) {
    const { classId } = await params;
    const schoolClass = await prisma.schoolClass.findUnique({
        where: { id: classId },
        include: {
            courses: {
                include: { course: true }
            }
        }
    });

    if (!schoolClass) {
        return <div>Class not found</div>;
    }

    return (
        <div className="container mx-auto px-6 py-8 max-w-7xl">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-10 bg-indigo-600 rounded-full"></div>
                    <h1 className="text-3xl font-bold text-gray-900">{schoolClass.name}</h1>
                </div>

                <div className="flex items-center gap-2">
                    <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded text-sm font-medium flex items-center gap-1 border border-indigo-100">
                        Class code: 4Q2ACC
                    </span>
                    <button className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
                        <MoreHorizontal className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-8 border-b border-gray-200 mb-8">
                <button className="pb-3 border-b-2 border-indigo-600 text-indigo-600 font-semibold text-sm">
                    Lesson Planner
                </button>
                <button className="pb-3 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-semibold text-sm">
                    Students
                </button>
                <button className="pb-3 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-semibold text-sm">
                    Details
                </button>
                <div className="ml-auto flex items-center gap-2 text-sm text-gray-500 pb-3">
                    <MessageSquare className="w-4 h-4" />
                    Grade Feed
                </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between mb-8">
                <button className="flex items-center gap-2 text-gray-600 text-sm font-medium hover:text-indigo-600 transition-colors">
                    <PlayCircle className="w-4 h-4" />
                    Watch tutorial
                </button>

                <button className="flex items-center gap-2 text-gray-600 text-sm font-medium hover:text-indigo-600 transition-colors">
                    <FolderPlus className="w-4 h-4" />
                    Save to folder
                </button>
            </div>

            {/* Class Board Manager (Kanban + Drawer) */}
            <ClassBoardManager
                classId={classId}
                assignments={schoolClass.courses
                    .filter(c => c.status !== 'hidden') // All non-hidden statuses (prepping, teaching, taught)
                    .map(c => ({
                        classId: c.classId,
                        courseId: c.courseId,
                        status: c.status,
                        isSaved: c.isSaved,
                        course: {
                            id: c.course.id,
                            title: c.course.title,
                            iconChar: c.course.iconChar,
                            color: c.course.color
                        }
                    }))}
                savedCourses={schoolClass.courses
                    .filter(c => c.isSaved === true) // All saved items
                    .map(c => ({
                        classId: c.classId,
                        courseId: c.courseId,
                        status: c.status,
                        isSaved: c.isSaved,
                        course: {
                            id: c.course.id,
                            title: c.course.title,
                            iconChar: c.course.iconChar,
                            color: c.course.color
                        }
                    }))}
            />
        </div>
    );
}

