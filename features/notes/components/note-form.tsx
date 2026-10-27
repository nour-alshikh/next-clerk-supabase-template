"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { handleActionResult } from "@/lib/forms";
import { createNote } from "../actions";
import { noteSchema, type NoteInput } from "../schema";

export function NoteForm() {
  const form = useForm<NoteInput>({
    resolver: zodResolver(noteSchema),
    defaultValues: { content: "" },
  });

  async function onSubmit(values: NoteInput) {
    const result = await createNote(values);
    if (handleActionResult(form, result, "Note added")) form.reset();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <Controller
        control={form.control}
        name="content"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="note-content">New note</FieldLabel>
            <Textarea
              {...field}
              id="note-content"
              placeholder="Write something…"
              aria-invalid={fieldState.invalid}
            />
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />
      <Button type="submit" className="self-end" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Saving…" : "Add note"}
      </Button>
    </form>
  );
}
