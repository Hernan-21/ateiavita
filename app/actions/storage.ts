'use server'

import { r2 } from "@/lib/r2";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";


const BUCKET_NAME = process.env.R2_BUCKET_NAME;
const PUBLIC_URL = process.env.R2_PUBLIC_URL;

export type UploadResult = {
    url: string;
    key: string;
    presignedUrl: string;
};

export async function getPresignedUploadUrl(
    contentType: string,
    fileName?: string
): Promise<{ success: true; result: UploadResult } | { success: false; error: string }> {
    try {
        if (!BUCKET_NAME) {
            throw new Error("R2_BUCKET_NAME is not configured");
        }

        const fileExtension = contentType.split("/")[1] || "bin";
        const uniqueKey = `${crypto.randomUUID()}.${fileExtension}`;
        const key = fileName ? `${crypto.randomUUID()}-${fileName}` : uniqueKey;

        const command = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
            ContentType: contentType,
        });

        // URL expires in 15 minutes (900 seconds)
        const presignedUrl = await getSignedUrl(r2, command, { expiresIn: 900 });

        const publicUrl = PUBLIC_URL
            ? `${PUBLIC_URL}/${key}`
            : `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${BUCKET_NAME}/${key}`; // Fallback, though likely not public readable without custom configuration

        return {
            success: true,
            result: {
                url: publicUrl,
                key,
                presignedUrl,
            },
        };
    } catch (error) {
        console.error("Error generating presigned URL:", error);
        return { success: false, error: "Failed to generate upload URL" };
    }
}

export async function deleteFile(key: string): Promise<{ success: boolean; error?: string }> {
    try {
        if (!BUCKET_NAME) {
            throw new Error("R2_BUCKET_NAME is not configured");
        }

        const command = new DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
        });

        await r2.send(command);
        return { success: true };
    } catch (error) {
        console.error("Error deleting file:", error);
        return { success: false, error: "Failed to delete file" };
    }
}
