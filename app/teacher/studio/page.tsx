import { prisma } from "@/lib/prisma";
import { mapPrismaCourseToLevel } from "@/lib/mapper";
import { CourseGridClient } from "@/components/studio/dashboard/course-grid-client";
import { CreateCourseModal } from "@/components/studio/create-course-modal";
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

                <CreateCourseModal />
            </div>

            {/* Content Grid (Not Table) */}
            <CourseGridClient courses={rawCourses} />
        </div>
    )
}
