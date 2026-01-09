"use client";

import { ConversationTask, DialogueLine } from "@/types/content";
import { useState } from "react";
import { MessageCircle, ArrowRight, Trash } from "lucide-react";

export function ConversationProperties({ task, updateTask }: { task: ConversationTask, updateTask: any }) {
    const [script, setScript] = useState("");

    const updatePayload = (lines: DialogueLine[]) => {
        updateTask(task.id, {
            payload: { ...task.payload, lines }
        });
    }

    const parseScript = () => {
        if (!script.trim()) return;

        const rawLines = script.split('\n').filter(line => line.trim() !== "");
        const parsedLines: DialogueLine[] = rawLines.map(line => {
            const separatorIndex = line.indexOf(':');
            let speaker = "Unknown";
            let text = line;

            if (separatorIndex > -1) {
                speaker = line.substring(0, separatorIndex).trim();
                text = line.substring(separatorIndex + 1).trim();
            }

            return {
                id: Math.random().toString(36).substr(2, 9),
                speaker,
                text,
                // Simple heuristic: First speaker matches first line's speaker ? 'left' : 'right'
                // We'll leave direction undefined for now and let the player handle it or add a toggle
            };
        });

        // Heuristic for direction: Alternate based on speaker changes or just unique speakers
        // Let's identify unique speakers
        const speakers = Array.from(new Set(parsedLines.map(l => l.speaker)));
        const formattedLines = parsedLines.map(line => ({
            ...line,
            messageDirection: (speakers.indexOf(line.speaker) % 2 === 0 ? 'left' : 'right') as 'left' | 'right'
        }));

        updatePayload(formattedLines);
        setScript(""); // Clear script after parsing
    };

    const deleteLine = (lineId: string) => {
        const newLines = task.payload.lines.filter(l => l.id !== lineId);
        updatePayload(newLines);
    }

    const updateLine = (lineId: string, field: keyof DialogueLine, value: any) => {
        const newLines = task.payload.lines.map(l =>
            l.id === lineId ? { ...l, [field]: value } : l
        );
        updatePayload(newLines);
    }

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-700 uppercase flex items-center gap-2">
                        <MessageCircle className="w-4 h-4 text-teal-500" />
                        Script Importer
                    </h3>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-500 mb-2">
                        Paste your dialogue below. format: <strong>Name: Message</strong>
                    </p>
                    <textarea
                        value={script}
                        onChange={(e) => setScript(e.target.value)}
                        className="w-full h-32 text-xs p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 font-mono"
                        placeholder={`Maria: Hola, ¿cómo estás?\nJuan: Muy bien, gracias. ¿Y tú?`}
                    />
                    <button
                        onClick={parseScript}
                        className="mt-2 w-full bg-teal-600 text-white text-xs font-bold py-2 rounded hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
                    >
                        Parse & Generate Dialogue <ArrowRight className="w-3 h-3" />
                    </button>
                </div>
            </div>

            <hr className="border-gray-100" />

            <div className="space-y-3">
                <h3 className="text-sm font-bold text-gray-700 uppercase">Dialogue Lines</h3>

                <div className="space-y-2">
                    {task.payload.lines?.map((line, index) => (
                        <div key={line.id} className={`flex gap-3 p-3 rounded-lg border ${line.messageDirection === 'right' ? 'bg-indigo-50 border-indigo-100 ml-4' : 'bg-white border-gray-200 mr-4'}`}>
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-2">
                                    <input
                                        value={line.speaker}
                                        onChange={(e) => updateLine(line.id, 'speaker', e.target.value)}
                                        className="text-xs font-bold text-gray-700 bg-transparent border-none p-0 focus:ring-0 w-full"
                                    />
                                </div>
                                <textarea
                                    value={line.text}
                                    onChange={(e) => updateLine(line.id, 'text', e.target.value)}
                                    className="w-full text-sm bg-transparent border-none p-0 focus:ring-0 resize-none text-gray-600"
                                    rows={2}
                                />
                            </div>
                            <div className="flex flex-col gap-2 justify-start">
                                <button onClick={() => deleteLine(line.id)} className="text-gray-400 hover:text-red-500">
                                    <Trash className="w-3 h-3" />
                                </button>
                                <button
                                    onClick={() => updateLine(line.id, 'messageDirection', line.messageDirection === 'left' ? 'right' : 'left')}
                                    className="text-gray-400 hover:text-teal-500 text-xs font-bold uppercase"
                                    title="Switch Side"
                                >
                                    {line.messageDirection === 'left' ? 'L' : 'R'}
                                </button>
                            </div>
                        </div>
                    ))}
                    {(!task.payload.lines || task.payload.lines.length === 0) && (
                        <div className="text-center py-8 text-gray-400 text-sm italic">
                            No dialogue yet. Use the importer above.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
