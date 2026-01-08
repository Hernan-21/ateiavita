import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(request: Request, { params }: { params: Promise<{ classId: string }> }) {
    const { classId } = await params;
    try {
        await prisma.schoolClass.delete({
            where: { id: classId }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete class" }, { status: 500 });
    }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ classId: string }> }) {
    const { classId } = await params;
    try {
        const body = await request.json();
        const { name, description } = body;

        const updatedClass = await prisma.schoolClass.update({
            where: { id: classId },
            data: {
                name,
                description
            }
        });

        return NextResponse.json(updatedClass);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update class" }, { status: 500 });
    }
}
