
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { ChevronLeft, CheckCircle, Circle, FileText, PlayCircle } from "lucide-react";
import Link from "next/link";

export default async function StudentCoursePage({ params }: { params: Promise<{ courseId: string }> }) {
    const { courseId } = await params;
    const session = await auth();

    if (!session?.user?.email) {
        redirect("/login");
    }

    const course = await prisma.course.findUnique({
        where: { id: courseId },
        include: {
            units: {
                include: {
                    tasks: true
                },
                orderBy: {
                    createdAt: 'asc' // Assuming order by creation for now, or add an order field
                }
            }
        }
    });

    if (!course) {
        return <div>Course not found</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="container mx-auto px-4 md:px-8 py-8 max-w-5xl">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-4 transition-colors">
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Volver al Dashboard
                    </Link>

                    <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 rounded-2xl bg-${course.color}-100 text-${course.color}-600 flex items-center justify-center text-3xl font-bold shadow-sm`}>
                            {course.iconChar}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
                            <p className="text-gray-500">{course.description}</p>
                        </div>
                    </div>
                </div>

                {/* Units List */}
                <div className="space-y-6">
                    {course.units.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                            <p className="text-gray-500">No hay contenido disponible aún.</p>
                        </div>
                    ) : (
                        course.units.map((unit, index) => (
                            <div key={unit.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                                <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                                    <h2 className="font-bold text-lg text-gray-800">
                                        <span className="text-indigo-600 mr-2">Unidad {index + 1}:</span>
                                        {unit.title}
                                    </h2>
                                    <div className="flex items-center gap-3">
                                        {unit.pdfUrl && (
                                            <a
                                                href={unit.pdfUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors"
                                            >
                                                <FileText className="w-3 h-3" />
                                                Guide PDF
                                            </a>
                                        )}
                                        <span className="text-xs font-semibold bg-gray-100 text-gray-500 px-3 py-1 rounded-full">
                                            {unit.tasks.length} Tareas
                                        </span>
                                    </div>
                                </div>
                                <div className="divide-y divide-gray-50">
                                    {unit.tasks.map(task => (
                                        <Link
                                            key={task.id}
                                            href={`/student/courses/${course.id}/tasks/${task.id}`}
                                            className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors group cursor-pointer block"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="text-gray-300 group-hover:text-indigo-500 transition-colors">
                                                    {/* Placeholder logic for 'done' status would go here */}
                                                    <Circle className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-gray-900 group-hover:text-indigo-700 transition-colors">
                                                        {task.title}
                                                    </h3>
                                                    {/* Task type icon could go here based on task type if added later */}
                                                </div>
                                            </div>
                                            <div className="flex items-center text-gray-400 group-hover:text-indigo-600">
                                                {/* Action Button/Icon */}
                                                <PlayCircle className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        </Link>
                                    ))}
                                    {unit.tasks.length === 0 && (
                                        <div className="px-6 py-8 text-center text-gray-400 text-sm italic">
                                            No hay tareas en esta unidad.
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}
