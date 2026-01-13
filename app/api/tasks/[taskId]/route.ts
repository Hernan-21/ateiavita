
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(request: Request, { params }: { params: Promise<{ taskId: string }> }) {
    const { taskId } = await params;
    try {
        const body = await request.json();

        const task = await prisma.task.update({
            where: { id: taskId },
            data: {
                title: body.title,
                content: (body.payload !== undefined) ? JSON.stringify(body.payload) : undefined,
                settings: (body.settings !== undefined) ? JSON.stringify(body.settings) : undefined,
            }
        });
        return NextResponse.json(task);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ taskId: string }> }) {
    const { taskId } = await params;
    try {
        await prisma.task.delete({
            where: { id: taskId }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
    }
}
