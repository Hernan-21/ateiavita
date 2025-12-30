import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const courses = await prisma.course.findMany({
            include: {
                _count: {
                    select: { units: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(courses);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const course = await prisma.course.create({
            data: {
                title: body.title,
                description: body.description,
                color: body.color || "blue",
                iconChar: body.iconChar || "A"
            }
        });
        return NextResponse.json(course);
    } catch (error) {
        return NextResponse.json({ error: "Failed to create course" }, { status: 500 });
    }
}
