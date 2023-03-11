import React from "react";
import SignUpModal from "./components/SignUpModal";
import LoginModal from "./components/LoginModal";
import NavBar from "./components/NavBar";
import { User } from "./models/user";
import * as NotesApi from "./network/notes_api";
import { BrowserRouter } from "react-router-dom";
import { Container } from "react-bootstrap";
import { Route, Routes } from "react-router";
import NotesPage from "./pages/NotesPage";
import PrivacyPage from "./pages/PrivacyPage";
import NotFoundPage from "./pages/NotFoundPage";
import styles from "./styles/App.module.css";

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
    <BrowserRouter>
      <div>
        <NavBar
          loggedInUser={loggedInUser}
          onLogInClicked={() => setShowLogInModal(true)}
          onLogOutSuccessful={() => setLoggedInUser(null)}
          onSignUpClicked={() => setShowSignUpModal(true)}
        />
        <Container className={styles.PageContainer}>
          <Routes>
            <Route
              path="/"
              element={<NotesPage loggedInUser={loggedInUser} />}
            />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/*" element={<NotFoundPage />} />
          </Routes>
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
    </BrowserRouter>
  );
}

export default App;
