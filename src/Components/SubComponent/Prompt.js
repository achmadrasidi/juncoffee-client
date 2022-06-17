import React from "react";
import { Button, Modal } from "react-bootstrap";

const Prompt = ({ show, confirm, message, cancel }) => {
  return (
    <Modal show={show} onHide={cancel} backdrop="static" keyboard={true}>
      <Modal.Header closeButton>
        <Modal.Title>{message}</Modal.Title>
      </Modal.Header>
      <Modal.Footer>
        <Button variant="success" onClick={confirm}>
          Yes
        </Button>
        <Button variant="danger" onClick={cancel}>
          No,Wait
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export const AddProdPrompt = ({ show, confirm, cancel }) => {
  return (
    <Modal show={show} onHide={cancel} backdrop="static" keyboard={true}>
      <Modal.Body className="text-center">
        <Button variant="success" className="me-3" onClick={confirm}>
          Add more Product
        </Button>
        <Button variant="danger" onClick={cancel}>
          Done
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default Prompt;
