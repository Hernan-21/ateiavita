"use client";

import { DragDropPayload } from "@/types/content";
import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Shuffle } from "lucide-react";

interface Props {
    payload: DragDropPayload;
    onComplete?: (score: number) => void;
}

export function DragDropTaskPlayer({ payload, onComplete }: Props) {
    const targetWord = payload.word.toUpperCase();
    const [letters, setLetters] = useState<{ id: string, char: string, status?: 'correct' | 'wrong' }[]>([]);
    const [isChecking, setIsChecking] = useState(false);
    const [score, setScore] = useState<number | null>(null);

    // Initialize: Split word and shuffle
    useEffect(() => {
        const chars = targetWord.split('').map((char, index) => ({
            id: `${char}-${index}-${Math.random().toString(36).substr(2, 5)}`,
            char
        }));

        // Shuffle
        for (let i = chars.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [chars[i], chars[j]] = [chars[j], chars[i]];
        }

        setLetters(chars);
    }, [targetWord]);

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const items = Array.from(letters);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        // Reset status when moving
        const resetItems = items.map(item => ({ ...item, status: undefined }));
        setLetters(resetItems);
        setScore(null);
    };

    const checkAnswer = () => {
        setIsChecking(true);
        let correctCount = 0;
        const newLetters = letters.map((item, index) => {
            const isCorrect = item.char === targetWord[index];
            if (isCorrect) correctCount++;
            return {
                ...item,
                status: isCorrect ? 'correct' as const : 'wrong' as const
            };
        });

        const percentage = Math.round((correctCount / targetWord.length) * 100);
        setLetters(newLetters);
        setScore(percentage);

        if (onComplete) onComplete(percentage);

        setTimeout(() => setIsChecking(false), 2000);
    };

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-8">
            <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-gray-800">Arrange the letters</h3>
                {payload.hint && (
                    <p className="text-indigo-600 font-medium bg-indigo-50 inline-block px-3 py-1 rounded-full text-sm">
                        Hint: {payload.hint}
                    </p>
                )}
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="letters" direction="horizontal">
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="flex flex-wrap justify-center gap-2 min-h-[80px] p-4 bg-gray-50 rounded-xl border border-gray-200"
                        >
                            {letters.map((item, index) => (
                                <Draggable key={item.id} draggableId={item.id} index={index}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className={`
                                                w-12 h-16 md:w-16 md:h-20 flex items-center justify-center 
                                                text-2xl md:text-3xl font-bold rounded-xl shadow-sm border-b-4 transition-all
                                                ${item.status === 'correct'
                                                    ? 'bg-green-500 border-green-700 text-white'
                                                    : item.status === 'wrong'
                                                        ? 'bg-red-500 border-red-700 text-white'
                                                        : snapshot.isDragging
                                                            ? 'bg-indigo-500 border-indigo-700 text-white scale-110 z-10'
                                                            : 'bg-white border-gray-300 text-gray-800 hover:border-indigo-300'
                                                }
                                            `}
                                        >
                                            {item.char}
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            <div className="flex justify-center flex-col items-center gap-4">
                <button
                    onClick={checkAnswer}
                    disabled={isChecking}
                    className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-transform active:scale-95 disabled:opacity-50"
                >
                    Check Answer
                </button>

                {score !== null && (
                    <div className={`text-xl font-bold animate-in fade-in slide-in-from-bottom-2 ${score === 100 ? 'text-green-600' : 'text-orange-500'}`}>
                        {score}% Correct
                    </div>
                )}
            </div>
        </div>
    )
}
