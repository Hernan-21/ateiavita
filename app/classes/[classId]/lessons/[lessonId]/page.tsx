import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { LessonClient } from "@/components/lessons/lesson-client"
import { prisma } from "@/lib/prisma"
import { mapPrismaCourseToLevel, mapPrismaTaskToTask } from "@/lib/mapper"

export default async function LessonPage({ params }: { params: Promise<{ classId: string; lessonId: string }> }) {
    const { classId, lessonId } = await params;

    // Fetch Course (Level) to get context (title, units for navigation?)
    // Note: We might need the whole hierarchy to show "Back to {level.title}"
    const course = await prisma.course.findUnique({
        where: { id: classId },
        include: { units: true } // We might not need all tasks here, just basic structure? 
        // Actually, existing getLevelById returns everything, so let's try to match that for now
        // to avoid breaking things, but optimize later.
    });

    // Fetch specific Task
    const pTask = await prisma.task.findUnique({
        where: { id: lessonId }
    });

    // Mapping
    const level = course ? mapPrismaCourseToLevel(course) : null;
    const task = pTask ? mapPrismaTaskToTask(pTask) : null;

    return (
        <div className="min-h-screen flex flex-col bg-background font-sans">
            <Navbar />
            <LessonClient
                task={task}
                level={level}
                classId={classId}
                lessonId={lessonId}
            />
            <Footer />
        </div>
    )
}
