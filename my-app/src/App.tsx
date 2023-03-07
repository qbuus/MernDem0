import React from "react";
import "./App.css";
import { Button } from "react-bootstrap";

function App() {
  const [clickCount, setClickCount] = React.useState(0);

  return (
    <Button
      onClick={() => setClickCount((prev) => prev + 1)}
    >
      Click {clickCount} times
    </Button>
  );
}

export default App;
