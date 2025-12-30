import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request, { params }: { params: Promise<{ courseId: string }> }) {
    const { courseId } = await params;
    try {
        const body = await request.json();
        const unit = await prisma.unit.create({
            data: {
                title: body.title,
                courseId: courseId
            }
        });
        return NextResponse.json(unit);
    } catch (error) {
        return NextResponse.json({ error: "Failed to create unit" }, { status: 500 });
    }
}
