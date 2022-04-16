import React, { useRef, useState, useEffect } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import FileUpload from "../../../../components/files/fileUpload";
import { useRouter } from "next/router";
import { server } from "../../../../util/urlConfig";
import axios from "axios";

export default function CreateSong() {
  const [validated, setValidated] = useState(false);

  const router = useRouter();
  const { collectiveId } = router.query;

  // Form field references
  const titleRef = useRef();
  const composerRef = useRef();
  const arrangerRef = useRef();
  const videoRef = useRef();
  const submitButton = useRef();

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

  const returnParts = async (parts) => {
    setParts(parts);
    submitButton.current.click();
  };

  const submitForm = async (e) => {
    const form = e.currentTarget;
    e.preventDefault();
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    sendData();
  };

  const sendData = async () => {
    const data = {
      title: titleRef.current.value,
      composer: composerRef.current.value,
      arranger: arrangerRef.current.value,
      video: videoRef.current.value,
      parts: parts,
    };

    axios
      .post(url, data)
      .then(() => router.push("/"))
      .catch((err) => console.log(err));
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
          instrumentList={instruments}
          returnParts={returnParts}
          buttonText="Sukurti"
        />
        <Button hidden type="submit" ref={submitButton}></Button>
      </Form>
    </Container>
  );
}

CreateSong.auth = true;
