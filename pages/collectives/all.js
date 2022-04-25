import axios from "axios";
import { getSession } from "next-auth/react";
import { getAllCollectives } from "../../controllers/collectiveController";
import { server } from "../../util/urlConfig";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Badge, Button, Container, ListGroup } from "react-bootstrap";

function ListOfAllCollectives({ collectives }) {
  console.log(collectives);
  const router = useRouter();
  const { data: session, status } = useSession();
  const submitJoin = async (collectiveId) => {
    await axios.post(`${server}/api/collectives/${collectiveId}/join`, {
      userId: session.userId,
      name: session.user.name,
    });
    router.replace(router.asPath);
  };

  return (
    <Container>
      <h1>Visi kolektyvai</h1>
      <h3>Prisijungta</h3>
      <ListGroup className="mb-2">
        {collectives.joinedCollectives.map((collective) => (
          <ListGroup.Item key={collective._id}>
            <div className="d-flex justify-content-between">
              {collective.title}
              <Badge>
                {collective.members[0].status === "Requested" &&
                  "Išsiųstas prašymas"}
              </Badge>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
      <h3>Neprisijungta</h3>
      <ListGroup>
        {collectives.unjoinedCollectives.map((collective) => (
          <ListGroup.Item key={collective._id}>
            <div className="d-flex justify-content-between">
              {collective.title}
              <Button onClick={() => submitJoin(collective._id)}>
                Prisijungti
              </Button>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
}

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

  const response = await getAllCollectives(session.userId);
  const data = JSON.parse(response);

  return {
    props: {
      collectives: data,
    },
  };
}

export default ListOfAllCollectives;
