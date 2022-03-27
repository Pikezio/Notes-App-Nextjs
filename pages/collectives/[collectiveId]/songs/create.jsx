import React, { useRef, useState, useEffect } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import FileUpload from "../../../components/files/FileUpload";
import { useRouter } from "next/router";
import { server } from "../../../../util/urlConfig";
import { useSession } from "next-auth/react";
import axios from "axios";

export default function CreateSong({ owner }) {
  const session = useSession();

  const router = useRouter();
  const { collectiveId } = router.query;

  // Form field references
  const titleRef = useRef();
  const composerRef = useRef();
  const arrangerRef = useRef();

  const [parts, setParts] = useState();
  const [instruments, setInstruments] = useState();

  const url = `/api/collectives/${collectiveId}/songs`;

  useEffect(() => {
    if (collectiveId) {
      const getInstruments = async () => {
        const response = await axios.get(
          `${server}/api/collectives/${collectiveId}/instruments`
        );
        setInstruments(["---", ...response.data.instruments]);
      };
      getInstruments();
    }
  }, [collectiveId]);

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  // Updates state, when files change
  function handleFileChange(e) {
    let newState = Array.from(e.target.files).map((file) => {
      return {
        file: file,
        instrument: "undefined",
      };
    });
    setParts(newState);
  }

  // Updates state, when instruments are selected
  function handleDropDownChange(e, partId) {
    const selectedInstrument = e.target.value;
    let newParts = [...parts];
    newParts[partId].instrument = selectedInstrument;
    setParts(newParts);
  }

  const submitForm = async (data) => {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(res.status);
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  const constructData = async () => {
    const songData = {
      title: titleRef.current.value,
      composer: composerRef.current.value,
      arranger: arrangerRef.current.value,
    };

    const base64parts = await Promise.all(
      parts.map(async (item) => {
        const base64 = await toBase64(item.file);
        item.file = base64;
        return item;
      })
    );
    console.log(fullObject);
    const fullObject = { ...songData, parts: base64parts };
    await submitForm(fullObject);
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
          instrumentList={instruments}
        />
        <Button className="mt-3" onClick={constructData}>
          Įrašyti
        </Button>
      </Form>
    </Container>
  );
}
