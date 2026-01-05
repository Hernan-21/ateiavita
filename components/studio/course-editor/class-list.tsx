"use client";

import { LessonUnit } from "@/types/content";
import { Plus, GripVertical, FileText, Video, HelpCircle } from "lucide-react";
import Link from "next/link";

import { useRouter } from "next/navigation";

interface ClassListProps {
    courseId: string;
    units: LessonUnit[];
    onCreateClass?: () => void;
}

export function ClassList({ courseId, units }: ClassListProps) {
    const router = useRouter();

    const handleCreateClass = async () => {
        const title = window.prompt("Enter content name:");
        if (!title) return;

        try {
            const res = await fetch(`/api/courses/${courseId}/units`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title })
            });

            if (res.ok) {
                router.refresh();
            }
        } catch (error) {
            console.error("Failed to create class", error);
            alert("Failed to create class");
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Content</h2>
                <button
                    onClick={handleCreateClass}
                    className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                >
                    <Plus className="h-4 w-4" />
                    New Content
                </button>
            </div>

            <div className="grid gap-3">
                {units.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-xl">
                        <p className="text-gray-400">No content yet. Create your first one!</p>
                    </div>
                ) : (
                    units.map((unit, index) => (
                        <Link
                            key={unit.id}
                            href={`/teacher/studio/${courseId}/${unit.id}`}
                            className="group flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-primary/50 hover:shadow-sm transition-all"
                        >
                            <div className="flex items-center gap-4">
                                <div className="text-gray-300 font-mono text-sm w-6">
                                    {(index + 1).toString().padStart(2, '0')}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                                        {unit.title}
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        {unit.tasks.length} content items
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-gray-400 group-hover:text-gray-500">
                                {/* Preview of content types in class could go here */}
                                <div className="flex -space-x-1 mr-4">
                                    {unit.tasks.slice(0, 3).map(t => (
                                        <div key={t.id} className="w-6 h-6 rounded-full bg-gray-100 border border-white flex items-center justify-center text-[10px]">
                                            {t.type[0].toUpperCase()}
                                        </div>
                                    ))}
                                    {unit.tasks.length > 3 && (
                                        <div className="w-6 h-6 rounded-full bg-gray-50 border border-white flex items-center justify-center text-[10px] font-bold">
                                            +{unit.tasks.length - 3}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
