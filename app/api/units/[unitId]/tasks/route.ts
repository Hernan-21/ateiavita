
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Create Task
export async function POST(request: Request, { params }: { params: Promise<{ unitId: string }> }) {
    const { unitId } = await params;
    try {
        const body = await request.json();

        // Get highest order to append
        const lastTask = await prisma.task.findFirst({
            where: { unitId: unitId },
            orderBy: { order: 'desc' }
        });
        const newOrder = lastTask ? lastTask.order + 1 : 0;

        const task = await prisma.task.create({
            data: {
                title: body.title,
                type: body.type,
                content: JSON.stringify(body.payload || {}), // Store as JSON string
                settings: JSON.stringify(body.settings || { required: true, points: 10 }),
                unitId: unitId,
                order: newOrder
            }
        });
        return NextResponse.json(task);
    } catch (error) {
        return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
    }
}

// Batch Update (Reorder)
export async function PUT(request: Request, { params }: { params: Promise<{ unitId: string }> }) {
    // Unused param unitId, but we must await it to conform to API
    await params;
    try {
        const body = await request.json();
        const { tasks } = body; // Expects array of { id, order }

        if (!Array.isArray(tasks)) {
            return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
        }

        // Transaction to update all orders
        await prisma.$transaction(
            tasks.map((task: any) =>
                prisma.task.update({
                    where: { id: task.id },
                    data: { order: task.order }
                })
            )
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to reorder tasks" }, { status: 500 });
    }
}
