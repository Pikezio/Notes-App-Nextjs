import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import {
  Button,
  Card,
  Container,
  ListGroup,
  ListGroupItem,
} from "react-bootstrap";
import { getConcertById } from "../../../../../controllers/concertController";
import { isOwner } from "../../../../../middleware/isUserCollectiveOwner";
import { getSession } from "next-auth/react";

const ConcertDetails = ({ concert, owner }) => {
  const router = useRouter();
  const { collectiveId, concertId } = router.query;
  return (
    <Container>
      <Card className="text-center">
        <Card.Header>{moment(concert.date).format("LLL")}</Card.Header>
        <Card.Body>
          <Card.Title>{concert.title}</Card.Title>
          <Card.Text>{concert.description}</Card.Text>
          {owner && (
            <Link
              passHref
              href={`/collectives/${collectiveId}/concerts/${concertId}/edit`}
            >
              <Button>Redaguoti</Button>
            </Link>
          )}
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
                  <div className="lead">
                    {song.title} | {song.composer} | {song.arranger}
                  </div>
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
  const { concertId, collectiveId } = context.query;
  const concert = JSON.parse(await getConcertById(concertId));

  const session = await getSession(context);

  const owner = await isOwner(collectiveId, session.userId);

  return {
    props: {
      concert,
      owner,
    },
  };
}
