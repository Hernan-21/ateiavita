
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { classId, courseId, status } = body;

        if (!classId || !courseId || !status) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        // Find existing assignment
        const existing = await prisma.schoolClassCourse.findUnique({
            where: {
                classId_courseId: {
                    classId: classId,
                    courseId: courseId
                }
            }
        });

        let updateData: any = { assignedAt: new Date() };
        let createData: any = { classId, courseId, assignedAt: new Date() };

        if (status === 'saved') {
            // Logic for "Saved": Set isSaved = true.
            // If existing, keep its current status.
            // If new, status = "hidden" (not on board).
            updateData.isSaved = true;
            createData.isSaved = true;
            createData.status = "hidden"; // Default for new saved-only
        } else {
            // Logic for "Prepping/Teaching": Set status.
            // If existing, keep isSaved as is.
            // If new, isSaved = false (default).
            updateData.status = status;
            createData.status = status;
            createData.isSaved = false; // Or default
        }

        if (existing) {
            const updated = await prisma.schoolClassCourse.update({
                where: {
                    classId_courseId: { classId, courseId }
                },
                data: updateData
            });
            return NextResponse.json(updated);
        } else {
            const created = await prisma.schoolClassCourse.create({
                data: createData
            });
            return NextResponse.json(created);
        }

    } catch (error: any) {
        console.error("Assignment error:", error);
        // Log to file to be sure
        const fs = require('fs');
        fs.appendFileSync('db_error.log', new Date().toISOString() + ' ' + (error.message || JSON.stringify(error)) + '\n');
        return NextResponse.json({ error: "Failed to assign course: " + error.message }, { status: 500 });
    }
}
