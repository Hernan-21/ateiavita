
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const classes = await prisma.schoolClass.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5
    });

    console.log("Checking recent classes for long codes...");
    for (const c of classes) {
        if (c.code && c.code.length > 8) {
            const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
            console.log(`Fixing class "${c.name}" (Code: ${c.code}) -> New Code: ${newCode}`);
            await prisma.schoolClass.update({
                where: { id: c.id },
                data: { code: newCode }
            });
        }
    }
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
