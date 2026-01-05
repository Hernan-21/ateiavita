import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ unitId: string }> }) {
    const { unitId } = await params;
    try {
        const unit = await prisma.unit.findUnique({
            where: { id: unitId },
            include: {
                tasks: {
                    orderBy: { order: 'asc' }
                }
            }
        });

        if (!unit) return NextResponse.json({ error: "Unit not found" }, { status: 404 });
        return NextResponse.json(unit);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch unit" }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ unitId: string }> }) {
    const { unitId } = await params;
    try {
        const body = await request.json();
        const unit = await prisma.unit.update({
            where: { id: unitId },
            data: {
                title: body.title,
                pdfUrl: body.pdfUrl
            }
        });
        return NextResponse.json(unit);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update unit" }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ unitId: string }> }) {
    const { unitId } = await params;
    try {
        await prisma.unit.delete({
            where: { id: unitId }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete unit" }, { status: 500 });
    }
}
