import React from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Note } from "../models/note";
import { NoteInput } from "../network/notes_api";
import * as NoteApi from "../network/notes_api";

interface AddNoteProps {
  onDismiss: () => void;
  onNoteSave: (note: Note) => void;
}

const AddNote = ({ onDismiss, onNoteSave }: AddNoteProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NoteInput>();

  async function onSubmit(input: NoteInput) {
    try {
      const noteResponse = await NoteApi.createNote(input);
      onNoteSave(noteResponse);
    } catch (error) {
      console.log(error);
      alert(error);
    }
  }

  return (
    <Modal show onHide={onDismiss}>
      <Modal.Header closeButton>
        <Modal.Title>Add Note</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form id="addNoteForm" onSubmit={handleSubmit(onSubmit)}>
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
          form="addNoteForm"
          disabled={isSubmitting}
        >
          Save Note
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddNote;
