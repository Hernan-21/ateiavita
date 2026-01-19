
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const classes = await prisma.schoolClass.findMany({ where: { code: null } });
    console.log(`Found ${classes.length} classes to backfill.`);
    for (const c of classes) {
        // Simple 6 char code like "4Q2ACC"
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        await prisma.schoolClass.update({
            where: { id: c.id },
            data: { code: code }
        });
        console.log(`Updated ${c.name} with code ${code}`);
    }
}
main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
