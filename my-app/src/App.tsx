import React from "react";
import { Note as NoteModel } from "./models/note";
import Note from "./components/Note";
import { Button, Col, Container, Row } from "react-bootstrap";
import styles from "./styles/NotesPage.module.css";
import styleUtils from "./styles/utils.module.css";
import * as NotesApi from "./network/notes_api";
import AddNote from "./components/AddEditNote";
import { FaPlus } from "react-icons/fa";
import AddEditNote from "./components/AddEditNote";

function App() {
  const [notes, setNotes] = React.useState<NoteModel[]>([]);

  const [showAddNote, setShowAddNote] = React.useState(false);

  const [noteToEdit, setNoteToEdit] =
    React.useState<NoteModel | null>(null);

  React.useEffect(() => {
    async function loadNotes() {
      try {
        const notes = await NotesApi.fetchNotes();
        setNotes(notes);
      } catch (error) {
        console.error(error);
        alert(error);
      }
    }
    loadNotes();
  }, []);

  async function deleteNote(note: NoteModel) {
    try {
      await NotesApi.deleteNote(note._id);
      setNotes(
        notes.filter((existingNote) => existingNote._id !== note._id)
      );
    } catch (error) {
      console.log(error);
      alert(error);
    }
  }

  return (
    <Container>
      <Button
        onClick={() => setShowAddNote(true)}
        className={`mb-2 mt-2 ${styleUtils.blockCenter} ${styleUtils.flexCenter}`}
      >
        <FaPlus />
        Add new note
      </Button>
      <Row xs={1} md={2} xl={3} className="g-4">
        {notes.map((note) => (
          <Col key={note._id}>
            <Note
              note={note}
              className={styles.note}
              onDelete={deleteNote}
              onNoteClicked={setNoteToEdit}
            />
          </Col>
        ))}
      </Row>
      {showAddNote && (
        <AddNote
          onDismiss={() => setShowAddNote(false)}
          onNoteSave={(newNote) => {
            setNotes([...notes, newNote]);
            setShowAddNote(false);
          }}
        />
      )}
      {noteToEdit && (
        <AddNote
          noteToEdit={noteToEdit}
          onDismiss={() => setNoteToEdit(null)}
          onNoteSave={(updatedNote) => {
            setNotes(
              notes.map((existingNote) =>
                existingNote._id === updatedNote._id
                  ? updatedNote
                  : existingNote
              )
            );
            setNoteToEdit(null);
          }}
        />
      )}
    </Container>
  );
}

export default App;
