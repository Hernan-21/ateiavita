"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { AddToClassModal } from "@/components/studio/dashboard/add-to-class-modal";

interface Course {
    id: string;
    title: string;
    description: string | null;
    iconChar: string;
    units: any[];
}

export function CourseGridClient({ courses }: { courses: Course[] }) {
    const [selectedCourse, setSelectedCourse] = useState<{ id: string, title: string } | null>(null);

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {courses.map(course => (
                    <div key={course.id} className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all hover:border-indigo-200 block">
                        <Link href={`/teacher/studio/${course.id}`} className="block h-full">
                            {/* Card Content linked to details */}
                            <div className="h-32 bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center">
                                <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-xl font-bold text-indigo-600">
                                    {course.iconChar || course.title[0]}
                                </div>
                            </div>
                            <div className="p-4 pb-10"> {/* Extra padding bottom for absolute button */}
                                <h3 className="font-bold text-gray-800 group-hover:text-indigo-600 transition-colors mb-1">{course.title}</h3>
                                <p className="text-sm text-gray-500 line-clamp-2">{course.description || "No description"}</p>
                                <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
                                    <span>{course.units.length} Units</span>
                                    <span>Updated recently</span>
                                </div>
                            </div>
                        </Link>

                        {/* Overlay Add Button */}
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setSelectedCourse({ id: course.id, title: course.title });
                            }}
                            className="absolute bottom-3 right-3 w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-indigo-600 text-gray-500 hover:text-white rounded-full transition-all shadow-sm z-10"
                            title="Add to class"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                ))}

                {courses.length === 0 && (
                    <div className="col-span-full py-12 text-center border-2 border-dashed border-gray-200 rounded-xl">
                        <p className="text-gray-400">No courses yet. Create one to get started!</p>
                    </div>
                )}
            </div>

            <AddToClassModal
                isOpen={!!selectedCourse}
                onClose={() => setSelectedCourse(null)}
                courseId={selectedCourse?.id || ""}
                courseTitle={selectedCourse?.title || ""}
            />
        </>
    );
}
