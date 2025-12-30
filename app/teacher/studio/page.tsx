import { prisma } from "@/lib/prisma";
import { mapPrismaCourseToLevel } from "@/lib/mapper";
import { CourseGridClient } from "@/components/studio/dashboard/course-grid-client";
import { Plus } from "lucide-react";

export default async function StudioContentPage() {
    const rawCourses = await prisma.course.findMany({
        include: { units: true },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="container mx-auto px-6 py-8. max-w-7xl">
            {/* Studio Header (Content Focused) */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Content Library</h1>
                    <p className="text-gray-500">Manage your courses and learning materials</p>
                </div>

                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium shadow-sm transition-colors">
                        <Plus className="w-4 h-4" />
                        New Course
                    </button>
                </div>
            </div>

            {/* Content Grid (Not Table) */}
            <CourseGridClient courses={rawCourses} />
        </div>
    )
}
