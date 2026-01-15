"use client";

import { useState } from "react";
import { markFeedbackAsRead } from "@/app/actions/student";
import { MessageSquare, Calendar, User, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";

interface FeedbackItem {
    id: string;
    content: string;
    createdAt: string | Date;
    isRead: boolean;
    author: { name: string | null; image: string | null; };
    course: { title: string; color: string | null; iconChar: string | null; };
}

export function FeedbackList({ feedback }: { feedback: FeedbackItem[] }) {
    const router = useRouter();
    const [items, setItems] = useState(feedback);

    const handleRead = async (id: string, currentReadStatus: boolean) => {
        if (currentReadStatus) return;

        // Optimistic update
        setItems(prev => prev.map(f => f.id === id ? { ...f, isRead: true } : f));

        try {
            await markFeedbackAsRead(id);
            router.refresh(); // Update navbar count
        } catch (error) {
            console.error("Failed to mark as read", error);
        }
    };

    return (
        <div className="space-y-4 max-w-3xl mx-auto">
            {items.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-900">No feedback yet</h3>
                    <p className="text-gray-500">When teachers review your work, it will appear here.</p>
                </div>
            )}

            {items.map((item) => (
                <div
                    key={item.id}
                    onClick={() => handleRead(item.id, item.isRead)}
                    className={`bg-white rounded-xl border p-6 transition-all cursor-pointer hover:shadow-md ${!item.isRead ? 'border-primary/50 shadow-sm ring-1 ring-primary/10' : 'border-gray-200'
                        }`}
                >
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold border border-indigo-100">
                                {item.author.image ? (
                                    <img src={item.author.image} alt="" className="h-10 w-10 rounded-full" />
                                ) : (
                                    item.author.name?.charAt(0) || "T"
                                )}
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900">{item.author.name}</h4>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <BookOpen className="h-3 w-3" />
                                        {item.course.title}
                                    </span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {new Date(item.createdAt).toLocaleDateString('es-AR', {
                                            day: 'numeric',
                                            month: 'long',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>
                        {!item.isRead && (
                            <span className="h-2.5 w-2.5 rounded-full bg-blue-600 animate-pulse"></span>
                        )}
                    </div>

                    <div className="pl-13 text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {item.content}
                    </div>
                </div>
            ))}
        </div>
    );
}
