"use server";

import { refresh } from "next/cache";
import { ActionError, createAction } from "@/lib/action";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { noteIdSchema, noteSchema } from "./schema";

export const createNote = createAction(noteSchema, async ({ content }) => {
  const supabase = createServerSupabaseClient();
  // user_id defaults to the Clerk user id in the database
  const { error } = await supabase.from("notes").insert({ content });
  if (error) throw new ActionError(`Could not save note: ${error.message}`);
  refresh();
});

export const deleteNote = createAction(noteIdSchema, async ({ id }) => {
  const supabase = createServerSupabaseClient();
  const { error, count } = await supabase
    .from("notes")
    .delete({ count: "exact" })
    .eq("id", id);
  if (error) throw new ActionError(`Could not delete note: ${error.message}`);
  if (count === 0) throw new ActionError("Note not found.");
  refresh();
});
