import axios from "axios";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { Button, Container, ListGroup, ListGroupItem } from "react-bootstrap";
import { getConcertsByCollectiveId } from "../../../../controllers/concertController";
import { checkSession } from "../../../../middleware/checkSession";

const Concerts = ({ concerts }) => {
  const router = useRouter();
  const { collectiveId } = router.query;

  const deleteConcert = (concert) => {
    if (confirm(`Ar tikrai norite ištrinti koncertą: ${concert.title}?`)) {
      axios
        .delete(`/api/collectives/${collectiveId}/concerts?id=${concert._id}`)
        .then(() => router.push(router.asPath))
        .catch((err) => console.log(err));
    }
  };

  return (
    <Container>
      <Link href={`/collectives/${collectiveId}/concerts/create`} passHref>
        <Button variant="dark" className="mx-2 my-1">
          Pridėti koncertą
        </Button>
      </Link>
      <ListGroup>
        {concerts &&
          concerts.map((concert) => (
            <ListGroupItem
              className="d-flex justify-content-between align-items-center"
              key={concert._id}
            >
              <Link
                passHref
                href={`/collectives/${collectiveId}/concerts/${concert._id}`}
              >
                <div>
                  {concert.title} {moment(concert.date).format("LLL")}
                </div>
              </Link>
              <div>
                <Link
                  passHref
                  href={`/collectives/${collectiveId}/concerts/${concert._id}`}
                >
                  <Button className="mx-2">Peržiūrėti</Button>
                </Link>
                <Link
                  passHref
                  href={`/collectives/${collectiveId}/concerts/${concert._id}/edit`}
                >
                  <Button>Redaguoti</Button>
                </Link>
                <Button
                  className="mx-2"
                  variant="danger"
                  onClick={() => deleteConcert(concert)}
                >
                  Ištrinti
                </Button>
              </div>
            </ListGroupItem>
          ))}
      </ListGroup>
    </Container>
  );
};

export default Concerts;

export async function getServerSideProps(context) {
  const redirect = await checkSession(context);
  if (redirect != null) return redirect;

  const concerts = JSON.parse(
    await getConcertsByCollectiveId(context.query.collectiveId)
  );

  return {
    props: {
      concerts,
    },
  };
}
