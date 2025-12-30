"use client";

import { Search, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function BoardHeader() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('classes');

    const handleCreateClass = async () => {
        const name = window.prompt("Enter new class name:");
        if (!name) return;

        try {
            const res = await fetch("/api/classes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name })
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
        <div className="space-y-6 mb-4">
            {/* Top Action Bar */}
            <div>
                <button
                    onClick={handleCreateClass}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2.5 rounded-md shadow-sm flex items-center gap-2 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Create class
                </button>
            </div>

            {/* Search & Filters Row */}
            <div className="flex items-center gap-4">
                {/* Search Input (Full Width) */}
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <div className="absolute top-2.5 left-12 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Search for a class</div>
                    <input
                        type="text"
                        className="w-full pl-12 pr-4 pt-6 pb-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none placeholder-gray-300 text-gray-700"
                        placeholder="Type a class name"
                    />
                </div>

                {/* Filter Toggles */}
                <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Show Classes</span>
                    <div className="flex items-center bg-gray-100 p-1 rounded-full border border-gray-200">
                        <button className="px-4 py-1 text-sm font-medium bg-indigo-600 text-white rounded-full shadow-sm transition-all">
                            Active (7)
                        </button>
                        <button className="px-4 py-1 text-sm font-medium text-gray-500 hover:text-gray-900 transition-all">
                            Archived (12)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
