import { Stagger } from "@/components/motion/stagger";
import { getNotes } from "../queries";
import { DeleteNoteButton } from "./delete-note-button";

export async function NoteList() {
  const notes = await getNotes();

  if (notes.length === 0) {
    return <p className="text-sm text-muted-foreground">No notes yet.</p>;
  }

  return (
    <Stagger as="ul" className="flex flex-col divide-y">
      {notes.map((note) => (
        <li key={note.id} className="flex items-start justify-between gap-2 py-2 text-sm">
          <span className="whitespace-pre-wrap">{note.content}</span>
          <DeleteNoteButton id={note.id} />
        </li>
      ))}
    </Stagger>
  );
}
