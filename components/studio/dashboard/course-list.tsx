"use client";

import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Level } from "@/types/content";
import Link from "next/link";

interface CourseListProps {
    courses: Level[];
}

export function CourseList({ courses }: CourseListProps) {
    return (
        <div className="w-full">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-gray-100 text-sm font-bold text-gray-500 bg-white">
                <div className="col-span-5 flex items-center gap-2">
                    <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                    <button className="flex items-center gap-1 hover:text-gray-700">
                        Name
                        <ArrowUpDown className="w-3 h-3" />
                    </button>
                </div>
                <div className="col-span-3">Level</div>
                <div className="col-span-2">Students</div>
                <div className="col-span-2">Role</div>
            </div>

            {/* Table Body */}
            <div className="bg-white">
                {courses.length === 0 ? (
                    <div className="py-12 text-center text-gray-400 italic">
                        No active classes found.
                    </div>
                ) : (
                    courses.map((course, index) => {
                        // Mock random data for visual completeness
                        const studentCount = Math.floor(Math.random() * 20);
                        const role = "Lead Teacher";
                        const levelLabel = ["Low Beg", "High Int", "Adv"][index % 3];

                        return (
                            <div key={course.id} className="group grid grid-cols-12 gap-4 px-4 py-4 border-b border-gray-50 hover:bg-gray-50 items-center transition-colors">
                                {/* Name Col */}
                                <div className="col-span-5 flex items-center gap-4">
                                    <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm`} style={{ backgroundColor: course.color || '#6366f1' }}>
                                        {course.iconChar || course.title[0]}
                                    </div>

                                    <Link href={`/teacher/studio/${course.id}`} className="font-semibold text-gray-800 hover:text-indigo-600 truncate block">
                                        {course.title}
                                    </Link>
                                </div>

                                {/* Level Col */}
                                <div className="col-span-3 text-sm text-gray-600">
                                    {course.description || levelLabel}
                                </div>

                                {/* Students Col */}
                                <div className="col-span-2 text-sm text-gray-600 pl-2">
                                    {studentCount}
                                </div>

                                {/* Role Col */}
                                <div className="col-span-2 flex items-center justify-between text-sm text-gray-600">
                                    <span>{role}</span>
                                    <button className="p-1.5 hover:bg-gray-200 rounded-full text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-all">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    );
}
