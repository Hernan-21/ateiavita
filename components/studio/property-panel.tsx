"use client";

import { useStudio } from "./studio-context";
import { VideoProperties } from "./panels/video-properties";
import { QuizProperties } from "./panels/quiz-properties";
import { Task } from "@/types/content";

export function PropertyPanel() {
    const { state, updateTask } = useStudio();
    const task = state.currentUnit.tasks.find(t => t.id === state.selectedTaskId);

    if (!task) {
        return (
            <div className="p-8 text-center text-gray-400">
                Select a task to edit its properties
            </div>
        )
    }

    const handleCommonChange = (field: keyof Task | 'points' | 'required', value: any) => {
        if (field === 'points' || field === 'required') {
            updateTask(task.id, {
                settings: { ...task.settings, [field]: value }
            });
        } else {
            updateTask(task.id, { [field]: value });
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="space-y-4 pb-6 border-b border-gray-100">
                <h3 className="font-bold text-gray-900">General Settings</h3>

                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title</label>
                    <input
                        type="text"
                        value={task.title}
                        onChange={(e) => handleCommonChange('title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Points</label>
                        <input
                            type="number"
                            value={task.settings.points}
                            onChange={(e) => handleCommonChange('points', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                    </div>
                    <div className="flex items-end pb-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={task.settings.required}
                                onChange={(e) => handleCommonChange('required', e.target.checked)}
                                className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                            />
                            <span className="text-sm text-gray-700">Required</span>
                        </label>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="font-bold text-gray-900 capitalize">{task.type} Config</h3>
                {renderSpecificPanel(task, updateTask)}
            </div>
        </div>
    )
}

function renderSpecificPanel(task: Task, updateFn: any) {
    switch (task.type) {
        case 'video':
            return <VideoProperties task={task} updateTask={updateFn} />;
        case 'quiz':
            return <QuizProperties task={task} updateTask={updateFn} />;
        default:
            return <div className="text-sm text-gray-500">No specific settings for this type yet.</div>;
    }
}
