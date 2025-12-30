import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ courseId: string }> }) {
    const { courseId } = await params;
    try {
        const fullCourse = await prisma.course.findUnique({
            where: { id: courseId },
            include: {
                units: {
                    include: {
                        tasks: {
                            orderBy: { order: 'asc' }
                        }
                    },
                    orderBy: { createdAt: 'asc' }
                }
            }
        });

        if (!fullCourse) return NextResponse.json({ error: "Course not found" }, { status: 404 });
        return NextResponse.json(fullCourse);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch course" }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ courseId: string }> }) {
    const { courseId } = await params;
    try {
        const body = await request.json();
        const course = await prisma.course.update({
            where: { id: courseId },
            data: {
                title: body.title,
                description: body.description,
                color: body.color,
                iconChar: body.iconChar
            }
        });
        return NextResponse.json(course);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update course" }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ courseId: string }> }) {
    const { courseId } = await params;
    try {
        await prisma.course.delete({
            where: { id: courseId }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete course" }, { status: 500 });
    }
}
