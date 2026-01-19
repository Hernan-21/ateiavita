"use client";

import { TextTask } from "@/types/content";

export function TextProperties({ task, updateTask }: { task: TextTask, updateTask: any }) {

    const updatePayload = (field: string, value: any) => {
        updateTask(task.id, {
            payload: { ...task.payload, [field]: value }
        });
    }

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Content (Markdown / HTML)</label>
                    <textarea
                        value={task.payload.content || ""}
                        onChange={(e) => updatePayload('content', e.target.value)}
                        className="w-full h-48 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 placeholder:text-gray-400 font-mono"
                        placeholder="Enter your descriptive text here. Supports Markdown."
                    />
                    <p className="text-xs text-gray-400 mt-1">
                        This text will be displayed to students. You can use standard Markdown.
                    </p>
                </div>
            </div>
        </div>
    )
}
