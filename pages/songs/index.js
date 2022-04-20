import { getSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Button, Container, Form, ListGroup } from "react-bootstrap";
import { getAllUserSongs } from "../../controllers/songController";
import { checkSession } from "../../middleware/checkSession";

const AllUserSongs = ({ songs, filterQuery }) => {
  const [filter, setFilter] = useState(filterQuery);

  const router = useRouter();
  useEffect(() => {
    if (router.query.filter) {
      setFilter(router.query.filter);
    }
  }, [router.query.filter]);

  const filteredSongs = songs.filter((song) => {
    if (filter === "") {
      return true;
    } else {
      return (
        song.title.toLowerCase().includes(filter.toLowerCase()) ||
        song.composer.toLowerCase().includes(filter.toLowerCase()) ||
        song.arranger.toLowerCase().includes(filter.toLowerCase())
      );
    }
  });

  const groupSongsByFirstLetter = () => {
    const groupedSongs = {};
    filteredSongs
      .sort((a, b) => a.title.localeCompare(b.title))
      .forEach((song) => {
        const firstLetter = song.title[0].toUpperCase();
        if (!groupedSongs[firstLetter]) {
          groupedSongs[firstLetter] = [];
        }
        groupedSongs[firstLetter].push(song);
      });
    return groupedSongs;
  };

  if (!filteredSongs) {
    return <div>Nėra kūrinių...</div>;
  }

  const groupedSongs = groupSongsByFirstLetter();
  const list = Object.keys(groupedSongs).map((letter, idx) => (
    <div key={idx}>
      <ListGroup className="mb-2">
        <ListGroup.Item variant="dark">
          <strong>{letter}</strong>
        </ListGroup.Item>
        {groupedSongs[letter].map((song, idx) => (
          <Link
            key={idx}
            passHref
            href={`/collectives/${song.collectiveId}/songs/${song._id}`}
          >
            <ListGroup.Item action>
              <div className="d-flex justify-content-between">
                <div className="lead">{song.title}</div>
                <div>
                  <small>Kompozicija: {song.composer} | </small>
                  <small>Aranžuotė: {song.arranger}</small>
                </div>
              </div>
            </ListGroup.Item>
          </Link>
        ))}
      </ListGroup>
    </div>
  ));

  return (
    <Container>
      <div className="d-flex">
        <Form.Control
          type="input"
          placeholder="Paieška..."
          onChange={(e) => setFilter(e.target.value)}
          value={filter}
        />
        <Button className="mx-2" onClick={() => setFilter("")}>
          Išvalyti
        </Button>
      </div>

      <h1>Kūriniai</h1>
      {list}
    </Container>
  );
};

export default AllUserSongs;

export async function getServerSideProps(context) {
  const hasSession = await checkSession(context);
  if (hasSession != null) return hasSession;

  const { filter } = context.query;

  const session = await getSession(context);
  const songs = JSON.parse(await getAllUserSongs(session.userId));

  return {
    props: {
      songs,
      filterQuery: filter ? filter : "",
    },
  };
}
