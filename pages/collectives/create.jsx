import React, { useRef, useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useRouter } from "next/router";
import axios from "axios";

export default function CreateCollective() {
  const router = useRouter();

  // Form field references
  const titleRef = useRef();

  // Submits the form
  const submitForm = async () => {
    const data = {
      title: titleRef.current.value,
    };

    axios
      .post("/api/collectives", data)
      .then(router.push("/"))
      .catch((err) => console.log(err));
  };

  return (
    <Container>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Kolektyvo pavadinimas</Form.Label>
          <Form.Control
            size="lg"
            type="text"
            placeholder="Pavadinimas"
            ref={titleRef}
          />
        </Form.Group>
        <Button className="mt-3" onClick={submitForm}>
          Įrašyti
        </Button>
      </Form>
    </Container>
  );
}

CreateCollective.auth = true;
