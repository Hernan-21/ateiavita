
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Attempting to create class...");
        const newClass = await prisma.schoolClass.create({
            data: {
                name: "Test Class " + Date.now(),
                description: "Created via debug script"
            }
        });
        console.log("Success! Created class:", newClass);
    } catch (e) {
        console.error("Error creating class:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
