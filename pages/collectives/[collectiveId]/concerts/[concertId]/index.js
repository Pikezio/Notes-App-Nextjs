import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { Card, Container, ListGroup, ListGroupItem } from "react-bootstrap";
import { getConcertById } from "../../../../../controllers/concertController";

const ConcertDetails = ({ concert }) => {
  const router = useRouter();
  const { collectiveId } = router.query;
  return (
    <Container>
      <Card className="text-center">
        <Card.Header></Card.Header>
        <Card.Body>
          <Card.Title>{concert.title}</Card.Title>

          {concert.poster && <Card.Img variant="top" src={concert.poster} />}
        </Card.Body>
        <Card.Footer className="text-muted">
          {moment(concert.date).format("LLL")}
        </Card.Footer>
        <ListGroup className="list-group-flush">
          {concert.songs &&
            concert.songs.map((song) => (
              <Link
                key={song._id}
                passHref
                href={`/collectives/${collectiveId}/songs/${song._id}?part=all`}
              >
                <ListGroupItem action>
                  {song.title} | {song.composer} | {song.arranger}
                </ListGroupItem>
              </Link>
            ))}
        </ListGroup>
      </Card>
    </Container>
  );
};

export default ConcertDetails;

export async function getServerSideProps(context) {
  const concert = JSON.parse(await getConcertById(context.query.concertId));

  return {
    props: {
      concert,
    },
  };
}
