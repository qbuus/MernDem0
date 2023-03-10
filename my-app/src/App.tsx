import React from "react";
import { Container } from "react-bootstrap";
import styles from "./styles/NotesPage.module.css";
import SignUpModal from "./components/SignUpModal";
import LoginModal from "./components/LoginModal";
import NavBar from "./components/NavBar";
import { User } from "./models/user";
import * as NotesApi from "./network/notes_api";
import NotesPageLoggedInView from "./components/NotesPageLoggedInView";
import NotesPageLoggedOutView from "./components/NotesPageLoggedOutView";

function App() {
  const [loggedInUser, setLoggedInUser] = React.useState<User | null>(
    null
  );

  const [showSignUpModal, setShowSignUpModal] = React.useState(false);
  const [showLogInModal, setShowLogInModal] = React.useState(false);

  React.useEffect(function () {
    async function fetchLoggedInUser() {
      try {
        const user = await NotesApi.getLoggedIn();
        setLoggedInUser(user);
      } catch (error) {
        console.error(error);
      }
    }
    fetchLoggedInUser();
  }, []);

  return (
    <div>
      <NavBar
        loggedInUser={loggedInUser}
        onLogInClicked={() => setShowLogInModal(true)}
        onLogOutSuccessful={() => setLoggedInUser(null)}
        onSignUpClicked={() => setShowSignUpModal(true)}
      />
      <Container className={styles.notesPage}>
        <>
          {loggedInUser ? (
            <NotesPageLoggedInView />
          ) : (
            <NotesPageLoggedOutView />
          )}
        </>
      </Container>
      {showSignUpModal && (
        <SignUpModal
          onDismiss={() => setShowSignUpModal(false)}
          onSignUpSuccessful={(user) => {
            setLoggedInUser(user);
            setShowSignUpModal(false);
          }}
        />
      )}
      {showLogInModal && (
        <LoginModal
          onDismiss={() => setShowLogInModal(false)}
          onLoginSuccessful={(user) => {
            setLoggedInUser(user);
            setShowLogInModal(false);
          }}
        />
      )}
    </div>
  );
}

export default App;
