"use client";

import { useState, useEffect } from "react";
import { MoreHorizontal, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

// Define the three columns
const COLUMNS = [
    { id: "prepping", title: "Prepping", color: "bg-green-500" },
    { id: "teaching", title: "Teaching", color: "bg-indigo-500" },
    { id: "taught", title: "Taught", color: "bg-gray-500" },
];

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

interface KanbanBoardProps {
    classId: string;
    initialAssignments: CourseAssignment[];
}

export function KanbanBoard({ classId, initialAssignments }: KanbanBoardProps) {
    const router = useRouter();
    const [assignments, setAssignments] = useState(initialAssignments);

    // Sync state if props change (e.g. from Drawer interaction)
    useEffect(() => {
        setAssignments(initialAssignments);
    }, [initialAssignments]);

    const onDragEnd = async (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const newStatus = destination.droppableId;
        const oldStatus = source.droppableId;

        // Optimistic Update
        // 1. Find the item
        const itemIndex = assignments.findIndex(a => a.courseId === draggableId);
        if (itemIndex === -1) return;

        const updatedItem = { ...assignments[itemIndex], status: newStatus };

        // 2. Remove from old position and insert into new position logic is tricky with a single flat list.
        // For visual consistency in DnD, we ideally update the order. 
        // But since we don't persist order, we just update the status. 
        // The UI will re-render based on status filtering.
        // However, standard DnD libraries expect the item to stay where dropped.
        // Since we map filtered lists, simply changing status moves it to the other list logic.

        setAssignments(prev => prev.map(a =>
            a.courseId === draggableId ? { ...a, status: newStatus } : a
        ));

        // API Call
        if (newStatus !== oldStatus) {
            try {
                await fetch(`/api/classes/${classId}/courses`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ courseId: draggableId, status: newStatus })
                });
                router.refresh();
            } catch (error) {
                console.error("Failed to update status", error);
                // Revert could comprise fetching data again or undoing local state
                // For now, we trust router.refresh() or keep it as is (optimistic).
            }
        }
    };

    const getColumnAssignments = (status: string) => {
        return assignments.filter(a => a.status === status);
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-6 overflow-x-auto pb-4">
                {COLUMNS.map(col => (
                    <div key={col.id} className="flex-1 min-w-[300px] bg-gray-50/50 rounded-xl p-4 border border-gray-100 flex flex-col">
                        {/* Column Header */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-gray-700">{col.title}</h3>
                                <span className="bg-white px-2 py-0.5 rounded text-xs font-bold text-gray-500 border border-gray-200">
                                    {getColumnAssignments(col.id).length}
                                </span>
                            </div>
                            <Info className="w-4 h-4 text-gray-400 cursor-help" />
                        </div>

                        {/* Droppable Area */}
                        <Droppable droppableId={col.id}>
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className={`space-y-3 flex-1 min-h-[150px] transition-colors rounded-lg ${snapshot.isDraggingOver ? 'bg-indigo-50/50 ring-2 ring-indigo-100 ring-inset' : ''}`}
                                >
                                    {getColumnAssignments(col.id).map((assignment, index) => (
                                        <Draggable key={assignment.courseId} draggableId={assignment.courseId} index={index}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    style={{ ...provided.draggableProps.style }}
                                                    className={`bg-white p-4 rounded-lg border shadow-sm transition-all group relative ${snapshot.isDragging ? 'shadow-lg ring-2 ring-indigo-500 rotate-2 z-50' : 'border-gray-200 hover:shadow-md'}`}
                                                >
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-8 h-8 rounded-full ${col.color} flex items-center justify-center text-white font-bold text-xs ring-2 ring-white`}>
                                                                {assignment.course.iconChar || 'A'}
                                                            </div>
                                                            <div>
                                                                <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">Lesson</div>
                                                                <div className="font-semibold text-gray-800 text-sm">{assignment.course.title}</div>
                                                            </div>
                                                        </div>
                                                        <button className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded">
                                                            <MoreHorizontal className="w-4 h-4" />
                                                        </button>
                                                    </div>

                                                    {/* Saved Indicator if exists */}
                                                    {assignment.isSaved && (
                                                        <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600 border border-gray-200">
                                                            Also saved
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}

                                    {getColumnAssignments(col.id).length === 0 && !snapshot.isDraggingOver && (
                                        <div className="h-full flex items-center justify-center text-gray-400 text-sm italic border-2 border-dashed border-gray-100 rounded-lg min-h-[100px]">
                                            Drop items here
                                        </div>
                                    )}
                                </div>
                            )}
                        </Droppable>
                    </div>
                ))}
            </div>
        </DragDropContext>
    );
}
