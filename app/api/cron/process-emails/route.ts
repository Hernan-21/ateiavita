import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";
import { render } from "@react-email/render";
import { Day3Grammar } from "@/emails/Day3Grammar";
import { Day7Test } from "@/emails/Day7Test";
import { Day15Motivation } from "@/emails/Day15Motivation";

export async function GET(request: Request) {
    // Basic security check (optional: add header verification)
    // const authHeader = request.headers.get('authorization');
    // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    //   return new Response('Unauthorized', { status: 401 });
    // }

    try {
        const pendingEmails = await (prisma as any).scheduledEmail.findMany({
            where: {
                status: "PENDING",
                scheduledFor: {
                    lte: new Date(),
                },
            },
            include: {
                user: true,
            },
            take: 10, // Process in batches to avoid timeout
        });

        if (pendingEmails.length === 0) {
            return NextResponse.json({ message: "No pending emails to process" });
        }

        const stats = { sent: 0, failed: 0 };

        for (const record of pendingEmails) {
            try {
                if (!record.user.email) {
                    throw new Error("User has no email");
                }

                let emailHtml;
                let subject;

                switch (record.type) {
                    case "DAY_3_GRAMMAR":
                        emailHtml = await render(Day3Grammar());
                        subject = "💡 Tu consejo de gramática del día";
                        break;
                    case "DAY_7_TEST":
                        emailHtml = await render(Day7Test());
                        subject = "📝 ¡Hora del test de nivel!";
                        break;
                    case "DAY_15_MOTIVATION":
                        emailHtml = await render(Day15Motivation());
                        subject = "🎉 ¡15 días aprendiendo!";
                        break;
                    default:
                        throw new Error(`Unknown email type: ${record.type}`);
                }

                await resend.emails.send({
                    from: 'Teia Vita <hola@ateiavita.pro>', // Update with your verified domain
                    to: record.user.email,
                    subject: subject,
                    html: emailHtml,
                });

                await (prisma as any).scheduledEmail.update({
                    where: { id: record.id },
                    data: { status: "SENT" },
                });

                stats.sent++;
            } catch (error) {
                console.error(`Failed to send email ${record.id}:`, error);
                await (prisma as any).scheduledEmail.update({
                    where: { id: record.id },
                    data: { status: "FAILED" }, // Could add retry logic here
                });
                stats.failed++;
            }
        }

        return NextResponse.json({
            message: "Processed emails",
            stats
        });

    } catch (error) {
        console.error("Cron job error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
