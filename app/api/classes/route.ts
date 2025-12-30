import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const classes = await prisma.schoolClass.findMany({
            orderBy: { createdAt: 'desc' },
            include: { courses: true }
        });
        return NextResponse.json(classes);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch classes" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        if (!body.name) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }

        const newClass = await prisma.schoolClass.create({
            data: {
                name: body.name,
                description: body.description,
            }
        });

        return NextResponse.json(newClass);
    } catch (error) {
        return NextResponse.json({ error: "Failed to create class" }, { status: 500 });
    }
}
