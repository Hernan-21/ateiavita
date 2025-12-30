import { Folder, MoreVertical, BookOpen } from "lucide-react";
import Link from "next/link";
import { Level } from "@/types/content";

interface CourseCardProps {
    course: Level;
}

export function CourseCard({ course }: CourseCardProps) {
    return (
        <Link
            href={`/teacher/studio/${course.id}`}
            className="group relative bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-primary/50 transition-all cursor-pointer flex flex-col gap-4"
        >
            <div className={`w-12 h-12 rounded-lg bg-${course.color}-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                {course.iconChar}
            </div>

            <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg group-hover:text-primary transition-colors line-clamp-1">
                    {course.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                    {course.description}
                </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-50 text-xs text-gray-400 font-medium">
                <div className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    {course.units.length} Classes
                </div>
                <div className="bg-gray-50 px-2 py-1 rounded text-gray-500">
                    {course.id}
                </div>
            </div>
        </Link>
    );
}
