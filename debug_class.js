
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Find the class we just fixed
    console.log("--- DEBUGGING CLASS ---");
    const cls = await prisma.schoolClass.findFirst({
        orderBy: { updatedAt: 'desc' },
        include: { courses: true, enrollments: true }
    });

    if (!cls) {
        console.log("No classes found.");
        return;
    }

    console.log(`Class: ${cls.name}`);
    console.log(`Code: '${cls.code}'`); // Quotes to see hidden spaces
    console.log(`ID: ${cls.id}`);
    console.log(`Enrollments: ${cls.enrollments.length}`);
    console.log("--- COURSES ---");
    cls.courses.forEach(c => {
        console.log(`- CourseId: ${c.courseId} | Status: '${c.status}' | Saved: ${c.isSaved}`);
    });
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
