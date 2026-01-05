import { r2 } from "../lib/r2";
import { PutBucketCorsCommand } from "@aws-sdk/client-s3";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
    try {
        const bucketName = process.env.R2_BUCKET_NAME;

        if (!bucketName) {
            console.error("❌ R2_BUCKET_NAME is not defined in .env");
            process.exit(1);
        }

        console.log(`Setting CORS configuration for bucket: ${bucketName}...`);

        const command = new PutBucketCorsCommand({
            Bucket: bucketName,
            CORSConfiguration: {
                CORSRules: [
                    {
                        AllowedHeaders: ["*"],
                        AllowedMethods: ["PUT", "POST", "GET", "HEAD"],
                        AllowedOrigins: ["http://localhost:3000", "https://*.vercel.app"], // Add your production domain here
                        ExposeHeaders: ["ETag"],
                        MaxAgeSeconds: 3000,
                    },
                ],
            },
        });

        await r2.send(command);

        console.log("✅ CORS configuration applied successfully!");
        console.log("You should now be able to upload files from the browser.");

    } catch (error) {
        console.error("❌ Failed to set CORS configuration:", error);
        process.exit(1);
    }
}

main();
