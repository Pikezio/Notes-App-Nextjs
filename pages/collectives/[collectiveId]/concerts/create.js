import React, { useRef, useState } from "react";
import { Form, Button, Container, Col } from "react-bootstrap";
import { useRouter } from "next/router";
import axios from "axios";
import { toBase64 } from "../../../../util/toBase64";
import Image from "next/image";
import { getAllCollectiveSongs } from "../../../../controllers/songController";
import SetListMaker from "../../../../components/setListMaker";
import moment from "moment";
import { checkSession } from "../../../../middleware/checkSession";

export default function CreateConcert({ songs }) {
  const [validated, setValidated] = useState(false);
  const [poster, setPoster] = useState();
  const [concertSongs, setConcertSongs] = useState([]);

  const router = useRouter();
  const { collectiveId } = router.query;

  // Form field references
  const titleRef = useRef();
  const dateRef = useRef();

  const addSong = (song) => {
    // check if songId is already in concertSongs
    if (!concertSongs.includes(song)) {
      setConcertSongs([...concertSongs, song]);
    }
  };

  const removeSong = (song) => {
    const filtered = concertSongs.filter((s) => s._id !== song._id);
    setConcertSongs(filtered);
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(concertSongs);
    const [reorderedItems] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItems);

    setConcertSongs(items);
  };

  const submitForm = async (e) => {
    const form = e.currentTarget;
    e.preventDefault();
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    const data = {
      collectiveId: collectiveId,
      title: titleRef.current.value,
      date: dateRef.current.value,
      songs: concertSongs,
    };

    if (poster != null) {
      data.poster = poster;
    }

    axios
      .post(`/api/collectives/${collectiveId}/concerts`, data)
      .then(() => router.push(`/collectives/${collectiveId}`))
      .catch((err) => console.log(err));
  };

  return (
    <Container>
      <Form noValidate validated={validated} onSubmit={submitForm}>
        <Form.Group className="mb-3">
          <Form.Label>Koncerto pavadinimas</Form.Label>
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
        <Form.Group as={Col} className="mb-3">
          <Form.Label>Data</Form.Label>
          <Form.Control
            required
            min={moment(new Date()).format("YYYY-MM-DDTHH:mm")}
            type="datetime-local"
            placeholder="Data"
            ref={dateRef}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Skelbimas</Form.Label>
          <Form.Control
            type="file"
            placeholder="Skelbimas"
            onChange={async (e) => setPoster(await toBase64(e.target.files[0]))}
          />
          {poster && (
            <Image
              src={poster}
              alt="poster"
              width="100%"
              height="100%"
              layout="responsive"
              objectFit="contain"
            />
          )}
        </Form.Group>

        <SetListMaker
          songs={songs}
          addSong={addSong}
          concertSongs={concertSongs}
          removeSong={removeSong}
          handleOnDragEnd={handleOnDragEnd}
        />

        <Button className="mt-3" variant="success" type="submit">
          Sukurti
        </Button>
      </Form>
    </Container>
  );
}

CreateConcert.auth = true;

export async function getServerSideProps(context) {
  const hasSession = await checkSession(context);
  if (hasSession != null) return hasSession;

  const { collectiveId } = context.query;
  const songs = JSON.parse(await getAllCollectiveSongs(collectiveId));

  return {
    props: {
      songs,
    },
  };
}
