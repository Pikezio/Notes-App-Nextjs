import React, { useState } from "react";
import { toBase64 } from "../../util/toBase64";
import axios from "axios";
import { server } from "../../util/urlConfig";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button, Form, ListGroup } from "react-bootstrap";

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

  return (
    <ListGroup.Item className="d-flex align-items-center justify-content-between">
      <Link
        href={`/collectives/${collectiveId}/songs/${songId}?part=${part.instrument}`}
      >
        Peržiūrėti
      </Link>
      <Form.Select
        value={instrument}
        onChange={(e) => setInstrument(e.target.value)}
      >
        {optionList}
      </Form.Select>
      <>{part.filename}</>
      <Form.Control
        type="file"
        size="sm"
        onChange={(e) => setPartFile(e.target.files[0])}
      />
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
    </ListGroup.Item>
  );
}

export default EditPart;
