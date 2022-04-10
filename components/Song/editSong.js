import React, { useState } from "react";
import axios from "axios";
import { server } from "../../util/urlConfig";
import { useRouter } from "next/router";
import { Button, Form } from "react-bootstrap";

function EditSong({ song }) {
  const router = useRouter();
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

  const submitEdit = async () => {
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

    axios
      .patch(`${server}/api/songs/${songId}/`, payload)
      .then(() => router.replace(router.asPath))
      .catch((err) => console.log(err));
  };

  const confirmDelete = () => {
    if (confirm(`Ar tikrai norite ištrinti kūrinį "${song.title}"?`)) {
      axios
        .delete(`${server}/api/songs/${songId}/`)
        .then(() => router.replace("/"))
        .catch((err) => console.log(err));
    }
  };

  return (
    <Form>
      <Form.Label>Pavadinimas</Form.Label>
      <Form.Control
        type="text"
        name="title"
        value={newSongData.title}
        onChange={(e) =>
          setNewSongData({ ...newSongData, title: e.target.value })
        }
        className="mb-2"
      />

      <Form.Label>Kompozitorius</Form.Label>
      <Form.Control
        type="text"
        name="composer"
        value={newSongData.composer}
        onChange={(e) =>
          setNewSongData({ ...newSongData, composer: e.target.value })
        }
        className="mb-2"
      />

      <Form.Label>Aranžuotojas</Form.Label>
      <Form.Control
        type="text"
        name="arranger"
        value={newSongData.arranger}
        onChange={(e) =>
          setNewSongData({ ...newSongData, arranger: e.target.value })
        }
        className="mb-2"
      />

      <Form.Label>Video</Form.Label>
      <Form.Control
        type="text"
        name="video"
        value={newSongData.video}
        onChange={(e) =>
          setNewSongData({ ...newSongData, video: e.target.value })
        }
        className="mb-2"
      />

      <Button
        variant="success"
        disabled={!showSaveButton}
        onClick={submitEdit}
        type="button"
      >
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
