"use client";

import { QuizTask } from "@/types/content";
import { Plus, Trash } from "lucide-react";

export function QuizProperties({ task, updateTask }: { task: QuizTask, updateTask: any }) {

    const addQuestion = () => {
        const newQ = {
            id: Math.random().toString(36).substr(2, 5),
            text: "New Question",
            type: "single_choice" as const,
            options: ["True", "False"],
            correctAnswer: 0
        };
        updateTask(task.id, {
            payload: { ...task.payload, questions: [...task.payload.questions, newQ] }
        });
    }

    const updateQuestion = (qId: string, field: string, value: any) => {
        const newQuestions = task.payload.questions.map(q =>
            q.id === qId ? { ...q, [field]: value } : q
        );
        updateTask(task.id, { payload: { ...task.payload, questions: newQuestions } });
    }

    const deleteQuestion = (qId: string) => {
        const newQuestions = task.payload.questions.filter(q => q.id !== qId);
        updateTask(task.id, { payload: { ...task.payload, questions: newQuestions } });
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-500 uppercase">Questions ({task.payload.questions.length})</span>
                <button onClick={addQuestion} className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded hover:bg-indigo-100 font-bold">
                    + Add Question
                </button>
            </div>

            <div className="space-y-3">
                {task.payload.questions.map((q, index) => (
                    <div key={q.id} className="bg-gray-50 p-3 rounded border border-gray-200 text-sm">
                        <div className="flex justify-between mb-2">
                            <span className="font-bold text-gray-600">Q{index + 1}</span>
                            <button onClick={() => deleteQuestion(q.id)} className="text-gray-400 hover:text-red-500">
                                <Trash className="w-3 h-3" />
                            </button>
                        </div>
                        <input
                            type="text"
                            value={q.text}
                            onChange={(e) => updateQuestion(q.id, 'text', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded mb-2"
                        />

                        <div className="space-y-1 ml-2">
                            {q.options.map((opt, optIndex) => (
                                <div key={optIndex} className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        checked={q.correctAnswer === optIndex}
                                        onChange={() => updateQuestion(q.id, 'correctAnswer', optIndex)}
                                        name={`correct-${q.id}`}
                                    />
                                    <input
                                        type="text"
                                        value={opt}
                                        onChange={(e) => {
                                            const newOps = [...q.options];
                                            newOps[optIndex] = e.target.value;
                                            updateQuestion(q.id, 'options', newOps);
                                        }}
                                        className="w-full px-2 py-1 border border-gray-200 rounded text-xs bg-white"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
