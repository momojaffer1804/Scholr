import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const eventType = body.type || body.event || "email.delivered";
    const emailId = body.data?.email_id || body.data?.id || "evt_" + Date.now();
    const recipient = body.data?.to?.[0] || body.data?.recipient || "unknown@scholr.edu";

    console.log(`[Resend Webhook Received] Event: ${eventType} | ID: ${emailId}`);

    // Persist email delivery/bounce event in AuditLog
    const systemUser = await prisma.user.findFirst();
    if (systemUser) {
      await prisma.auditLog.create({
        data: {
          userId: systemUser.id,
          action: `RESEND_WEBHOOK_${eventType.toUpperCase().replace(/\./g, "_")}`,
          entityType: "EMAIL_WEBHOOK",
          entityId: emailId,
          metadata: JSON.stringify({
            event: eventType,
            recipient,
            timestamp: new Date().toISOString(),
            payload: body.data || {},
          }),
        },
      });
    }

    return NextResponse.json({ received: true, event: eventType, emailId });
  } catch (error: any) {
    console.error("Resend Webhook Error:", error);
    return NextResponse.json(
      { error: error?.message || "Webhook processing failed" },
      { status: 400 }
    );
  }
}
