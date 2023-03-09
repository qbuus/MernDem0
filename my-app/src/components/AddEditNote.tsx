import React from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Note } from "../models/note";
import { NoteInput } from "../network/notes_api";
import * as NoteApi from "../network/notes_api";

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
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Title"
              {...register("title", { required: "Required" })}
              isInvalid={!!errors.title}
            />
            <Form.Control.Feedback type="invalid">
              {errors.title?.message}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Text</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Text"
              rows={6}
              {...register("text")}
            />
          </Form.Group>
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