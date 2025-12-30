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
