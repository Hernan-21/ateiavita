import { PutObjectCommand } from "@aws-sdk/client-s3";
import * as dotenv from "dotenv";

dotenv.config();

// Helper to handle relative path resolution or TS execution
// We assume this is run with tsx which handles .ts files

async function main() {
    try {
        console.log("Checking environment...");
        const accountId = process.env.R2_ACCOUNT_ID;
        const bucketName = process.env.R2_BUCKET_NAME;

        if (!accountId || !bucketName) {
            console.error("❌ Error: R2_ACCOUNT_ID or R2_BUCKET_NAME is missing. Please check your .env file.");
            console.log("Current R2_ACCOUNT_ID:", accountId);
            console.log("Current R2_BUCKET_NAME:", bucketName);
            process.exit(1);
        }

        // Dynamic import to ensure env vars are loaded before client initialization
        // We use relative path for import
        const { r2 } = await import("../lib/r2");



        console.log(`Attempting to upload a test file to bucket "${bucketName}" (Account ID: ${accountId})...`);

        const testKey = "verification-test.txt";
        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: testKey,
            Body: "Hello from Cloudflare R2 Integration! This confirms write access.",
            ContentType: "text/plain",
        });

        await r2.send(command);

        console.log("✅ Success! File uploaded successfully.");
        console.log(`Test file key: ${testKey}`);
        console.log("You can verify this in your Cloudflare R2 dashboard.");

    } catch (error) {
        console.error("❌ Operation failed:", error);
        process.exit(1);
    }
}

main();
