import { getStudentFeedback } from "@/app/actions/student";
import { FeedbackList } from "@/components/student/feedback-list";
import { Navbar } from "@/components/layout/Navbar";

export default async function FeedbackPage() {
    const feedback = await getStudentFeedback();

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto px-6 py-8">
                <div className="mb-8 max-w-3xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">My Feedback</h1>
                    <p className="text-gray-500">View feedback and comments from your teachers.</p>
                </div>

                <FeedbackList feedback={feedback} />
            </main>
        </div>
    );
}
