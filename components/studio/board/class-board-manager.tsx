"use client";

import { useState } from "react";
import { FolderPlus } from "lucide-react";
import { KanbanBoard } from "@/components/studio/board/kanban-board";
import { ContentDrawer } from "@/components/studio/board/content-drawer";
import { useRouter } from "next/navigation";

interface CourseAssignment {
    classId: string;
    courseId: string;
    status: string;
    isSaved?: boolean;
    course: {
        id: string;
        title: string;
        iconChar?: string;
        color?: string;
    }
}

interface ClassBoardManagerProps {
    classId: string;
    assignments: CourseAssignment[]; // Active ones (Kanban)
    savedCourses: CourseAssignment[]; // Saved ones (Drawer)
}

export function ClassBoardManager({ classId, assignments, savedCourses }: ClassBoardManagerProps) {
    const router = useRouter();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // We can optimistic update here if we want, but for now we'll rely on router.refresh() 
    // triggered by the child components interaction logic which calls APIs.

    // Actually, the Drawer "Move to Prep" needs to call the API.
    const handleMoveToPrep = async (courseId: string) => {
        try {
            await fetch(`/api/classes/${classId}/courses`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ courseId, status: "prepping" })
            });
            router.refresh();
            // Optional: Close drawer after moving
            // setIsDrawerOpen(false); 
        } catch (error) {
            console.error("Failed to move course", error);
            alert("Failed to move course");
        }
    };

    return (
        <>
            {/* Kanban Board */}
            <KanbanBoard
                classId={classId}
                initialAssignments={assignments}
            />

            {/* Content Drawer Trigger */}
            <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 transition-transform duration-300 ${isDrawerOpen ? 'translate-y-24 opacity-0' : 'translate-y-0 opacity-100'}`}>
                <button
                    onClick={() => setIsDrawerOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full shadow-lg font-medium flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                >
                    <FolderPlus className="w-5 h-5" />
                    Content Drawer
                </button>
            </div>

            {/* Content Drawer */}
            <ContentDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                savedCourses={savedCourses}
                onMoveToPrep={handleMoveToPrep}
            />
        </>
    );
}
