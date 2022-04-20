import moment from "moment";
import { getSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { Container, ListGroup, Badge } from "react-bootstrap";
import { getUserCollectiveIds } from "../../controllers/collectiveController";
import { getAllConcerts } from "../../controllers/concertController";
import { checkSession } from "../../middleware/checkSession";

const ConcertPage = ({ concerts }) => {
  // group concerts by upcoming and past
  const upcomingConcerts = concerts.filter(
    (concert) => new Date(concert.date) > new Date()
  );
  const pastConcerts = concerts.filter(
    (concert) => new Date(concert.date) < new Date()
  );

  const constructList = (list) => {
    return list.map((concert) => (
      <ListGroup.Item action key={concert._id}>
        <Link
          passHref
          href={`/collectives/${concert.collectiveId}/concerts/${concert._id}`}
        >
          <div className="d-flex justify-content-between">
            <div>
              <div className="fw-bold">{concert.title}</div>
              <Badge pill bg="secondary">
                {concert.collectiveTitle}
              </Badge>
            </div>
            <div className="lead">{moment(concert.date).format("LLLL")}</div>
          </div>
        </Link>
      </ListGroup.Item>
    ));
  };

  return (
    <Container>
      <h1>Koncertai</h1>
      <ListGroup>
        <h3>Artimiausi</h3>
        {constructList(upcomingConcerts)}
        <h3 className="mt-2">Praėję</h3>
        {constructList(pastConcerts)}
      </ListGroup>
    </Container>
  );
};

export default ConcertPage;

export async function getServerSideProps(context) {
  // check session
  const hasSession = await checkSession(context);
  if (hasSession != null) return hasSession;

  const session = await getSession(context);
  const userCollectives = JSON.parse(
    await getUserCollectiveIds(session.userId)
  );
  const concerts = JSON.parse(await getAllConcerts(userCollectives));

  return {
    props: {
      concerts,
    },
  };
}
