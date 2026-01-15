
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { StudentDashboard } from "@/components/student/student-dashboard";

export default async function StudentPage() {
    const session = await auth();

    if (!session?.user?.email) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email }
    });

    if (!user) {
        redirect("/login");
    }

    // Fetch Enrollments and Visible Courses
    const enrollments = await prisma.enrollment.findMany({
        where: { userId: user.id },
        include: {
            class: {
                include: {
                    courses: {
                        where: {
                            status: { in: ['teaching', 'taught'] }
                        },
                        include: {
                            course: true
                        },
                        orderBy: {
                            assignedAt: 'desc'
                        }
                    }
                }
            }
        },
        orderBy: {
            joinedAt: 'desc'
        }
    });

    // Fetch Feedback
    const allFeedback = await prisma.feedback.findMany({
        where: { studentId: user.id },
        include: {
            author: true,
            course: true
        },
        orderBy: { createdAt: 'desc' }
    });

    const formattedClasses = enrollments.map(e => {
        const classFeedback = allFeedback.filter(f => f.classId === e.class.id);

        return {
            id: e.class.id,
            name: e.class.name,
            description: e.class.description,
            courses: e.class.courses.map(c => ({
                course: c.course,
                status: c.status
            })),
            feedback: classFeedback.map(f => ({
                id: f.id,
                content: f.content,
                createdAt: f.createdAt,
                authorName: f.author.name,
                courseTitle: f.course.title
            }))
        };
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto px-6 py-8 max-w-7xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
                    <p className="text-gray-500">Manage your classes and assignments.</p>
                </div>

                <StudentDashboard initialClasses={formattedClasses} />
            </main>
        </div>
    );
}
