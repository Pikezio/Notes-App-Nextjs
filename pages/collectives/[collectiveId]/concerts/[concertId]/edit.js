import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Container, Form } from "react-bootstrap";
import SetListMaker from "../../../../../components/setListMaker";
import { toBase64 } from "../../../../../util/toBase64";
import Image from "next/image";
import { checkSession } from "../../../../../middleware/checkSession";
import { getAllCollectiveSongs } from "../../../../../controllers/songController";
import { getConcertById } from "../../../../../controllers/concertController";

const ConcertEdit = ({ songs, concert }) => {
  const [validated, setValidated] = useState(false);
  const [concertSongs, setConcertSongs] = useState(concert.songs);

  const router = useRouter();
  const { collectiveId } = router.query;

  // Form field references
  const [title, setTitle] = useState(concert.title);
  const [date, setDate] = useState(concert.date);
  const [description, setDescription] = useState(concert.description);
  const [poster, setPoster] = useState(concert.poster);

  const different = !(
    concert.songs.length === concertSongs.length &&
    concert.songs.every((song, index) => song._id === concertSongs[index]._id)
  );

  // check if values have changed
  const letSave =
    title !== concert.title ||
    date !== concert.date ||
    poster !== concert.poster ||
    description !== concert.description ||
    different;

  const addSong = (song) => {
    // check if songId is already in concertSongs
    if (!concertSongs.find((s) => s._id === song._id)) {
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

    let data = {};
    if (title !== concert.title) {
      data.title = title;
    }

    if (description !== concert.description) {
      data.description = description;
    }

    if (date !== concert.date) {
      data.date = date;
    }

    if (poster != null && poster !== concert.poster) {
      data.poster = poster;
    }

    if (different) {
      data.songs = concertSongs;
    }

    axios
      .patch(
        `/api/collectives/${collectiveId}/concerts?id=${concert._id}`,
        data
      )
      .then(() => router.push(`/collectives/${collectiveId}/concerts`))
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
            onChange={(e) => setTitle(e.target.value)}
            defaultValue={concert.title}
          />
          <Form.Control.Feedback type="invalid">
            Pavadinimas yra privalomas.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Koncerto aprašymas</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            onChange={(e) => setDescription(e.target.value)}
            defaultValue={concert.description}
          />
        </Form.Group>
        <Form.Group as={Col} className="mb-3">
          <Form.Label>Data</Form.Label>
          <Form.Control
            required
            min={moment(new Date()).format("YYYY-MM-DDTHH:mm")}
            type="datetime-local"
            placeholder="Data"
            onChange={(e) => setDate(e.target.value)}
            defaultValue={moment(concert.date).format("YYYY-MM-DDTHH:mm")}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Skelbimas</Form.Label>
          <Form.Control
            type="file"
            placeholder="Skelbimas"
            onChange={async (e) => setPoster(await toBase64(e.target.files[0]))}
          />
          {concert.poster && (
            <Image
              src={poster ? poster : concert.poster}
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

        <Button
          disabled={!letSave}
          className="mt-3"
          variant="success"
          type="submit"
        >
          Išsaugoti pakeitimus
        </Button>
      </Form>
    </Container>
  );
};

export default ConcertEdit;

export async function getServerSideProps(context) {
  const hasSession = await checkSession(context);
  if (hasSession != null) return hasSession;

  const { collectiveId, concertId } = context.query;

  const concert = JSON.parse(await getConcertById(concertId));
  const songs = JSON.parse(await getAllCollectiveSongs(collectiveId));

  return {
    props: {
      songs,
      concert,
    },
  };
}
