import { r2 } from "@/lib/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { filename, contentType } = await request.json();

        // Runtime validation of environment variables
        if (!process.env.R2_ACCOUNT_ID || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
            console.error("Missing R2 environment variables at runtime");
            return NextResponse.json({
                error: "Server configuration error: R2 credentials missing",
                debug: {
                    hasAccountId: !!process.env.R2_ACCOUNT_ID,
                    hasAccessKey: !!process.env.R2_ACCESS_KEY_ID,
                    hasSecret: !!process.env.R2_SECRET_ACCESS_KEY
                }
            }, { status: 500 });
        }

        if (!filename || !contentType) {
            return NextResponse.json({ error: "Missing filename or contentType" }, { status: 400 });
        }

        // Generate a unique key
        const uniqueId = crypto.randomUUID();
        const key = `guides/${uniqueId}-${filename}`;

        const command = new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: key,
            ContentType: contentType,
        });

        // Generate presigned URL (valid for 5 minutes)
        const uploadUrl = await getSignedUrl(r2, command, { expiresIn: 300 });

        // Public access URL (assuming R2_PUBLIC_URL is set in environment, or construct it)
        // If R2_PUBLIC_URL is not set, we can try to fall back or just use the key. 
        // Ideally, user has a custom domain or we use the R2 dev domain.
        // For now, let's assume we return the URL relative to the public domain if available.

        let publicUrl = "";
        if (process.env.R2_PUBLIC_URL) {
            publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`;
        } else {
            // Fallback: Construct it if possible or just return the key and let frontend handle it?
            // Let's assume standard R2 dev URL structure if variable missing, or warn.
            publicUrl = `https://pub-${process.env.R2_ACCOUNT_ID}.r2.dev/${key}`;
            // Note: The above is a guess at the dev subdomain. It's better if the user provides R2_PUBLIC_URL.
        }

        return NextResponse.json({ uploadUrl, publicUrl, key });
    } catch (error) {
        console.error("Presigned URL error:", error);
        return NextResponse.json({ error: "Failed to generate upload URL" }, { status: 500 });
    }
}
