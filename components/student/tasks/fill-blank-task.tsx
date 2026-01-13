"use client";

import { FillBlankPayload } from "@/types/content";
import { useState } from "react";
import { Check, X } from "lucide-react";

interface Props {
    payload: FillBlankPayload;
    onComplete?: (score: number) => void;
}

export function FillBlankTaskPlayer({ payload, onComplete }: Props) {
    const [answer, setAnswer] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Split sentence by "_____"
    const parts = (payload.sentence || "").split("_____");

    const checkAnswer = () => {
        setIsSubmitted(true);
        const correct = answer.trim().toLowerCase() === (payload.correctAnswer || "").trim().toLowerCase();

        if (onComplete) {
            onComplete(correct ? 100 : 0);
        }
    };

    const reset = () => {
        setIsSubmitted(false);
        setAnswer("");
    };

    const isCorrect = isSubmitted && answer.trim().toLowerCase() === (payload.correctAnswer || "").trim().toLowerCase();
    const isWrong = isSubmitted && !isCorrect;

    return (
        <div className="max-w-2xl mx-auto p-8 space-y-8 select-none">
            <div className="text-center">
                <h3 className="text-xl font-bold text-gray-800">Complete the Sentence</h3>
                <p className="text-gray-500 text-sm">Type the missing word to complete the phrase.</p>
            </div>

            <div className={`
                bg-white p-8 rounded-2xl shadow-sm border-2 flex items-center justify-center text-xl md:text-2xl font-medium leading-relaxed flex-wrap gap-2 text-center
                ${isCorrect ? 'border-green-200 bg-green-50' : ''}
                ${isWrong ? 'border-red-200 bg-red-50' : 'border-gray-100'}
            `}>
                {parts.map((part, index) => (
                    <span key={index} className="flex items-center">
                        <span className="text-gray-800">{part}</span>
                        {index < parts.length - 1 && (
                            <span className="relative mx-2 inline-flex items-center">
                                <input
                                    type="text"
                                    value={answer}
                                    onChange={(e) => !isSubmitted && setAnswer(e.target.value)}
                                    disabled={isSubmitted}
                                    className={`
                                        w-32 border-b-2 border-gray-300 bg-transparent text-center focus:outline-none focus:border-indigo-500 text-indigo-600 font-bold px-2 py-1
                                        ${isSubmitted ? 'cursor-default' : ''}
                                        ${isCorrect ? 'border-green-500 text-green-700' : ''}
                                        ${isWrong ? 'border-red-500 text-red-700' : ''}
                                    `}
                                    placeholder="?"
                                    autoFocus
                                />
                                {isCorrect && <Check className="absolute -right-6 w-5 h-5 text-green-600" />}
                                {isWrong && <X className="absolute -right-6 w-5 h-5 text-red-600" />}
                            </span>
                        )}
                    </span>
                ))}
            </div>

            <div className="flex justify-center pt-4">
                {!isSubmitted ? (
                    <button
                        onClick={checkAnswer}
                        disabled={!answer.trim()}
                        className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Check Answer
                    </button>
                ) : (
                    <div className="flex flex-col items-center gap-4">
                        {isCorrect ? (
                            <div className="text-green-600 font-bold animate-bounce">
                                ✨ Excellent!
                            </div>
                        ) : (
                            <div className="text-red-500 font-bold">
                                Correct answer: {payload.correctAnswer}
                            </div>
                        )}
                        <button
                            onClick={reset}
                            className="bg-white border-2 border-gray-200 text-gray-700 px-8 py-3 rounded-full font-bold hover:bg-gray-50 transition-all"
                        >
                            Try Again
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
