"use client";

import { useId } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { handleActionResult } from "@/lib/forms";
import { createNote, updateNote } from "../actions";
import type { Note } from "../queries";
import { noteSchema, type NoteInput } from "../schema";

type NoteFormProps = {
  /** Pass a note to edit it; leave out to create a new one. */
  note?: Pick<Note, "id" | "content">;
  /** Drawer mode: e.g. close the drawer. */
  onSuccess?: () => void;
  /** Page mode: where to go after saving, e.g. "/notes". */
  redirectTo?: string;
};

export function NoteForm({ note, onSuccess, redirectTo }: NoteFormProps) {
  const router = useRouter();
  const fieldId = useId();
  const form = useForm<NoteInput>({
    resolver: zodResolver(noteSchema),
    defaultValues: { content: note?.content ?? "" },
  });

  async function onSubmit(values: NoteInput) {
    const result = note ? await updateNote({ ...values, id: note.id }) : await createNote(values);
    if (!handleActionResult(form, result, note ? "Note updated" : "Note added")) return;
    if (!note) form.reset();
    onSuccess?.();
    if (redirectTo) router.push(redirectTo);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <Controller
        control={form.control}
        name="content"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={fieldId}>Note</FieldLabel>
            <Textarea
              {...field}
              id={fieldId}
              placeholder="Write something…"
              rows={5}
              aria-invalid={fieldState.invalid}
            />
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />
      <Button type="submit" className="self-end" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Saving…" : note ? "Save changes" : "Save note"}
      </Button>
    </form>
  );
}
