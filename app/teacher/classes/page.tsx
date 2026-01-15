import { getTeacherClasses } from "@/app/actions/teacher";
import Link from "next/link";
import { Users, BookOpen, Calendar } from "lucide-react";
import { StudioNavbar } from "@/components/studio/studio-navbar";

export default async function TeacherClassesPage() {
    const classes = await getTeacherClasses();

    return (
        <div className="min-h-screen bg-gray-50">
            <StudioNavbar />
            <main className="container mx-auto px-6 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Classes</h1>
                    <p className="text-gray-500 mt-2">Manage your students and track their progress.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {classes.map((cls) => (
                        <Link
                            key={cls.id}
                            href={`/teacher/classes/${cls.id}`}
                            className="block bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all p-6 group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="h-12 w-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 group-hover:scale-105 transition-transform">
                                    <Users className="h-6 w-6" />
                                </div>
                                <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                    {cls.code}
                                </span>
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 mb-2">{cls.name}</h3>

                            <div className="space-y-2 text-sm text-gray-500">
                                <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    <span>{cls.studentCount} Students</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <BookOpen className="h-4 w-4" />
                                    <span className="truncate">{cls.courses || "No courses assigned"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    <span>Created {new Date(cls.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </Link>
                    ))}

                    {classes.length === 0 && (
                        <div className="col-span-full text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900">No classes found</h3>
                            <p className="text-gray-500">Get started by creating a new class.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
