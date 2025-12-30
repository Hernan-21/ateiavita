
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(request: Request, { params }: { params: Promise<{ classId: string }> }) {
    const { classId } = await params;
    try {
        const body = await request.json();
        const { courseId, status } = body;

        if (!courseId || !status) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const updated = await prisma.schoolClassCourse.update({
            where: {
                classId_courseId: {
                    classId: classId,
                    courseId: courseId
                }
            },
            data: { status }
        });

        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
    }
}
