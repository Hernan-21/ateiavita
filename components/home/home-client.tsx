"use client";

import { Button } from "@/components/ui/Button"
import { ChevronRight, Lock, Unlock, Plus, X } from "lucide-react"
import Link from "next/link"
import { useUser } from "@/lib/context"
import { LEVELS } from "@/lib/data"
import { useState } from "react"

export function HomeClient() {
    const { state, unlockLevel } = useUser();
    const [accessCode, setAccessCode] = useState("");
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
    const [isJoining, setIsJoining] = useState(false);

    const handleUnlock = () => {
        if (!accessCode) return;
        const result = unlockLevel(accessCode);
        setMessage({ text: result.message, type: result.success ? 'success' : 'error' });
        if (result.success) {
            setAccessCode("");
            setIsJoining(false);
        }

        // Clear message after 3 seconds
        setTimeout(() => setMessage(null), 3000);
    };

    const visibleLevels = LEVELS.filter(level => state.unlockedLevels.includes(level.id));

    return (
        <main className="flex-1 pb-20">

            <div className="container mx-auto px-4 md:px-8 py-8">

                {/* Feedback Banner */}
                <div className="bg-[#5865F2] rounded-xl p-4 md:p-6 mb-10 flex flex-col md:flex-row items-center justify-between text-white shadow-sm">
                    <p className="font-medium text-lg mb-4 md:mb-0">Check out the latest feedback from your teacher!</p>
                    <Link href="/student/feedback">
                        <Button variant="secondary" className="bg-white text-[#5865F2] hover:bg-gray-100 font-semibold border-none">
                            Check feedback <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                    </Link>
                </div>

                {/* Classes Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Classes</h1>
                        <p className="text-gray-500">Here you'll find materials assigned by your teacher.</p>
                    </div>

                    {!isJoining ? (
                        <Button onClick={() => setIsJoining(true)} className="bg-[#5865F2] hover:bg-[#4752c4] text-white font-semibold">
                            <Plus className="mr-2 h-4 w-4" /> Join a Class
                        </Button>
                    ) : (
                        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-200">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Enter Code"
                                    className="px-4 py-2 rounded-md border border-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#5865F2] uppercase w-48"
                                    value={accessCode}
                                    onChange={(e) => setAccessCode(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <Button onClick={handleUnlock} className="bg-[#5865F2] hover:bg-[#4752c4] text-white">Join</Button>
                            <Button variant="ghost" size="icon" onClick={() => setIsJoining(false)}><X className="h-4 w-4" /></Button>
                        </div>
                    )}
                </div>

                {/* Message Area */}
                {message && (
                    <div className={`mb-6 p-3 rounded-lg text-sm font-bold ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message.text}
                    </div>
                )}

                {/* Grid */}
                {visibleLevels.length > 0 ? (
                    <div className="grid md:grid-cols-3 gap-6">
                        {visibleLevels.map((level) => (
                            <div key={level.id} className="h-full">
                                <Link href={`/classes/${level.id}`} className="block h-full">
                                    <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 relative overflow-hidden group transition-all h-full hover:shadow-md hover:border-primary/20">
                                        {/* Color Strip */}
                                        <div className={`absolute left-0 top-0 bottom-0 w-2 rounded-l-xl bg-${level.color}-500`}></div>

                                        {/* Status Icon */}
                                        <div className="absolute right-4 top-4">
                                            <Unlock className="h-5 w-5 text-green-500" />
                                        </div>

                                        <h3 className="font-bold text-lg mb-2">{level.title}</h3>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <span className="text-xl">{level.iconChar}</span>
                                            <span className="text-sm font-medium">{level.description}</span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-xl border-dashed border-2 border-gray-200">
                        <p className="text-gray-400">You haven't joined any classes yet.</p>
                        <p className="text-sm text-gray-400 mt-1">Click "Join a Class" and enter a code (e.g. NIVEL1)</p>
                    </div>
                )}
            </div>

        </main>
    )
}
