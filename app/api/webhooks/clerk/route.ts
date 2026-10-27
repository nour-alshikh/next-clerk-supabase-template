import { after, type NextRequest } from "next/server";
import type { UserJSON } from "@clerk/nextjs/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import * as Sentry from "@sentry/nextjs";
import { siteConfig } from "@/config/site";
import WelcomeEmail from "@/emails/welcome-email";
import { sendEmail } from "@/lib/email";
import { serverEnv } from "@/lib/env.server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

// Clerk → Webhooks → Add endpoint: https://<your-domain>/api/webhooks/clerk
// Events: user.created, user.updated, user.deleted.
// Keeps public.profiles in sync and removes a user's data when they delete their account.
export async function POST(request: NextRequest) {
  let event;
  try {
    // Checks the Svix signature with CLERK_WEBHOOK_SIGNING_SECRET
    event = await verifyWebhook(request, { signingSecret: serverEnv.CLERK_WEBHOOK_SIGNING_SECRET });
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  const supabase = createAdminSupabaseClient();

  try {
    switch (event.type) {
      case "user.created":
      case "user.updated": {
        const profile = toProfile(event.data);
        const { error } = await supabase.from("profiles").upsert(profile);
        if (error) throw new Error(`Profile upsert failed: ${error.message}`);

        if (event.type === "user.created" && profile.email) {
          const email = profile.email;
          const url = new URL("/dashboard", request.url).toString();
          // Send after responding, so Clerk doesn't time out and retry
          after(() =>
            sendEmail({
              to: email,
              subject: `Welcome to ${siteConfig.name}`,
              react: WelcomeEmail({ name: profile.first_name ?? undefined, appName: siteConfig.name, url }),
            }).catch((error) => Sentry.captureException(error)),
          );
        }
        break;
      }

      case "user.deleted": {
        const userId = event.data.id;
        if (!userId) break;
        await deleteUserData(supabase, userId);
        break;
      }
    }
  } catch (error) {
    console.error(error);
    Sentry.captureException(error);
    // 500 makes Clerk retry the delivery later
    return new Response("Webhook handler failed", { status: 500 });
  }

  return new Response("OK");
}

function toProfile(user: UserJSON) {
  const primary = user.email_addresses.find((e) => e.id === user.primary_email_address_id);
  return {
    id: user.id,
    email: primary?.email_address ?? user.email_addresses[0]?.email_address ?? null,
    first_name: user.first_name,
    last_name: user.last_name,
    image_url: user.image_url,
  };
}

// Add a line here for every user-owned table and bucket you create.
async function deleteUserData(supabase: ReturnType<typeof createAdminSupabaseClient>, userId: string) {
  const { data: files } = await supabase.storage.from("uploads").list(userId, { limit: 1000 });
  if (files?.length) {
    await supabase.storage.from("uploads").remove(files.map((f) => `${userId}/${f.name}`));
  }

  for (const table of ["notes"] as const) {
    const { error } = await supabase.from(table).delete().eq("user_id", userId);
    if (error) throw new Error(`Deleting ${table} failed: ${error.message}`);
  }

  const { error } = await supabase.from("profiles").delete().eq("id", userId);
  if (error) throw new Error(`Deleting profile failed: ${error.message}`);
}
