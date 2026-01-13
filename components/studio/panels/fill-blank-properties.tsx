"use client";

import { FillBlankTask } from "@/types/content";

export function FillBlankProperties({ task, updateTask }: { task: FillBlankTask, updateTask: any }) {

    const updatePayload = (field: string, value: any) => {
        updateTask(task.id, {
            payload: { ...task.payload, [field]: value }
        });
    }

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Sentence</label>
                    <input
                        type="text"
                        value={task.payload.sentence || ""}
                        onChange={(e) => updatePayload('sentence', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 placeholder:text-gray-400"
                        placeholder="e.g. The cat is _____ the table"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                        Use 5 underscores (_____) to represent the blank.
                    </p>
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Correct Answer</label>
                    <input
                        type="text"
                        value={task.payload.correctAnswer || ""}
                        onChange={(e) => updatePayload('correctAnswer', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 placeholder:text-gray-400"
                        placeholder="e.g. on"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                        The exact word the student needs to type.
                    </p>
                </div>
            </div>
        </div>
    )
}
