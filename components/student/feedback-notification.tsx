"use client";

import { MessageSquare } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getStudentFeedback } from "@/app/actions/student";

export function FeedbackNotification() {
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const feedback = await getStudentFeedback();
                const unread = feedback.filter((f: any) => !f.isRead).length;
                setUnreadCount(unread);
            } catch (error) {
                console.error("Failed to fetch feedback", error);
            }
        };

        fetchFeedback();
    }, []);

    return (
        <Link href="/student/feedback" className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-primary transition-colors relative">
            <div className="relative">
                <MessageSquare className="h-5 w-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                        {unreadCount}
                    </span>
                )}
            </div>
            <span className="hidden md:inline">Feedback</span>
        </Link>
    );
}
