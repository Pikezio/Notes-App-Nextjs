import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { server } from "../../../util/urlConfig";
import { getSession } from "next-auth/react";
import { getSongCollectiveId } from "../../../controllers/songController";
import { getInstruments } from "../../../controllers/instrumentController";
import { Container, FloatingLabel, Form } from "react-bootstrap";

export default function SongDetails({ instruments }) {
  const router = useRouter();
  const { songId, part, collectiveId } = router.query;
  const [song, setSong] = useState(null);
  const [selectedInstrument, setSelectedInstrument] = useState("");

  useEffect(() => {
    const fetchPart = async (part) => {
      return await axios.get(`${server}/api/songs/${songId}?part=${part}`);
    };

    const getPart = async () => {
      // If URL doesn't specify part, get from storage
      if (part == null && collectiveId != null) {
        const localPart = localStorage.getItem(collectiveId);
        if (!router.isReady) return;
        const response = await fetchPart(localPart);
        setSong(response.data);
        setSelectedInstrument(localPart);
      } // If URL does specify get from url
      else {
        const response = await fetchPart(part);
        setSong(response.data);
        setSelectedInstrument(part);
      }
    };
    getPart();
  }, [part, songId, router.isReady, collectiveId]);

  // Refetch when instrument changes
  useEffect(() => {
    const getPart = async () => {
      const response = await axios.get(
        `${server}/api/songs/${songId}?part=${selectedInstrument}`
      );
      setSong(response.data);
    };
    getPart();
  }, [selectedInstrument, songId]);

  const partSelector = (
    <FloatingLabel controlId="floatingSelect" label="Partija" className="mb-2">
      <Form.Select
        name="part"
        id="part"
        onChange={(e) => setSelectedInstrument(e.target.value)}
        value={selectedInstrument ? selectedInstrument : "---"}
      >
        {instruments &&
          instruments.map((i, idx) => (
            <option key={idx} value={i}>
              {i}
            </option>
          ))}
      </Form.Select>
    </FloatingLabel>
  );

  // TODO: make a loading bar
  return (
    <Container>
      {song ? (
        <>
          <div>
            <h1>Pavadinimas: {song.title}</h1>
            <h3>Kompozitorius: {song.composer}</h3>
            <h3>Aranžuotojas: {song.arranger}</h3>
            {partSelector}
          </div>
          <div className="embed-responsive ">
            <embed
              className="embed-responsive-item"
              src={song.parts[0].file}
              width="100%"
              height="600"
            />
          </div>
        </>
      ) : (
        <>
          <h1>Nėra tokios partijos...</h1>
          {partSelector}
        </>
      )}
    </Container>
  );
}

SongDetails.auth = true;

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const { collectiveId } = await getSongCollectiveId(context);
  const instruments = JSON.parse(
    await getInstruments(collectiveId)
  ).instruments;

  return {
    props: {
      instruments,
    },
  };
}
