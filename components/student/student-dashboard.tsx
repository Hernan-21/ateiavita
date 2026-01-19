"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, BookOpen, Clock, ArrowRight, Plus, MessageSquare } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";

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

    // Helper to get consistent visual style. 
    // Matching style_f reference: Defaulting to Amber (Duck) and Indigo (Octopus).
    const getClassStyle = (str: string) => {
        const styles = [
            { border: 'bg-amber-400', bg: 'bg-amber-100', text: 'text-amber-700', icon: '🐥' }, // Amber/Duck (Primary Ref)
            { border: 'bg-indigo-500', bg: 'bg-indigo-100', text: 'text-indigo-700', icon: '🐙' }, // Indigo/Octopus
            { border: 'bg-fuchsia-500', bg: 'bg-fuchsia-100', text: 'text-fuchsia-700', icon: '🦄' } // Fuchsia/Unicorn
        ];
        // Use Amber (index 0) for most, or rotate. 
        // To match reference exactly, let's just cycle these 3 premium colors.
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
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Notification Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 p-8 shadow-2xl shadow-indigo-200">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-64 w-64 rounded-full bg-indigo-900/20 blur-3xl"></div>

                <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-white font-serif">
                            ¡Nueva retroalimentación disponible!
                        </h2>
                        <p className="text-indigo-100 max-w-xl">
                            Tu profesor ha revisado tu última entrega. Revisa sus comentarios para mejorar tus habilidades.
                        </p>
                    </div>
                    <Link href="/student/feedback">
                        <div className="bg-white text-indigo-600 hover:bg-indigo-50 shadow-none border-0 whitespace-nowrap px-4 py-2 rounded-lg font-medium flex items-center transition-colors cursor-pointer">
                            Ver Retroalimentación <ArrowRight className="ml-2 h-4 w-4" />
                        </div>
                    </Link>
                </div>
            </div>

            {/* Classes Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 font-serif">
                            Mis Clases
                        </h2>
                        <p className="text-slate-500 mt-1">Continúa donde lo dejaste</p>
                    </div>
                    <button
                        onClick={() => setShowJoinForm(!showJoinForm)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm"
                    >
                        <Plus className="h-4 w-4" />
                        Unirse a Clase
                    </button>
                </div>

                {/* Collapsible Join Form */}
                {showJoinForm && (
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-in slide-in-from-top-2 fade-in duration-200 mb-6">
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {initialClasses.map(schoolClass => {
                        const style = getClassStyle(schoolClass.id + schoolClass.name);

                        return (
                            <GlassCard
                                key={schoolClass.id}
                                hoverEffect={true}
                                onClick={() => router.push(`/student/class/${schoolClass.id}`)}
                                className={`group relative overflow-hidden border-l-4 ${style.border.replace('bg-', 'border-')}`}
                            >
                                <div className="flex items-start justify-between mb-6">
                                    <div className={`h-14 w-14 rounded-2xl ${style.bg} flex items-center justify-center text-2xl shadow-inner`}>
                                        {style.icon}
                                    </div>
                                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                                        Activo
                                    </span>
                                </div>

                                <div className="space-y-1 mb-6">
                                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                        {schoolClass.name}
                                    </h3>
                                    <p className="text-slate-500">{schoolClass.description || "Nivel General"}</p>
                                </div>

                                <div className="flex items-center gap-4 text-sm text-slate-400 pt-6 border-t border-slate-100">
                                    <div className="flex items-center gap-1.5">
                                        <BookOpen className="h-4 w-4" />
                                        <span>{schoolClass.courses.length} Materias</span>
                                    </div>
                                    {/* Placeholder duration if needed, or remove */}
                                    {/* <div className="flex items-center gap-1.5">
                                        <Clock className="h-4 w-4" />
                                        <span>4h 30m</span>
                                    </div> */}
                                </div>
                            </GlassCard>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
