"use client";

import { Task } from "@/types/content";
import { VideoEngine } from "./video-engine";
import { QuizEngine } from "./quiz-engine";
import { PDFEngine } from "./pdf-engine";

export function TaskRenderer({ task }: { task: Task }) {
    console.log("Rendering Task:", task.type);

    switch (task.type) {
        case 'video':
            return <VideoEngine data={task.payload} />;
        case 'quiz':
            return <QuizEngine data={task.payload} />;
        case 'pdf':
            return <PDFEngine data={task.payload} />;
        default:
            return (
                <div className="p-8 text-center bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Engine for <strong>{task.type}</strong> is under construction.</p>
                </div>
            );
    }
}
