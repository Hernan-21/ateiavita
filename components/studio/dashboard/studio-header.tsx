"use client";

import { Search, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function StudioHeader() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('classes');

    const handleCreateCourse = async () => {
        const title = window.prompt("Enter class/course title:");
        if (!title) return;

        try {
            const res = await fetch("/api/courses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, description: "New course" })
            });

            if (res.ok) {
                router.refresh();
            }
        } catch (error) {
            console.error("Failed to create course", error);
            alert("Failed to create course");
        }
    };

    return (
        <div className="space-y-6 mb-8">
            {/* Top Tabs */}
            <div className="flex items-center gap-8 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('classes')}
                    className={`pb-4 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'classes' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Classes
                </button>
                <button
                    onClick={() => setActiveTab('students')}
                    className={`pb-4 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'students' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Students
                </button>
            </div>

            {/* Main Action Bar */}
            <div className="flex flex-col gap-4">
                {/* Create Button */}
                <div>
                    <button
                        onClick={handleCreateCourse}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2.5 rounded-md shadow-sm flex items-center gap-2 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Create class
                    </button>
                </div>

                {/* Search & Filters */}
                <div className="flex items-center justify-between gap-4">
                    {/* Search Input */}
                    <div className="flex-1 max-w-2xl relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <div className="absolute top-1/2 -translate-y-1/2 left-10 text-xs text-gray-400 font-medium">Search for a class</div>
                        <input
                            type="text"
                            className="w-full pl-36 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none placeholder-gray-400"
                            placeholder="Type a class name"
                        />
                    </div>

                    {/* Filter Toggles */}
                    <div className="flex items-center bg-gray-100 p-1 rounded-lg">
                        <button className="px-4 py-1.5 text-sm font-medium bg-indigo-600 text-white rounded-md shadow-sm">
                            Active (7)
                        </button>
                        <button className="px-4 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900">
                            Archived (12)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
