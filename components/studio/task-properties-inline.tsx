"use client";

import { Task } from "@/types/content";
import { useStudio } from "./studio-context";
import { VideoProperties } from "./panels/video-properties";
import { QuizProperties } from "./panels/quiz-properties";
import { DragDropProperties } from "./panels/drag-drop-properties";
import { ConversationProperties } from "./panels/conversation-properties";
import { MatchingProperties } from "./panels/matching-properties";
import { FillBlankProperties } from "./panels/fill-blank-properties";

export function TaskPropertiesInline({ task }: { task: Task }) {
    const { updateTask } = useStudio();

    const handleCommonChange = (field: keyof Task | 'points' | 'required', value: any) => {
        if (field === 'points' || field === 'required') {
            updateTask(task.id, {
                settings: { ...task.settings, [field]: value }
            });
        } else {
            updateTask(task.id, { [field]: value });
        }
    };

    const updateFn = updateTask;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Task Title</label>
                    <input
                        type="text"
                        value={task.title}
                        onChange={(e) => handleCommonChange('title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 placeholder:text-gray-400"
                        placeholder="Enter task title"
                    />
                </div>

                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Points</label>
                        <input
                            type="number"
                            value={task.settings.points}
                            onChange={(e) => handleCommonChange('points', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm bg-white text-gray-900"
                        />
                    </div>
                    <div className="flex items-end pb-2">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={task.settings.required}
                                onChange={(e) => handleCommonChange('required', e.target.checked)}
                                className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                            />
                            <span className="text-sm font-medium text-gray-700">Required</span>
                        </label>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h4 className="text-xs font-bold text-gray-400 uppercase mb-4 border-b border-gray-100 pb-2">
                    {task.type.replace('_', ' ')} Configuration
                </h4>
                {renderSpecificPanel(task, updateFn)}
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
        case 'drag_drop':
            return <DragDropProperties task={task} updateTask={updateFn} />;
        case 'conversation':
            return <ConversationProperties task={task} updateTask={updateFn} />;
        case 'matching':
            return <MatchingProperties task={task} updateTask={updateFn} />;
        case 'fill_blank':
            return <FillBlankProperties task={task} updateTask={updateFn} />;
        default:
            return <div className="text-sm text-gray-500 italic">No specific configuration available.</div>;
    }
}
