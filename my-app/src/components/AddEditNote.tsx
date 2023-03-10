import React from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Note } from "../models/note";
import { NoteInput } from "../network/notes_api";
import * as NoteApi from "../network/notes_api";
import TextInputField from "./form/TextInputField";

interface AddEditNoteProps {
  onDismiss: () => void;
  onNoteSave: (note: Note) => void;
  noteToEdit?: Note;
}

const AddEditNote = ({
  onDismiss,
  onNoteSave,
  noteToEdit,
}: AddEditNoteProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NoteInput>({
    defaultValues: {
      title: noteToEdit?.title || "",
      text: noteToEdit?.text || "",
    },
  });

  async function onSubmit(input: NoteInput) {
    try {
      let noteResponse: Note;
      if (noteToEdit) {
        noteResponse = await NoteApi.updateNote(
          noteToEdit._id,
          input
        );
      } else {
        noteResponse = await NoteApi.createNote(input);
      }
      onNoteSave(noteResponse);
    } catch (error) {
      console.log(error);
      alert(error);
    }
  }

  return (
    <Modal show onHide={onDismiss}>
      <Modal.Header closeButton>
        <Modal.Title>
          {noteToEdit ? "Edit Note" : "Add Note"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form id="addEditNoteForm" onSubmit={handleSubmit(onSubmit)}>
          <TextInputField
            name="title"
            label="Title"
            type="text"
            placeholder="Title"
            register={register}
            registerOptions={{ required: "Required" }}
            error={errors.title}
          />
          <TextInputField
            name="text"
            label="Text"
            as="textarea"
            rows={5}
            placeholder="Text"
            register={register}
          />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          type="submit"
          form="addEditNoteForm"
          disabled={isSubmitting}
        >
          Save Note
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddEditNote;
