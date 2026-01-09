"use client";

import { ConversationPayload } from "@/types/content";
import { useState, useEffect } from "react";
// We'll use simple CSS animations instead of framer-motion to avoid dependencies unless needed
import { MessageCircle, User } from "lucide-react";

interface Props {
    payload: ConversationPayload;
    onComplete?: (score: number) => void;
}

export function ConversationTaskPlayer({ payload, onComplete }: Props) {
    const [visibleLines, setVisibleLines] = useState<number>(0);

    // Auto-advance lines? Or click to advance?
    // Let's implement "Click to Next" for better engagement, or auto with delay.
    // User requested "interaction" might imply click to reveal.
    // Let's go with "Click buffer" style.

    useEffect(() => {
        // Reset valid lines count when payload changes
        setVisibleLines(1);
    }, [payload]);

    const advanceDialogue = () => {
        if (visibleLines < payload.lines.length) {
            setVisibleLines(prev => prev + 1);
        } else {
            if (onComplete) onComplete(100);
        }
    };

    const progress = Math.round((visibleLines / payload.lines.length) * 100);

    return (
        <div className="max-w-2xl mx-auto p-4 space-y-6">
            <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-gray-800 flex items-center justify-center gap-2">
                    <MessageCircle className="w-5 h-5 text-teal-500" />
                    Conversation Practice
                </h3>
                <div className="w-full bg-gray-200 rounded-full h-1 mt-2 max-w-xs mx-auto">
                    <div
                        className="bg-teal-500 h-1 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <div className="space-y-4 min-h-[400px]">
                {payload.lines.slice(0, visibleLines).map((line, index) => {
                    const isRight = line.messageDirection === 'right';
                    return (
                        <div
                            key={line.id}
                            className={`flex gap-3 items-end animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both ${isRight ? 'flex-row-reverse' : 'flex-row'}`}
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isRight ? 'bg-indigo-100 text-indigo-600' : 'bg-teal-100 text-teal-600'}`}>
                                <span className="text-xs font-bold">{line.speaker.charAt(0)}</span>
                            </div>

                            <div className={`max-w-[80%] p-3 rounded-2xl shadow-sm text-sm ${isRight
                                    ? 'bg-indigo-50 border border-indigo-100 rounded-br-none text-indigo-900'
                                    : 'bg-white border border-gray-200 rounded-bl-none text-gray-800'
                                }`}>
                                <p className="font-bold text-xs mb-1 opacity-50">{line.speaker}</p>
                                <p>{line.text}</p>
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="sticky bottom-4 flex justify-center pt-4">
                <button
                    onClick={advanceDialogue}
                    disabled={visibleLines === payload.lines.length}
                    className="bg-black text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-gray-800 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {visibleLines < payload.lines.length ? "Next Message" : "Conversation Complete"}
                </button>
            </div>
        </div>
    )
}
