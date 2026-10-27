"use server";

import { refresh } from "next/cache";
import { ActionError, createAction } from "@/lib/action";
import { UPLOADS_BUCKET } from "@/lib/storage";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { filePathSchema } from "./schema";

export const deleteFile = createAction(filePathSchema, async ({ path }, { userId }) => {
  // RLS enforces this too; checking first gives a clear message
  if (!path.startsWith(`${userId}/`)) throw new ActionError("File not found.");

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.storage.from(UPLOADS_BUCKET).remove([path]);
  if (error) throw new ActionError(`Could not delete file: ${error.message}`);
  if (!data.length) throw new ActionError("File not found.");
  refresh();
});
