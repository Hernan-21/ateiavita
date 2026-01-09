"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, CheckCircle, Lock, PlayCircle } from "lucide-react";
import { useRouter } from "next/navigation";

// Define strict types matching the Prisma fetch result
interface CourseData {
    id: string;
    title: string;
    description: string | null;
    iconChar: string;
    color: string;
}

interface ClassCourse {
    course: CourseData;
    status: string; // 'teaching' | 'taught'
    assignedAt: Date;
}

interface ClassDetailProps {
    classId: string;
    className: string;
    classDescription: string | null;
    courses: ClassCourse[];
}

export function ClassDetailView({ classId, className, classDescription, courses }: ClassDetailProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("currrent"); // Typo in design 'currrent' -> fixed to 'current'

    // Helper to get consistent visual style (color + animal icon) matches StudentDashboard
    const getClassStyle = (str: string) => {
        const styles = [
            { border: 'bg-green-500', bg: 'bg-green-100', text: 'text-green-700', icon: '🐟' },   // Fish
            { border: 'bg-yellow-400', bg: 'bg-yellow-100', text: 'text-yellow-700', icon: '🐥' }, // Duck
            { border: 'bg-red-500', bg: 'bg-red-100', text: 'text-red-700', icon: '🐼' },       // Panda
            { border: 'bg-blue-500', bg: 'bg-blue-100', text: 'text-blue-700', icon: '🐳' },      // Whale
            { border: 'bg-indigo-500', bg: 'bg-indigo-100', text: 'text-indigo-700', icon: '🐙' }, // Octopus
            { border: 'bg-purple-500', bg: 'bg-purple-100', text: 'text-purple-700', icon: '🦄' }  // Unicorn
        ];
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return styles[Math.abs(hash) % styles.length];
    };

    const style = getClassStyle(classId + className);

    return (
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 animate-in fade-in duration-300">
            {/* Header */}
            <div className="mb-8">
                {/* Back Link */}
                <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors">
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back to Dashboard
                </Link>

                {/* Class Title Card */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex min-h-[140px]">
                    {/* Left Strip */}
                    <div className={`w-4 ${style.border}`} />

                    {/* Content */}
                    <div className="p-8 flex flex-col justify-center">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{className}</h1>
                        <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full ${style.bg} flex items-center justify-center text-sm ${style.text}`}>
                                {style.icon}
                            </div>
                            <span className="text-lg font-medium text-gray-700">{classDescription || "General Level"}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-8 border-b border-gray-200 mb-8 overflow-x-auto">
                {['Current', 'Past', 'Media', 'My Picks'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab.toLowerCase())}
                        className={`pb-3 text-base font-semibold transition-all relative whitespace-nowrap ${(activeTab === tab.toLowerCase() || (activeTab === 'currrent' && tab === 'Current'))
                                ? 'text-[#5865F2]'
                                : 'text-gray-500 hover:text-gray-800'
                            }`}
                    >
                        {tab}
                        {(activeTab === tab.toLowerCase() || (activeTab === 'currrent' && tab === 'Current')) && (
                            <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#5865F2] rounded-t-full" />
                        )}
                    </button>
                ))}
            </div>

            {/* Content List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
                {courses.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        No lessons available in this status.
                    </div>
                ) : (
                    courses.map(({ course, status }) => (
                        <div
                            key={course.id}
                            onClick={() => router.push(`/student/courses/${course.id}`)}
                            className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer group"
                        >
                            <div className="flex items-center gap-5">
                                {/* Lesson Icon Avatar */}
                                <div className={`w-12 h-12 rounded-full ${style.bg} flex items-center justify-center text-xl text-gray-700 shrink-0`}>
                                    {/* Using a consistent icon for Lessons as per screenshot (generic avatars) */}
                                    {/* Or use the course.iconChar if available, but screenshot shows illustrated avatars */}
                                    {/* For now, we'll use a clean icon or the course char */}
                                    <span className={style.text}>{course.iconChar || '📖'}</span>
                                </div>

                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                                        Lesson
                                    </p>
                                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#5865F2] transition-colors">
                                        {course.title}
                                    </h3>
                                </div>
                            </div>

                            {/* Status Indicator */}
                            <div className="flex items-center">
                                {status === 'taught' || status === 'completed' ? (
                                    <div className="flex items-center gap-2 text-green-600 font-bold text-sm bg-green-50 px-3 py-1.5 rounded-full">
                                        <CheckCircle className="w-4 h-4 fill-current" />
                                        Complete
                                    </div>
                                ) : (
                                    <div className="text-gray-400 group-hover:text-[#5865F2] transition-transform group-hover:translate-x-1">
                                        <PlayCircle className="w-6 h-6" />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
