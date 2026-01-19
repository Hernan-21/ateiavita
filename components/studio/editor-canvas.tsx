"use client";

import { useStudio } from "./studio-context";
import { Trash2, GripVertical, Video, FileText, CheckSquare, Music, MessageCircle, Type } from "lucide-react";
import { TaskPropertiesInline } from "./task-properties-inline";

const ICONS = {
    video: Video,
    quiz: CheckSquare,
    pdf: FileText,
    audio: Music,
    matching: GripVertical,
    fill_blank: FileText,
    drag_drop: GripVertical,
    conversation: MessageCircle,
    text: Type
}

export function EditorCanvas() {
    const { state, selectTask, deleteTask, updateUnit, updateTask } = useStudio();

    return (
        <div className="w-full max-w-3xl space-y-8 pb-20">
            {/* Header / Title Editor */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <input
                    type="text"
                    value={state.currentUnit.title}
                    onChange={(e) => updateUnit({ title: e.target.value })}
                    className="text-3xl font-bold text-gray-800 w-full border-b border-transparent hover:border-gray-200 focus:border-indigo-500 focus:outline-none bg-transparent placeholder-gray-300"
                    placeholder="Untitled Unit"
                />
                <p className="text-gray-400 mt-2">
                    {state.currentUnit.tasks.length} tasks in this lesson
                </p>
            </div>

            {/* Task List */}
            <div className="space-y-4">
                {state.currentUnit.tasks.map((task) => {
                    const Icon = ICONS[task.type as keyof typeof ICONS] || FileText;
                    const isSelected = state.selectedTaskId === task.id;

                    return (
                        <div
                            key={task.id}
                            onClick={() => selectTask(isSelected ? null : task.id)}
                            className={`group relative bg-white rounded-xl border-2 transition-all cursor-pointer overflow-hidden ${isSelected ? 'border-indigo-500 shadow-md ring-4 ring-indigo-50' : 'border-gray-100 hover:border-indigo-200 hover:shadow-sm'}`}
                        >
                            <div className="p-6 flex items-start gap-4">
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'}`}>
                                    <Icon className="w-6 h-6" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    {isSelected ? (
                                        <input
                                            type="text"
                                            value={task.title}
                                            onChange={(e) => updateTask(task.id, { title: e.target.value })}
                                            className="w-full text-lg font-bold border-b border-indigo-500 focus:outline-none focus:border-indigo-700"
                                            placeholder="Task title"
                                        />
                                    ) : (
                                        <h3 className={`font-bold text-lg truncate ${isSelected ? 'text-indigo-900' : 'text-gray-800'}`}>
                                            {task.title}
                                        </h3>
                                    )}
                                    <p className="text-sm text-gray-500 truncate">
                                        ID: {task.id} • {task.type.toUpperCase()}
                                    </p>
                                </div>

                                <button
                                    onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
                                    className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Inline Settings Panel */}
                            {isSelected && (
                                <div className="border-t border-gray-100 p-6 bg-gray-50/50 cursor-default" onClick={(e) => e.stopPropagation()}>
                                    <TaskPropertiesInline task={task} />
                                </div>
                            )}
                        </div>
                    )
                })}

                {state.currentUnit.tasks.length === 0 && (
                    <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-xl">
                        <p className="text-gray-400">Drag items here or click on the toolbox to add tasks</p>
                    </div>
                )}
            </div>
        </div>
    )
}
