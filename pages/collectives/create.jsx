import React, { useRef, useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useRouter } from "next/router";
import axios from "axios";

export default function CreateSong() {
  const router = useRouter();

  // Form field references
  const titleRef = useRef();

  // Submits the form
  const submitForm = async () => {
    const data = {
      title: titleRef.current.value,
    };

    try {
      const res = await fetch("/api/collectives", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      // Throw error with status code in case Fetch API req failed
      if (!res.ok) {
        throw new Error(res.status);
      }

      router.push("/");
    } catch (error) {
      console.log(error);
    }
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
