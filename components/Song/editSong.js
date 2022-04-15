import React, { useState } from "react";
import axios from "axios";
import { server } from "../../util/urlConfig";
import { useRouter } from "next/router";
import { Button, Form } from "react-bootstrap";

function EditSong({ song }) {
  const [validated, setValidated] = useState(false);

  const router = useRouter();
  const collectiveId = router.query.collectiveId;

  const [newSongData, setNewSongData] = useState({
    title: song.title,
    composer: song.composer,
    arranger: song.arranger,
    video: song.video,
  });

  const songId = song._id;
  const showSaveButton =
    newSongData.title !== song.title ||
    newSongData.composer !== song.composer ||
    newSongData.arranger !== song.arranger ||
    newSongData.video !== song.video;

  const submitEdit = async (e) => {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      setValidated(true);
      return;
    }

    e.preventDefault();

    // Construct the payload for updating the specific elements
    let payload = {};
    if (newSongData.title !== song.title) {
      payload = {
        ...payload,
        title: newSongData.title,
      };
    }

    if (newSongData.composer !== song.composer) {
      payload = {
        ...payload,
        composer: newSongData.composer,
      };
    }

    if (newSongData.arranger !== song.arranger) {
      payload = {
        ...payload,
        arranger: newSongData.arranger,
      };
    }

    if (newSongData.video !== song.video) {
      payload = {
        ...payload,
        video: newSongData.video,
      };
    }

    console.log(`${server}/api/collectives/${collectiveId}/songs/${songId}/`);
    axios
      .patch(
        `${server}/api/collectives/${collectiveId}/songs/${songId}/`,
        payload
      )
      .then(() => router.replace(router.asPath))
      .catch((err) => console.log(err));
  };

  const confirmDelete = () => {
    if (confirm(`Ar tikrai norite ištrinti kūrinį "${song.title}"?`)) {
      axios
        .delete(`${server}/api/collectives/${collectiveId}/songs/${songId}/`)
        .then(() => router.replace("/"))
        .catch((err) => console.log(err));
    }
  };

  return (
    <Form noValidate validated={validated} onSubmit={submitEdit}>
      <Form.Group controlId="titleControl">
        <Form.Label>Pavadinimas</Form.Label>
        <Form.Control
          required
          type="text"
          name="title"
          value={newSongData.title}
          onChange={(e) => {
            setNewSongData({ ...newSongData, title: e.target.value });
            setValidated(false);
          }}
          className="mb-2"
        />
        <Form.Control.Feedback type="invalid">
          Pavadinimas negali būti tuščias.
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Label>Kompozitorius</Form.Label>
      <Form.Control
        type="text"
        name="composer"
        value={newSongData.composer}
        onChange={(e) => {
          setNewSongData({ ...newSongData, composer: e.target.value });
          setValidated(false);
        }}
        className="mb-2"
      />

      <Form.Label>Aranžuotojas</Form.Label>
      <Form.Control
        type="text"
        name="arranger"
        value={newSongData.arranger}
        onChange={(e) => {
          setNewSongData({ ...newSongData, arranger: e.target.value });
          setValidated(false);
        }}
        className="mb-2"
      />

      <Form.Label>Video</Form.Label>
      <Form.Control
        type="text"
        name="video"
        value={newSongData.video}
        onChange={(e) => {
          setNewSongData({ ...newSongData, video: e.target.value });
          setValidated(false);
        }}
        className="mb-2"
      />

      <Button variant="success" disabled={!showSaveButton} type="submit">
        Išsaugoti
      </Button>
      <Button
        onClick={confirmDelete}
        className="mx-2"
        type="button"
        variant="danger"
      >
        Ištrinti
      </Button>
    </Form>
  );
}

export default EditSong;
