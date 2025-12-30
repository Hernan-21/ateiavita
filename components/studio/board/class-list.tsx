"use client";

import { MoreHorizontal, Trash2, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ClassListProps {
    classes: any[]; // Using any for simplicity in rapid dev, ideally define type
}

export function ClassList({ classes }: ClassListProps) {
    const router = useRouter();
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    const handleDelete = async (e: React.MouseEvent, classId: string) => {
        e.stopPropagation(); // Prevent row click
        if (!confirm("Are you sure you want to delete this class?")) return;

        try {
            await fetch(`/api/classes/${classId}`, { method: 'DELETE' });
            router.refresh();
        } catch (error) {
            alert("Failed to delete class");
        }
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden min-h-[400px]">
            {/* Header Row */}
            <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 text-sm font-bold text-gray-500 bg-white items-center">
                <div className="col-span-1">
                    <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                </div>
                <div className="col-span-5 flex items-center gap-1 cursor-pointer hover:text-gray-700">
                    Name <span className="text-[10px]">↓Z</span>
                </div>
                <div className="col-span-2">Level</div>
                <div className="col-span-2">Students</div>
                <div className="col-span-2">Role</div>
            </div>

            <div className="bg-white divide-y divide-gray-50">
                {classes.length === 0 ? (
                    <div className="py-20 text-center flex flex-col items-center justify-center text-gray-400">
                        <p className="italic">No active classes found.</p>
                        <p className="text-sm mt-2">Create one to get started.</p>
                    </div>
                ) : (
                    classes.map((cls, index) => {
                        // Generate a predictable color based on index
                        const colors = ['bg-blue-500', 'bg-green-500', 'bg-indigo-600', 'bg-pink-500', 'bg-orange-400'];
                        const colorClass = colors[index % colors.length];

                        return (
                            <div
                                key={cls.id}
                                className="grid grid-cols-12 gap-4 px-6 py-5 hover:bg-gray-50 items-center group transition-colors cursor-pointer"
                                onClick={() => router.push(`/teacher/board/${cls.id}`)}
                            >
                                <div className="col-span-1" onClick={(e) => e.stopPropagation()}>
                                    <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                                </div>

                                <div className="col-span-5 flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full ${colorClass} shadow-sm overflow-hidden flex items-center justify-center shrink-0`}>
                                        {/* Placeholder Avatar or Icon */}
                                    </div>
                                    <span className="font-semibold text-gray-800 text-base">{cls.name}</span>
                                </div>

                                <div className="col-span-2 text-sm text-gray-600 font-medium">
                                    Adv
                                </div>

                                <div className="col-span-2 text-sm text-gray-600 font-medium">9</div>

                                <div className="col-span-2 flex items-center justify-between text-sm text-gray-600">
                                    <span>Lead Teacher</span>

                                    {/* Action Menu */}
                                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                                        <button
                                            className="p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
                                            onClick={() => setOpenMenuId(openMenuId === cls.id ? null : cls.id)}
                                        >
                                            <MoreHorizontal className="w-5 h-5" />
                                        </button>

                                        {openMenuId === cls.id && (
                                            <>
                                                <div
                                                    className="fixed inset-0 z-10"
                                                    onClick={() => setOpenMenuId(null)}
                                                />
                                                <div className="absolute right-0 top-8 z-20 bg-white border border-gray-200 shadow-xl rounded-lg w-40 py-1 animate-in fade-in zoom-in-95 duration-100">
                                                    <button
                                                        onClick={(e) => handleDelete(e, cls.id)}
                                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        Delete
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    );
}
