"use client";

import { useStudio } from "./studio-context";

export function JsonPreview() {
    const { state } = useStudio();

    return (
        <div className="w-full max-w-4xl font-mono text-xs">
            <div className="bg-gray-900 text-gray-100 rounded-xl overflow-hidden shadow-lg border border-gray-800">
                <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex justify-between items-center">
                    <span>lesson-output.json</span>
                    <button
                        onClick={() => navigator.clipboard.writeText(JSON.stringify(state.currentUnit, null, 2))}
                        className="text-indigo-400 hover:text-indigo-300"
                    >
                        Copy
                    </button>
                </div>
                <pre className="p-4 overflow-x-auto">
                    {JSON.stringify(state.currentUnit, null, 2)}
                </pre>
            </div>
        </div>
    )
}
