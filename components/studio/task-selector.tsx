"use client";

import { useStudio } from "./studio-context";
import { Video, FileText, CheckSquare, Music, AlignLeft, GripVertical, MessageCircle, Type } from "lucide-react";
import { TaskType } from "@/types/content";

const TOOLS: { type: TaskType; label: string; icon: React.ElementType; color: string }[] = [
    { type: 'video', label: 'Video Player', icon: Video, color: 'text-red-500' },
    { type: 'quiz', label: 'Quiz / Exam', icon: CheckSquare, color: 'text-green-500' },
    // { type: 'pdf', label: 'PDF Viewer', icon: FileText, color: 'text-blue-500' }, // Removed in favor of Unit PDF
    { type: 'audio', label: 'Audio Player', icon: Music, color: 'text-purple-500' },
    { type: 'fill_blank', label: 'Fill in Blanks', icon: AlignLeft, color: 'text-orange-500' },
    { type: 'matching', label: 'Matching Game', icon: GripVertical, color: 'text-indigo-500' },
    { type: 'drag_drop', label: 'Drag & Drop', icon: GripVertical, color: 'text-pink-500' },
    { type: 'conversation', label: 'Conversation', icon: MessageCircle, color: 'text-teal-500' },
    { type: 'text', label: 'Descriptive Text', icon: Type, color: 'text-gray-500' },
];

export function TaskSelector() {
    const { addTask } = useStudio();

    return (
        <div className="grid gap-3">
            {TOOLS.map((tool) => (
                <button
                    key={tool.type}
                    onClick={() => addTask(tool.type)}
                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-white hover:border-indigo-300 hover:shadow-sm transition-all text-left group"
                >
                    <div className={`w-8 h-8 rounded-md bg-gray-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors ${tool.color}`}>
                        <tool.icon className="w-5 h-5" />
                    </div>
                    <div>
                        <span className="block text-sm font-medium text-gray-700 group-hover:text-indigo-700">{tool.label}</span>
                        <span className="block text-xs text-gray-400">Add to lesson</span>
                    </div>
                </button>
            ))}
        </div>
    )
}
