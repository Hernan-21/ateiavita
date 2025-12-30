"use client";

import { X, BookOpen, Folder, Star, User } from "lucide-react";
import { useState } from "react";

interface SavedCourse {
    courseId: string;
    course: {
        id: string;
        title: string;
        iconChar?: string;
        color?: string;
    }
}

interface ContentDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    savedCourses: SavedCourse[];
    onMoveToPrep: (courseId: string) => void;
}

export function ContentDrawer({ isOpen, onClose, savedCourses, onMoveToPrep }: ContentDrawerProps) {
    const [activeTab, setActiveTab] = useState("Saved");

    if (!isOpen) return null;

    return (
        <div className="fixed inset-x-0 bottom-0 z-50 flex flex-col items-center justify-end pointer-events-none">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/20 pointer-events-auto"
                onClick={onClose}
            />

            {/* Drawer Panel */}
            <div className="w-full bg-slate-50 rounded-t-2xl shadow-2xl transform transition-transform duration-300 ease-out pointer-events-auto border-t border-gray-200 h-[500px] flex flex-col">
                {/* Drag Handle */}
                <div className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing">
                    <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
                </div>

                {/* Header / Tabs */}
                <div className="px-8 flex items-center justify-between border-b border-gray-200 bg-white sticky top-0">
                    <div className="flex items-center gap-6">
                        {["Saved", "Folders"].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`py-4 text-sm font-semibold border-b-2 transition-colors ${activeTab === tab
                                    ? "border-indigo-600 text-indigo-700 bg-indigo-50/50 px-4 rounded-t-lg"
                                    : "border-transparent text-gray-500 hover:text-gray-800"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-8 bg-slate-50">

                    {activeTab === "Saved" && (
                        <div className="max-w-7xl mx-auto">
                            <div className="text-center mb-8">
                                <p className="text-gray-500 text-sm">
                                    This area is for any materials you may want to use with this class in the future.
                                </p>
                            </div>

                            {savedCourses.length === 0 ? (
                                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl bg-white/50">
                                    <p className="text-gray-400 font-medium">No saved content yet.</p>
                                    <p className="text-gray-400 text-sm mt-1">Add courses from the Studio to see them here.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {savedCourses.map(item => (
                                        <div key={item.courseId} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all group flex items-start gap-4 cursor-pointer" onClick={() => onMoveToPrep(item.courseId)}>
                                            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg shrink-0">
                                                {item.course.iconChar || 'A'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-0.5">Lesson</div>
                                                <h3 className="font-bold text-gray-800 mb-1 truncate">{item.course.title}</h3>
                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                    <span className="flex items-center gap-1"><User className="w-3 h-3" /> Low Int</span>
                                                </div>
                                            </div>
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity self-center">
                                                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">Move to Prep</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab !== "Saved" && (
                        <div className="flex items-center justify-center h-full text-gray-400 italic">
                            {activeTab} feature coming soon...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
