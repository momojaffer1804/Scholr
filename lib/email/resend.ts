import { Resend } from "resend";
import { render } from "@react-email/render";
import { AssignmentCreatedEmail } from "@/components/emails/AssignmentCreatedEmail";
import { prisma } from "@/lib/db";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function sendAssignmentNotificationEmail(payload: {
  recipientEmail: string;
  studentName: string;
  assignmentTitle: string;
  courseCode: string;
  dueDate: string;
  priority: string;
  userId: string;
}) {
  try {
    const html = await render(
      AssignmentCreatedEmail({
        studentName: payload.studentName,
        assignmentTitle: payload.assignmentTitle,
        courseCode: payload.courseCode,
        dueDate: payload.dueDate,
        priority: payload.priority,
      })
    );

    if (resend) {
      const data = await resend.emails.send({
        from: "Scholr Academic <notifications@scholr.edu>",
        to: payload.recipientEmail,
        subject: `[Scholr] New Assignment: ${payload.assignmentTitle} (${payload.courseCode})`,
        html,
      });

      // Log email activity in AuditLog
      await prisma.auditLog.create({
        data: {
          userId: payload.userId,
          action: "EMAIL_DISPATCHED",
          entityType: "TRANSACTIONAL_EMAIL",
          entityId: data.data?.id || "resend_id",
          metadata: JSON.stringify({
            provider: "Resend API",
            recipient: payload.recipientEmail,
            subject: payload.assignmentTitle,
            status: "DELIVERED_TO_QUEUE",
          }),
        },
      });

      return { success: true, emailId: data.data?.id };
    } else {
      // Local dev fallback when RESEND_API_KEY is not configured
      console.log(`[Resend Email Configured / Dev Mode] Rendered email for ${payload.recipientEmail}`);

      await prisma.auditLog.create({
        data: {
          userId: payload.userId,
          action: "EMAIL_CONFIGURED",
          entityType: "TRANSACTIONAL_EMAIL",
          metadata: JSON.stringify({
            provider: "Resend (React Email Rendered)",
            recipient: payload.recipientEmail,
            subject: payload.assignmentTitle,
            status: "PREPARED_DEV_ENVIRONMENT",
          }),
        },
      });

      return { success: true, simulated: true };
    }
  } catch (error: any) {
    console.error("Resend email dispatch error:", error);
    return { error: error?.message || "Failed to dispatch email." };
  }
}
