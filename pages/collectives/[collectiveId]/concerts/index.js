import axios from "axios";
import moment from "moment";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { Button, Container, ListGroup, ListGroupItem } from "react-bootstrap";
import { getConcertsByCollectiveId } from "../../../../controllers/concertController";
import { checkSession } from "../../../../middleware/checkSession";
import { isOwner } from "../../../../middleware/isUserCollectiveOwner";

const Concerts = ({ concerts, owner }) => {
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
      <ListGroup>
        {concerts &&
          concerts.map((concert) => (
            <Link
              passHref
              key={concert._id}
              href={`/collectives/${collectiveId}/concerts/${concert._id}`}
            >
              <ListGroupItem
                className="d-flex justify-content-between align-items-center"
                action
              >
                <div>
                  {concert.title} {moment(concert.date).format("LLL")}
                </div>

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
            </Link>
          ))}
      </ListGroup>
      {owner && (
        <Link href={`/collectives/${collectiveId}/concerts/create`} passHref>
          <Button variant="dark" className="mt-2">
            Pridėti koncertą
          </Button>
        </Link>
      )}
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

  const session = await getSession(context);
  const owner = await isOwner(context.query.collectiveId, session.userId);

  return {
    props: {
      concerts,
      owner,
    },
  };
}
