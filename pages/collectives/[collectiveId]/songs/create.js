import React, { useRef, useState, useEffect } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import FileUpload from "../../../../components/files/fileUpload";
import { useRouter } from "next/router";
import { server } from "../../../../util/urlConfig";
import axios from "axios";
import { toBase64 } from "../../../../util/toBase64";

export default function CreateSong({ owner }) {
  const [validated, setValidated] = useState(false);

  const router = useRouter();
  const { collectiveId } = router.query;

  // Form field references
  const titleRef = useRef();
  const composerRef = useRef();
  const arrangerRef = useRef();
  const videoRef = useRef();

  const [parts, setParts] = useState([]);
  const [instruments, setInstruments] = useState([]);

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

  // Updates state, when files change
  function handleFileChange(e) {
    let newState = Array.from(e.target.files).map((file) => {
      return {
        file: file,
        filename: file.name,
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

  const submitForm = async (e) => {
    const form = e.currentTarget;
    e.preventDefault();
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    const data = await constructData();
    axios
      .post(url, data)
      .then(() => router.push("/"))
      .catch((err) => console.log(err));
  };

  const constructData = async () => {
    const songData = {
      title: titleRef.current.value,
      composer: composerRef.current.value,
      arranger: arrangerRef.current.value,
      video: videoRef.current.value,
    };

    const base64parts = await Promise.all(
      parts.map(async (item) => {
        const base64 = await toBase64(item.file);
        item.file = base64;
        return item;
      })
    );
    return { ...songData, parts: base64parts };
  };

  return (
    <Container>
      <Form noValidate validated={validated} onSubmit={submitForm}>
        <Form.Group className="mb-3">
          <Form.Label>Kūrinio pavadinimas</Form.Label>
          <Form.Control
            required
            size="lg"
            type="text"
            placeholder="Pavadinimas"
            ref={titleRef}
          />
          <Form.Control.Feedback type="invalid">
            Pavadinimas yra privalomas.
          </Form.Control.Feedback>
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
        <Form.Group className="mb-3">
          <Form.Label>Video nuoroda</Form.Label>
          <Form.Control
            size="lg"
            type="text"
            placeholder="Video"
            ref={videoRef}
          />
        </Form.Group>

        <FileUpload
          handleDropDownChange={handleDropDownChange}
          handleFileChange={handleFileChange}
          parts={parts}
          instrumentList={instruments}
        />
        <Button className="mt-3" type="submit">
          Įrašyti
        </Button>
      </Form>
    </Container>
  );
}

CreateSong.auth = true;
