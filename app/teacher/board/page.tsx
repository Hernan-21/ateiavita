import { prisma } from "@/lib/prisma";
import { BoardHeader } from "@/components/studio/board/board-header";
import { ClassList } from "@/components/studio/board/class-list";
import { Plus } from "lucide-react";

export default async function TeacherBoardPage() {
    // Fetch Classes (not courses)
    // For now we mock or use empty list until DB is populated
    const classes = await prisma.schoolClass.findMany({
        orderBy: { createdAt: 'desc' },
        include: { courses: true }
    });

    return (
        <div className="container mx-auto px-6 py-8 max-w-7xl">
            {/* Header for Board */}
            <BoardHeader />

            {/* Class List */}
            <ClassList classes={classes} />
        </div>
    );
}
