import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { ClassDetailView } from "@/components/student/class-detail";

export default async function StudentClassPage({ params }: { params: Promise<{ classId: string }> }) {
    const { classId } = await params;
    const session = await auth();

    if (!session?.user?.email) {
        redirect("/login");
    }

    const schoolClass = await prisma.schoolClass.findUnique({
        where: { id: classId },
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
    });

    if (!schoolClass) {
        return <div>Clase no encontrada</div>;
    }

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main className="container mx-auto px-4 md:px-8 py-8 max-w-4xl">
                <ClassDetailView
                    classId={schoolClass.id}
                    className={schoolClass.name}
                    classDescription={schoolClass.description}
                    courses={schoolClass.courses}
                />
            </main>
        </div>
    );
}
