import React, { useRef, useState } from "react";
import { toBase64 } from "../../util/toBase64";
import axios from "axios";
import { server } from "../../util/urlConfig";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button, Form, ListGroup } from "react-bootstrap";

function EditPart({ optionList, part, songId }) {
  const router = useRouter();
  const collectiveId = router.query.collectiveId;
  const inputRef = useRef();
  const [newPartData, setNewPartData] = useState({
    instrument: part.instrument,
    filename: part.filename,
    file: "",
  });

  const showSaveButton =
    newPartData.instrument !== part.instrument || newPartData.file !== "";

  function deletePart(partId) {
    if (confirm(`Ar tikrai norite ištrinti šią partiją?`)) {
      axios
        .delete(
          `${server}/api/collectives/${collectiveId}/songs/${songId}/part?partId=${partId}`
        )
        .then(() => {
          router.replace(router.asPath);
        })
        .catch((err) => console.log(err));
    }
  }

  async function changePartFile(file) {
    const stringFile = await toBase64(file);
    setNewPartData({ ...newPartData, file: stringFile, filename: file.name });
  }

  function submitChanges(partId) {
    axios
      .patch(
        `${server}/api/collectives/${collectiveId}/songs/${songId}/part?partId=${partId}`,
        newPartData
      )
      .then(() => {
        setNewPartData({
          ...newPartData,
          file: "",
        });
        inputRef.current.value = "";
        router.replace(router.asPath);
      })
      .catch((err) => console.log(err));
  }

  return (
    <ListGroup.Item>
      <Link
        href={`/collectives/${collectiveId}/songs/${songId}?part=${part.instrument}`}
      >
        Peržiūrėti
      </Link>
      <Form.Select
        value={newPartData.instrument}
        onChange={(e) =>
          setNewPartData({ ...newPartData, instrument: e.target.value })
        }
      >
        {optionList}
      </Form.Select>
      <>{part.filename}</>
      <Form.Control
        type="file"
        size="sm"
        ref={inputRef}
        onChange={(e) => changePartFile(e.target.files[0])}
        className="mb-2"
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
