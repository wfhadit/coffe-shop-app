import { useToast } from "@chakra-ui/react";
import { useState } from "react";
import { Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export const ModalConfirmation = ({ show, setShow, action, username }) => {
  const toast = useToast();
  const handleClose = () => {
    setAskPassword(false);
    setShow("");
  };
  const [askPassword, setAskPassword] = useState(false);

  return (
    <Modal show={show !== ""} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Action Confirmation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure want to{" "}
        {show === "DELETE" ? (
          <b className="text-danger">DELETE</b>
        ) : (
          <b>UPDATE</b>
        )}{" "}
        this account {`(${username})`}?
        {askPassword && show === "DELETE" ? (
          <Form>
            <Form.Group className="mt-3" controlId="userpasswordForm-1">
              <Form.Label>Input your password</Form.Label>
              <Form.Control type="password" placeholder="password" />
            </Form.Group>
          </Form>
        ) : null}
      </Modal.Body>

      <Modal.Footer>
        {!askPassword && show === "DELETE" ? (
          <Button
            className="bg-cyan-300"
            onClick={() => {
              setAskPassword(true);
              toast({
                status: "info",
                title: "Please fill your password",
                isClosable: true,
                duration: 2000,
                position: "top",
              });
            }}
          >
            Yes
          </Button>
        ) : (
          <Button
            className="bg-cyan-300"
            onClick={() => {
              show === "DELETE"
                ? action(document.getElementById("userpasswordForm-1").value)
                : action();
              handleClose();
            }}
          >
            YES
          </Button>
        )}

        <Button
          className="bg-secondary-subtle outline-secondary-subtle"
          onClick={handleClose}
        >
          No
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
