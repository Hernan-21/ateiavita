"use client";

import { useState, useEffect } from "react";
import { X, Check, Users } from "lucide-react";
import { useRouter } from "next/navigation";

interface ClassOption {
    id: string;
    name: string;
}

interface AddToClassModalProps {
    courseId: string;
    courseTitle: string;
    isOpen: boolean;
    onClose: () => void;
}

export function AddToClassModal({ courseId, courseTitle, isOpen, onClose }: AddToClassModalProps) {
    const router = useRouter();
    const [classes, setClasses] = useState<ClassOption[]>([]);
    const [selectedClassId, setSelectedClassId] = useState<string>("");
    const [status, setStatus] = useState<string>("prepping");
    const [loading, setLoading] = useState(false);
    const [fetchingClasses, setFetchingClasses] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setFetchingClasses(true);
            fetch("/api/classes")
                .then(res => res.json())
                .then(data => {
                    setClasses(data);
                    setFetchingClasses(false);
                })
                .catch(() => setFetchingClasses(false));

            // Reset state
            setSelectedClassId("");
            setStatus("prepping");
        }
    }, [isOpen]);

    const handleSave = async () => {
        if (!selectedClassId) return;

        setLoading(true);
        try {
            const res = await fetch("/api/classes/assign", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    classId: selectedClassId,
                    courseId: courseId,
                    status: status
                })
            });

            if (res.ok) {
                router.refresh();
                onClose();
            } else {
                alert("Failed to assign course");
            }
        } catch (error) {
            console.error(error);
            alert("Error assigning course");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900">Add to...</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    <p className="text-gray-600">
                        Please select which class you would like to add <span className="font-bold text-gray-900">{courseTitle}</span> to.
                    </p>

                    <div className="space-y-4">
                        {/* Class Selector */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Select a class</label>
                            <div className="relative">
                                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <select
                                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none appearance-none font-medium text-gray-700"
                                    value={selectedClassId}
                                    onChange={(e) => setSelectedClassId(e.target.value)}
                                    disabled={fetchingClasses}
                                >
                                    <option value="" disabled>Please select...</option>
                                    {classes.map(cls => (
                                        <option key={cls.id} value={cls.id}>{cls.name}</option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Status Options */}
                        <div className="space-y-1">
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Status</label>

                            <button
                                onClick={() => setStatus('saved')}
                                className={`w-full text-left px-4 py-3 rounded-lg border transition-all flex items-center justify-between ${status === 'saved' ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-medium shadow-sm' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                            >
                                <div>
                                    <span className="block">Saved</span>
                                    <span className="text-xs opacity-70 block font-normal">(stored in your class Content Drawer)</span>
                                </div>
                                {status === 'saved' && <Check className="w-4 h-4 text-indigo-600" />}
                            </button>

                            <button
                                onClick={() => setStatus('prepping')}
                                className={`w-full text-left px-4 py-3 rounded-lg border transition-all flex items-center justify-between ${status === 'prepping' ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-medium shadow-sm' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                            >
                                <div>
                                    <span className="block">Prepping</span>
                                    <span className="text-xs opacity-70 block font-normal">(upcoming content you'll be teaching)</span>
                                </div>
                                {status === 'prepping' && <Check className="w-4 h-4 text-indigo-600" />}
                            </button>

                            <button
                                onClick={() => setStatus('teaching')}
                                className={`w-full text-left px-4 py-3 rounded-lg border transition-all flex items-center justify-between ${status === 'teaching' ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-medium shadow-sm' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                            >
                                <div>
                                    <span className="block">Teaching</span>
                                    <span className="text-xs opacity-70 block font-normal">(available to your students immediately)</span>
                                </div>
                                {status === 'teaching' && <Check className="w-4 h-4 text-indigo-600" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-100">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!selectedClassId || loading}
                        className={`px-6 py-2 text-sm font-medium text-white rounded-lg transition-colors shadow-sm flex items-center gap-2 ${!selectedClassId || loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                    >
                        {loading ? 'Saving...' : 'Save'}
                        {!loading && <Check className="w-4 h-4" />}
                    </button>
                </div>
            </div>
        </div>
    );
}
