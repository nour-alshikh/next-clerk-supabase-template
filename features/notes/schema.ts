import { z } from "zod";

// Shared by the form (client) and the actions (server).
export const noteSchema = z.object({
  content: z.string().trim().min(1, "Note can't be empty.").max(500, "Keep it under 500 characters."),
});
export type NoteInput = z.infer<typeof noteSchema>;

export const noteIdSchema = z.object({ id: z.number().int().positive() });

export const updateNoteSchema = noteSchema.extend(noteIdSchema.shape);
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;
