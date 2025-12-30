"use client";

import { VideoTask } from "@/types/content";

export function VideoProperties({ task, updateTask }: { task: VideoTask, updateTask: any }) {

    const updatePayload = (key: string, value: any) => {
        updateTask(task.id, {
            payload: { ...task.payload, [key]: value }
        });
    }

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Provider</label>
                <select
                    value={task.payload.provider}
                    onChange={(e) => updatePayload('provider', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white"
                >
                    <option value="youtube">YouTube</option>
                    <option value="vimeo">Vimeo</option>
                    <option value="bunny">Bunny.net</option>
                </select>
            </div>

            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Video URL / ID</label>
                <input
                    type="text"
                    value={task.payload.url}
                    onChange={(e) => updatePayload('url', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono"
                    placeholder="e.g. dQw4w9WgXcQ"
                />
                <p className="text-xs text-gray-400 mt-1">Paste the full URL or just the ID</p>
            </div>
        </div>
    )
}
