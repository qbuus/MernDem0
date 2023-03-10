import React from "react";
import { Button } from "react-bootstrap";

interface NavBarLoggedOutViewProps {
  onSignUpClicked: () => void;
  onLogInClicked: () => void;
}

const NavBarLoggedOutView = ({
  onSignUpClicked,
  onLogInClicked,
}: NavBarLoggedOutViewProps) => {
  return (
    <React.Fragment>
      <Button onClick={onSignUpClicked}>Sign Up</Button>
      <Button onClick={onLogInClicked}>Log In</Button>
    </React.Fragment>
  );
};

export default NavBarLoggedOutView;
