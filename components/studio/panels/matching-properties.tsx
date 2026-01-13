"use client";

import { MatchingTask, MatchingPair } from "@/types/content";
import { Plus, Trash, ArrowRightLeft } from "lucide-react";

export function MatchingProperties({ task, updateTask }: { task: MatchingTask, updateTask: any }) {

    const addPair = () => {
        const newPair: MatchingPair = {
            id: Math.random().toString(36).substr(2, 9),
            left: "",
            right: ""
        };
        updateTask(task.id, {
            payload: { ...task.payload, pairs: [...(task.payload.pairs || []), newPair] }
        });
    };

    const updatePair = (pairId: string, field: 'left' | 'right', value: string) => {
        const newPairs = task.payload.pairs.map(p =>
            p.id === pairId ? { ...p, [field]: value } : p
        );
        updateTask(task.id, {
            payload: { ...task.payload, pairs: newPairs }
        });
    };

    const deletePair = (pairId: string) => {
        const newPairs = task.payload.pairs.filter(p => p.id !== pairId);
        updateTask(task.id, {
            payload: { ...task.payload, pairs: newPairs }
        });
    };

    return (
        <div className="space-y-6">
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 flex items-start gap-3">
                <ArrowRightLeft className="w-5 h-5 text-indigo-600 mt-0.5" />
                <div className="text-xs text-indigo-800">
                    <p className="font-bold mb-1">How it works</p>
                    <p>Add pairs of words associated with each other (e.g., English vs Spanish). The game will shuffle them, and students must match the correct pairs.</p>
                </div>
            </div>

            <div className="space-y-3">
                {task.payload.pairs?.map((pair, index) => (
                    <div key={pair.id} className="flex gap-2 items-start group">
                        <div className="flex-1 grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                                    {index === 0 ? "Term / Word" : ""}
                                </label>
                                <input
                                    type="text"
                                    value={pair.left}
                                    onChange={(e) => updatePair(pair.id, 'left', e.target.value)}
                                    placeholder="e.g. Hello"
                                    className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-indigo-500 bg-white text-gray-900 placeholder:text-gray-400"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                                    {index === 0 ? "Match / Translation" : ""}
                                </label>
                                <input
                                    type="text"
                                    value={pair.right}
                                    onChange={(e) => updatePair(pair.id, 'right', e.target.value)}
                                    placeholder="e.g. Hola"
                                    className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-indigo-500 bg-white text-gray-900 placeholder:text-gray-400"
                                />
                            </div>
                        </div>
                        <div className={index === 0 ? "mt-6" : ""}>
                            <button
                                onClick={() => deletePair(pair.id)}
                                className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                            >
                                <Trash className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={addPair}
                className="w-full py-3 border-2 border-dashed border-gray-200 rounded-lg text-gray-500 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all font-bold text-sm flex items-center justify-center gap-2"
            >
                <Plus className="w-4 h-4" />
                Add Matching Pair
            </button>
        </div>
    )
}
