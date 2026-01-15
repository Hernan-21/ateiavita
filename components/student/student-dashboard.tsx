"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, BookOpen, Clock, ArrowRight, Plus, MessageSquare } from "lucide-react";

interface Course {
    id: string;
    title: string;
    description: string | null;
    iconChar: string;
    color: string;
}

interface SchoolClass {
    id: string;
    name: string;
    description?: string | null;
    courses: {
        course: Course;
        status: string;
    }[];
    feedback?: {
        id: string;
        content: string;
        createdAt: Date;
        authorName: string | null;
        courseTitle: string;
    }[];
}

interface StudentDashboardProps {
    initialClasses: SchoolClass[];
}

export function StudentDashboard({ initialClasses }: StudentDashboardProps) {
    const router = useRouter();
    const [joinCode, setJoinCode] = useState("");
    const [joining, setJoining] = useState(false);
    const [error, setError] = useState("");
    const [showJoinForm, setShowJoinForm] = useState(false);

    // Helper to get consistent visual style (color + animal icon) based on class string
    const getClassStyle = (str: string) => {
        const styles = [
            { border: 'bg-green-500', bg: 'bg-green-100', text: 'text-green-700', icon: '🐟' },   // Fish
            { border: 'bg-yellow-400', bg: 'bg-yellow-100', text: 'text-yellow-700', icon: '🐥' }, // Duck
            { border: 'bg-red-500', bg: 'bg-red-100', text: 'text-red-700', icon: '🐼' },       // Panda
            { border: 'bg-blue-500', bg: 'bg-blue-100', text: 'text-blue-700', icon: '🐳' },      // Whale
            { border: 'bg-indigo-500', bg: 'bg-indigo-100', text: 'text-indigo-700', icon: '🐙' }, // Octopus
            { border: 'bg-purple-500', bg: 'bg-purple-100', text: 'text-purple-700', icon: '🦄' }  // Unicorn
        ];
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return styles[Math.abs(hash) % styles.length];
    };

    const handleJoin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!joinCode.trim()) return;

        setJoining(true);
        try {
            const res = await fetch("/api/student/join", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: joinCode.trim() })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Error al unirse");
            }

            if (data.message === "Already enrolled") {
                setError("Ya estás inscrito en esta clase.");
            } else {
                setJoinCode("");
                setShowJoinForm(false);
                router.refresh();
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setJoining(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">Mis Clases</h2>
                    <p className="text-gray-500">Aquí encontrarás los materiales asignados por tu profesor.</p>
                </div>
                <button
                    onClick={() => setShowJoinForm(!showJoinForm)}
                    className="px-4 py-2 bg-[#5865F2] text-white rounded-lg font-medium hover:bg-indigo-600 transition-colors flex items-center gap-2 shadow-sm whitespace-nowrap"
                >
                    <Plus className="w-4 h-4" />
                    Unirse a una Clase
                </button>
            </div>

            {/* Collapsible Join Form */}
            {showJoinForm && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-in slide-in-from-top-2 fade-in duration-200">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">Código de Clase</h3>
                    <form onSubmit={handleJoin} className="flex gap-3 items-start">
                        <div className="flex-1 max-w-sm">
                            <input
                                type="text"
                                placeholder="Ej: ABC123"
                                value={joinCode}
                                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-50 outline-none text-gray-900 font-mono uppercase"
                                maxLength={30}
                                autoFocus
                            />
                            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
                        </div>
                        <button
                            type="submit"
                            disabled={joining || !joinCode}
                            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-black disabled:opacity-50 transition-colors"
                        >
                            {joining ? "Uniendo..." : "Unirse"}
                        </button>
                    </form>
                </div>
            )}

            {/* Classes Grid */}
            {initialClasses.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                        <BookOpen className="w-8 h-8" />
                    </div>
                    <h3 className="text-gray-900 font-medium mb-1">No tienes clases activas</h3>
                    <p className="text-gray-500 text-sm">Usa el botón "Unirse a una Clase" para comenzar.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {initialClasses.map(schoolClass => {
                        const style = getClassStyle(schoolClass.id + schoolClass.name);

                        return (
                            <div
                                key={schoolClass.id}
                                onClick={() => router.push(`/student/class/${schoolClass.id}`)}
                                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer group border border-gray-100 flex flex-col overflow-hidden min-h-[120px]"
                            >
                                {/* Left Color Strip & Content Wrapper */}
                                <div className="flex flex-1">
                                    <div className={`w-3 ${style.border}`} />

                                    <div className="p-6 flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
                                                {schoolClass.name}
                                            </h3>
                                            <div className="flex items-center gap-3 text-gray-600">
                                                <div className={`w-12 h-12 rounded-full ${style.bg} flex items-center justify-center text-xl shrink-0 ${style.text}`}>
                                                    {style.icon}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-gray-900 text-lg leading-tight">
                                                        {schoolClass.description || "Nivel General"}
                                                    </span>
                                                    <span className="text-sm text-gray-500">
                                                        {schoolClass.courses.length} Materias
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Feedback Section */}
                                {schoolClass.feedback && schoolClass.feedback.length > 0 && (
                                    <Link
                                        href="/student/feedback"
                                        onClick={(e) => e.stopPropagation()}
                                        className="block bg-indigo-50 px-6 py-4 border-t border-indigo-100 hover:bg-indigo-100 transition-colors"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="bg-indigo-200 p-1.5 rounded-full mt-0.5">
                                                <MessageSquare className="w-3 h-3 text-indigo-700" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-xs font-bold text-indigo-800 uppercase tracking-wide">
                                                        Feedback · {schoolClass.feedback[0].courseTitle}
                                                    </span>
                                                    <span className="text-xs text-indigo-400">
                                                        {new Date(schoolClass.feedback[0].createdAt).toLocaleDateString('es-AR')}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-indigo-900 line-clamp-2 italic">
                                                    "{schoolClass.feedback[0].content}"
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
