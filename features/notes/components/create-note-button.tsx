"use client";

import { CreateButton } from "@/components/crud/create-button";
import { notesConfig } from "../config";
import { NoteForm } from "./note-form";

export function CreateNoteButton() {
  return (
    <CreateButton
      mode={notesConfig.createMode}
      label="New note"
      href="/notes/new"
      title="New note"
      description="Notes are private to your account."
      renderForm={(close) => <NoteForm onSuccess={close} />}
    />
  );
}
