"use client";

import { TaskSelector } from "@/components/studio/task-selector";
import { EditorCanvas } from "@/components/studio/editor-canvas";
import { PropertyPanel } from "@/components/studio/property-panel";
import { JsonPreview } from "@/components/studio/json-preview";
import { useState } from "react";
import { useStudio } from "./studio-context";
import { Save } from "lucide-react";

export function StudioLayout() {
    const [showJson, setShowJson] = useState(false);
    const { saveUnit } = useStudio();

    return (
        <div className="flex-1 flex overflow-hidden">
            {/* Left Sidebar: Components */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0">
                <div className="p-4 border-b border-gray-100">
                    <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Toolbox</h2>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                    <TaskSelector />
                </div>
                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={() => setShowJson(!showJson)}
                        className="w-full py-2 px-3 text-xs font-mono bg-gray-100 hover:bg-gray-200 text-gray-600 rounded flex items-center justify-center gap-2"
                    >
                        {showJson ? "Hide JSON" : "Show JSON Output"}
                    </button>
                </div>
            </aside>

            {/* Center: Canvas / Preview */}
            <main className="flex-1 bg-gray-50 flex flex-col relative overflow-hidden">
                <div className="flex-1 overflow-y-auto p-8 flex justify-center">
                    {showJson ? <JsonPreview /> : <EditorCanvas />}
                </div>
            </main>

            {/* Right Sidebar: Properties */}
            <aside className="w-80 bg-white border-l border-gray-200 flex flex-col shrink-0">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Properties</h2>
                    <button
                        onClick={() => saveUnit()}
                        className="flex items-center gap-1 bg-indigo-600 text-white px-3 py-1.5 rounded-md text-xs font-medium hover:bg-indigo-700 transition-colors"
                    >
                        <Save className="h-3 w-3" />
                        Save Changes
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                    <PropertyPanel />
                </div>
            </aside>
        </div>
    )
}
