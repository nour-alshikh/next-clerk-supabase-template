"use client";

import { EditButton } from "@/components/crud/edit-button";
import type { Note } from "../queries";
import { NoteForm } from "./note-form";

export function EditNoteButton({ note }: { note: Note }) {
  return (
    <EditButton
      label="Edit note"
      title="Edit note"
      renderForm={(close) => <NoteForm note={note} onSuccess={close} />}
    />
  );
}
