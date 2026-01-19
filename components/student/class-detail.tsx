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
    const [activeTab, setActiveTab] = useState("current");

    // Helper to get consistent visual style (color + animal icon) matches StudentDashboard
    const getClassStyle = (str: string) => {
        const styles = [
            { border: 'bg-green-500', bg: 'bg-green-100', text: 'text-green-700', icon: '🐟', theme: 'green' },   // Fish
            { border: 'bg-yellow-400', bg: 'bg-yellow-100', text: 'text-yellow-700', icon: '🐥', theme: 'yellow' }, // Duck
            { border: 'bg-red-500', bg: 'bg-red-100', text: 'text-red-700', icon: '🐼', theme: 'red' },       // Panda
            { border: 'bg-blue-500', bg: 'bg-blue-100', text: 'text-blue-700', icon: '🐳', theme: 'blue' },      // Whale
            { border: 'bg-indigo-500', bg: 'bg-indigo-100', text: 'text-indigo-700', icon: '🐙', theme: 'indigo' }, // Octopus
            { border: 'bg-purple-500', bg: 'bg-purple-100', text: 'text-purple-700', icon: '🦄', theme: 'purple' }  // Unicorn
        ];
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return styles[Math.abs(hash) % styles.length];
    };

    const style = getClassStyle(classId + className);

    // Filter courses based on active tab
    // Logic assumption: 
    // 'current' -> status 'teaching'
    // 'past' -> status 'taught'
    // 'media', 'my picks' -> currently no data, so show empty or all? defaulting to specific filtering if data existed.
    // For now, let's just filter simply or show all if tab logic isn't strictly defined by data yet.
    // Based on `courses` prop, we have `status`.

    const filteredCourses = courses.filter(c => {
        if (activeTab === 'current') return c.status === 'teaching';
        if (activeTab === 'past') return c.status === 'taught' || c.status === 'completed';
        return false;
    });

    // Fallback: If no logic for Media/My Picks, we might just show nothing or a placeholder.
    // Displaying all for now if tab logic is unsure? No, users prefer filtering.

    return (
        <div className="animate-in fade-in duration-300">
            {/* Header with Yellow Background (Reference Style) */}
            <div className="relative px-4 sm:px-6 lg:px-8 py-8 bg-gradient-to-br from-amber-50 via-yellow-50/50 to-amber-50 rounded-3xl border border-amber-100/50 shadow-sm mb-8">


                <Link href="/" className="inline-flex items-center text-sm font-medium text-amber-900 hover:text-amber-800 mb-6 transition-colors">
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back to Dashboard
                </Link>

                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 relative z-10">
                    <div className="flex items-center gap-6">
                        <div className={`w-24 h-24 rounded-3xl bg-white flex items-center justify-center text-4xl shadow-xl shrink-0 border border-amber-200`}>
                            {style.icon}
                        </div>

                        <div>
                            <h1 className="text-4xl font-bold text-slate-900 font-serif mb-2">{className}</h1>
                            <p className="text-slate-600 font-medium text-lg">{classDescription || "General Level"}</p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex items-center gap-1 bg-white/80 backdrop-blur-md p-1 rounded-xl border border-white shadow-sm">
                        {['Current', 'Past', 'Media', 'My Picks'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab.toLowerCase())}
                                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${activeTab === tab.toLowerCase()
                                    ? 'bg-white text-indigo-600 shadow-md font-bold'
                                    : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content List */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 divide-y divide-gray-100 overflow-hidden">
                {filteredCourses.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        {activeTab === 'media' || activeTab === 'my picks'
                            ? "This section is coming soon."
                            : "No lessons available in this status."}
                    </div>
                ) : (
                    filteredCourses.map(({ course, status }) => (
                        <div
                            key={course.id}
                            onClick={() => router.push(`/student/courses/${course.id}`)}
                            className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer group"
                        >
                            <div className="flex items-center gap-5">
                                {/* Lesson Icon Avatar */}
                                <div className={`w-12 h-12 rounded-full ${style.bg} flex items-center justify-center text-xl text-gray-700 shrink-0`}>
                                    <span className={style.text}>{course.iconChar || '📖'}</span>
                                </div>

                                <div>
                                    <p className="text-xs font-bold text-indigo-600 uppercase tracking-wide mb-1">
                                        Lesson
                                    </p>
                                    <h3 className="text-xl font-bold text-slate-900 font-serif group-hover:text-indigo-600 transition-colors">
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
