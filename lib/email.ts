import "server-only";
import { Resend } from "resend";
import { serverEnv } from "@/lib/env.server";

const resend = serverEnv.RESEND_API_KEY ? new Resend(serverEnv.RESEND_API_KEY) : null;

/**
 * Sends an email built with a React Email component from `emails/`.
 * Without RESEND_API_KEY (local dev) it logs instead of sending.
 *
 * await sendEmail({ to, subject: "Welcome", react: <WelcomeEmail name="Sam" /> });
 */
export async function sendEmail({
  to,
  subject,
  react,
}: {
  to: string | string[];
  subject: string;
  react: React.ReactElement;
}) {
  if (!resend || !serverEnv.EMAIL_FROM) {
    console.info(`[email] RESEND_API_KEY/EMAIL_FROM not set, skipped "${subject}" to ${to}`);
    return;
  }
  const { error } = await resend.emails.send({ from: serverEnv.EMAIL_FROM, to, subject, react });
  if (error) throw new Error(`Email "${subject}" failed: ${error.message}`);
}
