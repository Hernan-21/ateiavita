import { useState, useEffect } from "react";
import { X, MessageSquare, Loader2, Trash2 } from "lucide-react";
import { saveFeedback, updateFeedback, deleteFeedback } from "@/app/actions/teacher";

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
    studentId: string;
    studentName: string;
    courseId: string;
    classId: string;
    existingFeedback?: { id: string, content: string } | null;
}

export function FeedbackModal({
    isOpen,
    onClose,
    studentId,
    studentName,
    courseId,
    classId,
    existingFeedback
}: FeedbackModalProps) {
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setContent(existingFeedback?.content || "");
        }
    }, [isOpen, existingFeedback]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (existingFeedback) {
                await updateFeedback(existingFeedback.id, content, classId);
            } else {
                await saveFeedback({
                    content,
                    studentId,
                    courseId,
                    classId,
                });
            }
            setContent("");
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!existingFeedback || !confirm("Are you sure you want to delete this feedback?")) return;

        setIsDeleting(true);
        try {
            await deleteFeedback(existingFeedback.id, classId);
            setContent("");
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <div className="flex items-center gap-2 text-indigo-600">
                        <MessageSquare className="h-5 w-5" />
                        <h3 className="font-bold text-gray-900">
                            {existingFeedback ? "Edit Feedback" : "Feedback"} for {studentName}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Your verified feedback
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full h-32 p-3 text-sm text-gray-900 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                            placeholder="Write your feedback here..."
                            required
                        />
                    </div>

                    <div className="flex justify-between items-center pt-2">
                        <div>
                            {existingFeedback && (
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    disabled={isDeleting || isSubmitting}
                                    className="px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
                                >
                                    {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                    Delete
                                </button>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting || isDeleting || !content.trim()}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                                {existingFeedback ? "Update" : "Send Feedback"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
