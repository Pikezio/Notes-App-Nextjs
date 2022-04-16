import moment from "moment";
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
        <Card.Header>{moment(concert.date).format("LLL")}</Card.Header>
        <Card.Body>
          <Card.Title>{concert.title}</Card.Title>
          <div style={{ width: "500px" }}>
            {concert.poster && <Card.Img variant="top" src={concert.poster} />}
          </div>
        </Card.Body>
        <Card.Footer className="text-muted">Koncerto programa</Card.Footer>
        <ListGroup className="list-group-flush">
          {concert.songs &&
            concert.songs.map((song) => (
              <Link
                key={song._id}
                passHref
                href={`/collectives/${collectiveId}/songs/${song._id}?part=all`}
              >
                <ListGroupItem
                  action
                  className="d-flex justify-content-between align-items-start"
                >
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
