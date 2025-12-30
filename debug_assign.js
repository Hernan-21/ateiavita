
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Fetching classes...");
        const classes = await prisma.schoolClass.findMany({ take: 1 });
        if (classes.length === 0) {
            console.log("No classes found. Please create one first.");
            return;
        }
        const classId = classes[0].id;
        console.log("Found class:", classId, classes[0].name);

        console.log("Fetching courses...");
        const courses = await prisma.course.findMany({ take: 1 });
        if (courses.length === 0) {
            console.log("No courses found.");
            return;
        }
        const courseId = courses[0].id;
        console.log("Found course:", courseId, courses[0].title);

        console.log("Attempting assignment upsert...");
        const assignment = await prisma.schoolClassCourse.upsert({
            where: {
                classId_courseId: {
                    classId: classId,
                    courseId: courseId
                }
            },
            update: {
                status: "prepping", // test update
                assignedAt: new Date()
            },
            create: {
                classId: classId,
                courseId: courseId,
                status: "saved"
            }
        });
        console.log("Assignment successful:", assignment);

    } catch (e) {
        console.error("Assignment FAILED:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
