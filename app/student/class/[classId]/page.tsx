
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { ChevronLeft, ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";

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
        <div className="min-h-screen bg-gray-50 pb-20">
            <Navbar />

            <main className="container mx-auto px-4 md:px-8 py-8 max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-4 transition-colors">
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Volver a Mis Clases
                    </Link>

                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{schoolClass.name}</h1>
                        <p className="text-gray-500">{schoolClass.description || "Sin descripción"}</p>
                    </div>
                </div>

                {/* Courses List */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-indigo-600" />
                        Materias Disponibles
                    </h2>

                    {schoolClass.courses.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                            <p className="text-gray-500">No hay materias disponibles en esta clase aún.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {schoolClass.courses.map(({ course, status }) => (
                                <Link
                                    key={course.id}
                                    href={`/student/courses/${course.id}`}
                                    className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all group cursor-pointer relative overflow-hidden block"
                                >
                                    <div className={`absolute top-0 right-0 w-24 h-24 bg-${course.color}-500/10 rounded-bl-full -mr-12 -mt-12 transition-transform group-hover:scale-150`} />

                                    <div className="flex items-start justify-between mb-4 relative">
                                        <div className={`w-12 h-12 rounded-xl bg-${course.color || 'indigo'}-100 text-${course.color || 'indigo'}-600 flex items-center justify-center text-xl font-bold`}>
                                            {course.iconChar || 'A'}
                                        </div>
                                        {status === 'taught' && (
                                            <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                                Completado
                                            </span>
                                        )}
                                    </div>

                                    <h4 className="font-bold text-gray-900 mb-2 line-clamp-2 relative">{course.title}</h4>
                                    <p className="text-sm text-gray-500 mb-4 line-clamp-2 relative">{course.description || "Sin descripción"}</p>

                                    <div className="flex items-center text-sm font-medium text-indigo-600 relative opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
                                        Ver Contenido <ArrowRight className="w-4 h-4 ml-1" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
