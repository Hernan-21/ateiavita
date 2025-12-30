import { ClassList } from "@/components/studio/course-editor/class-list";
import { prisma } from "@/lib/prisma";
import { mapPrismaCourseToLevel } from "@/lib/mapper";
import { ChevronRight, LayoutGrid } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function CoursePage({ params }: { params: Promise<{ courseId: string }> }) {
    const { courseId } = await params;
    const rawCourse = await prisma.course.findUnique({
        where: { id: courseId },
        include: {
            units: {
                include: { tasks: true }, // We need task count
                orderBy: { createdAt: 'asc' }
            }
        }
    });

    if (!rawCourse) {
        notFound();
    }

    const course = mapPrismaCourseToLevel(rawCourse);

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 justify-between shrink-0 sticky top-0 z-10">
                <div className="flex items-center gap-2 text-sm">
                    <Link href="/teacher/studio" className="font-medium text-gray-500 hover:text-gray-900 flex items-center gap-2">
                        <LayoutGrid className="h-4 w-4" />
                        Dashboard
                    </Link>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                    <span className="font-bold text-gray-800">{course.title}</span>
                </div>
            </header>

            <main className="container mx-auto px-6 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
                    <p className="text-gray-500 mt-2">{course.description}</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <ClassList
                        courseId={course.id}
                        units={course.units}
                    // onCreateClass will be implemented client-side
                    />
                </div>
            </main>
        </div>
    )
}
