import { StudioProvider } from "@/components/studio/studio-context"
import { StudioLayout } from "@/components/studio/studio-layout"
import { prisma } from "@/lib/prisma"
import { mapPrismaUnitToUnit } from "@/lib/mapper"
import { notFound } from "next/navigation"

export default async function EditorPage({ params }: { params: Promise<{ courseId: string; classId: string }> }) {
    const { courseId, classId } = await params;

    const rawCourse = await prisma.course.findUnique({
        where: { id: courseId }
    });

    if (!rawCourse) {
        notFound();
    }

    // Try to find the unit with tasks
    const rawUnit = await prisma.unit.findUnique({
        where: { id: classId },
        include: {
            tasks: {
                orderBy: { order: 'asc' }
            }
        }
    });

    const unit = rawUnit ? mapPrismaUnitToUnit(rawUnit) : undefined;

    return (
        <StudioProvider initialUnit={unit}>
            <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
                <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 justify-between shrink-0 z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">TS</div>
                        <h1 className="font-bold text-gray-800 text-lg">Teacher Studio</h1>
                        <span className="text-gray-300">/</span>
                        <span className="text-sm font-medium text-gray-500">{rawCourse.title}</span>
                        <span className="text-gray-300">/</span>
                        <span className="text-sm font-medium text-gray-900">{unit?.title || "New Content"}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                        Editing Mode
                    </div>
                </header>

                <StudioLayout />
            </div>
        </StudioProvider>
    )
}
