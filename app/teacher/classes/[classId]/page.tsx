import { getClassDetails } from "@/app/actions/teacher";
import { StudioNavbar } from "@/components/studio/studio-navbar";
import { ClassDashboard } from "@/components/teacher/class-dashboard";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ClassDetailsPage({ params }: { params: Promise<{ classId: string }> }) {
    const { classId } = await params;
    const data = await getClassDetails(classId);

    if (!data) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <StudioNavbar />

            {/* Breadcrumb Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-3">
                <div className="container mx-auto flex items-center gap-2 text-sm text-gray-500">
                    <Link href="/teacher/classes" className="hover:text-gray-900">Classes</Link>
                    <ChevronRight className="h-4 w-4" />
                    <span className="font-medium text-gray-900">{data.name}</span>
                </div>
            </div>

            <main className="container mx-auto px-6 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">{data.name}</h1>
                    <p className="text-gray-500 mt-2">
                        {data.students.length} Students · {data.courses.length} Courses Assigned
                    </p>
                </div>

                <ClassDashboard
                    classId={data.id}
                    className={data.name}
                    students={data.students}
                    courses={data.courses}
                />
            </main>
        </div>
    );
}
