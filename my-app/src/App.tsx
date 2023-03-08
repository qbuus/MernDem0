import React from "react";
import "./App.css";
import { Note } from "./models/note";

function App() {
  const [notes, setNotes] = React.useState<Note[]>([]);

  React.useEffect(() => {
    async function loadNotes() {
      try {
        const reponse = await fetch("/api/notes", { method: "GET" });
        const notes = await reponse.json();
        setNotes(notes);
      } catch (error) {
        console.error(error);
        alert(error);
      }
    }
    loadNotes();
  }, []);

  return <div className="App">{JSON.stringify(notes)};</div>;
}

export default App;
