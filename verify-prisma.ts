import { prisma } from "./lib/prisma"

async function main() {
    try {
        console.log("Checking Prisma Client...");
        const userCount = await prisma.user.count();
        console.log(`Successfully connected! User count: ${userCount}`);
    } catch (e) {
        console.error("Prisma Error:", e);
        process.exit(1);
    }
}

main();
