import React, { useRef, useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import FileUpload from "../../../components/files/FileUpload";
import { useRouter } from "next/router";

export default function CreateSong() {
  const router = useRouter();

  // Form field references
  const titleRef = useRef();
  const composerRef = useRef();
  const arrangerRef = useRef();

  const [parts, setParts] = useState();

  // Updates state, when files change
  function handleFileChange(e) {
    let newState = Array.from(e.target.files).map((f) => ({
      file: f,
      instrument: "undefined",
    }));
    setParts(newState);
  }

  // Updates state, when instruments are selected
  function handleDropDownChange(e, partId) {
    const selectedInstrument = e.target.value;
    let newParts = [...parts];

    // Changing the selected part
    newParts[partId].instrument = selectedInstrument;
    setParts(newParts);
  }

  // Submits the form
  const submitForm = async () => {
    const data = {
      title: titleRef.current.value,
      composer: composerRef.current.value,
      arranger: arrangerRef.current.value,
      parts,
    };

    console.log(data);

    const url = `/api/collectives/${collectiveId}/`;

    try {
      const res = await fetch(url, {
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
      //setMessage("Failed to add pet");
    }
  };

  return (
    <Container>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Kūrinio pavadinimas</Form.Label>
          <Form.Control
            size="lg"
            type="text"
            placeholder="Pavadinimas"
            ref={titleRef}
          />
        </Form.Group>
        <Row className="mb-3">
          <Form.Group as={Col}>
            <Form.Label>Kompozitorius</Form.Label>
            <Form.Control
              type="text"
              placeholder="Kompozitorius"
              ref={composerRef}
            />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>Aranžuotojas</Form.Label>
            <Form.Control
              type="text"
              placeholder="Aranžuotojas"
              ref={arrangerRef}
            />
          </Form.Group>
        </Row>

        <FileUpload
          handleDropDownChange={handleDropDownChange}
          handleFileChange={handleFileChange}
          parts={parts}
        />
        <Button className="mt-3" onClick={submitForm}>
          Įrašyti
        </Button>
      </Form>
    </Container>
  );
}
