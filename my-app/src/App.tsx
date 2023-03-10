import React from "react";
import { Note as NoteModel } from "./models/note";
import Note from "./components/Note";
import {
  Button,
  Col,
  Container,
  Row,
  Spinner,
} from "react-bootstrap";
import styles from "./styles/NotesPage.module.css";
import styleUtils from "./styles/utils.module.css";
import * as NotesApi from "./network/notes_api";
import AddNote from "./components/AddEditNote";
import { FaPlus } from "react-icons/fa";
import SignUpModal from "./components/SignUpModal";

function App() {
  const [notes, setNotes] = React.useState<NoteModel[]>([]);

  const [notesLoading, setNotesLoading] = React.useState(true);
  const [showNotesLoadingError, setShowNotesLoadingError] =
    React.useState(false);

  const [showAddNote, setShowAddNote] = React.useState(false);

  const [noteToEdit, setNoteToEdit] =
    React.useState<NoteModel | null>(null);

  React.useEffect(() => {
    async function loadNotes() {
      try {
        setShowNotesLoadingError(false);
        setNotesLoading(true);
        const notes = await NotesApi.fetchNotes();
        setNotes(notes);
      } catch (error) {
        console.error(error);
        setShowNotesLoadingError(true);
      } finally {
        setNotesLoading(false);
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

  const notesGrid = (
    <Row xs={1} md={2} xl={3} className={`g-4 ${styles.notesGrid}`}>
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
  );

  return (
    <Container className={styles.notesPage}>
      <Button
        onClick={() => setShowAddNote(true)}
        className={`mb-2 mt-2 ${styleUtils.blockCenter} ${styleUtils.flexCenter}`}
      >
        <FaPlus />
        Add new note
      </Button>
      {notesLoading && (
        <Spinner animation="border" variant="primary" />
      )}
      {showNotesLoadingError && (
        <p>Something went wrong. Refresh the page</p>
      )}
      {!notesLoading && !showNotesLoadingError && (
        <React.Fragment>
          {notes.length > 0 ? (
            notesGrid
          ) : (
            <p>You have not added a note yet</p>
          )}
        </React.Fragment>
      )}

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
      {true && (
        <SignUpModal
          onDismiss={() => {}}
          onSignUpSuccessful={() => {}}
        />
      )}
    </Container>
  );
}

export default App;
