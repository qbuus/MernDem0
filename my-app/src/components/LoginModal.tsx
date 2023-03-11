import React from "react";
import { User } from "../models/user";
import { LoginCredentials } from "../network/notes_api";
import { useForm } from "react-hook-form";
import * as NotesApi from "../network/notes_api";
import { Modal, Form, Button, Alert } from "react-bootstrap";
import TextInputField from "./form/TextInputField";
import styleUtils from "../styles/utils.module.css";
import { UnauthorizedError } from "../errors/http_errors";

interface LoginModalProps {
  onDismiss: () => void;
  onLoginSuccessful: (user: User) => void;
}

const LoginModal = ({
  onDismiss,
  onLoginSuccessful,
}: LoginModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginCredentials>();

  const [errorText, setErrorText] = React.useState<string | null>(
    null
  );

  async function onSubmit(credentials: LoginCredentials) {
    try {
      const user = await NotesApi.login(credentials);
      onLoginSuccessful(user);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        setErrorText(error.message);
      } else {
        alert(error);
        console.log(error);
      }
      console.error(error);
    }
  }

  return (
    <Modal show onHide={onDismiss}>
      <Modal.Header>
        <Modal.Title>Login</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {errorText && <Alert variant="danger">{errorText}</Alert>}
        <Form onSubmit={handleSubmit(onSubmit)}>
          <TextInputField
            name="username"
            label="Username"
            placeholder="Username"
            type="text"
            register={register}
            registerOptions={{ required: "Required" }}
            error={errors.username}
          />
          <TextInputField
            name="password"
            label="Password"
            placeholder="Password"
            type="password"
            register={register}
            registerOptions={{ required: "Required" }}
            error={errors.password}
          />
          <Button
            type="submit"
            disabled={isSubmitting}
            className={styleUtils.width100}
          >
            Sign Up
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default LoginModal;
