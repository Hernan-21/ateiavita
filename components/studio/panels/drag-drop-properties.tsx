"use client";

import { DragDropTask } from "@/types/content";

export function DragDropProperties({ task, updateTask }: { task: DragDropTask, updateTask: any }) {

    const updatePayload = (field: string, value: any) => {
        updateTask(task.id, {
            payload: { ...task.payload, [field]: value }
        });
    }

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Target Word</label>
                    <input
                        type="text"
                        value={task.payload.word || ""}
                        onChange={(e) => updatePayload('word', e.target.value.toUpperCase())}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono tracking-widest bg-white text-gray-900 placeholder:text-gray-400"
                        placeholder="e.g. HOUSE"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                        Enter the word students need to form. It will be scrambled automatically.
                    </p>
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Hint / Question</label>
                    <input
                        type="text"
                        value={task.payload.hint || ""}
                        onChange={(e) => updatePayload('hint', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 placeholder:text-gray-400"
                        placeholder="e.g. Translate 'Casa'"
                    />
                </div>
            </div>
        </div>
    )
}
