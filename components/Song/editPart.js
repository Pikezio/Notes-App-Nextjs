import React, { useState } from "react";
import { toBase64 } from "../../util/toBase64";
import axios from "axios";
import { server } from "../../util/urlConfig";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button, Col, Form, ListGroup, Row } from "react-bootstrap";

function EditPart({ optionList, part, songId }) {
  const router = useRouter();
  const { collectiveId } = router.query;

  const [partFile, setPartFile] = useState(null);
  const [instrument, setInstrument] = useState(part.instrument);

  const showSaveButton = instrument !== part.instrument || partFile != null;

  function deletePart(partId) {
    if (confirm(`Ar tikrai norite ištrinti šią partiją?`)) {
      axios
        .delete(
          `${server}/api/collectives/${collectiveId}/songs/${songId}/part?partId=${partId}`
        )
        .then(() => router.replace(router.asPath))
        .catch((err) => console.log(err));
    }
  }

  async function submitChanges(partId) {
    let data = {};
    if (partFile != null) {
      data.filename = partFile.name;
      data.file = await toBase64(partFile);
    }

    if (instrument !== part.instrument) {
      data.instrument = instrument;
    }

    axios
      .patch(
        `${server}/api/collectives/${collectiveId}/songs/${songId}/part?partId=${partId}`,
        data
      )
      .then(() => router.replace(router.asPath))
      .catch((err) => console.log(err));
  }

  // eye svg icon
  const eye = (
    <Link
      passHref
      href={`/collectives/${collectiveId}/songs/${songId}?part=${part.instrument}`}
    >
      <svg
        style={{ cursor: "pointer" }}
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 24 24"
      >
        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
      </svg>
    </Link>
  );

  return (
    <ListGroup.Item>
      <Row>
        <Col className="d-flex align-items-center" lg={4}>
          {eye}
          <Form.Select
            value={instrument}
            onChange={(e) => setInstrument(e.target.value)}
            className="mx-2"
          >
            {optionList}
          </Form.Select>
        </Col>
        <Col lg={5}>
          <div>Failas: {part.filename}</div>
          <Form.Control
            type="file"
            size="sm"
            onChange={(e) => setPartFile(e.target.files[0])}
          />
        </Col>
        <Col className="d-flex align-items-center justify-content-end" lg={3}>
          <Button
            disabled={!showSaveButton}
            variant="success"
            onClick={() => submitChanges(part._id)}
          >
            Išsaugoti
          </Button>
          <Button
            variant="danger"
            className="mx-2"
            onClick={() => deletePart(part._id)}
          >
            Ištrinti partiją
          </Button>
        </Col>
      </Row>
    </ListGroup.Item>
  );
}

export default EditPart;
