import Link from "next/link";
import { Container, Image, Card, ListGroup } from "react-bootstrap";

function ListOfCollectives({ owned, member }) {
  return (
    <Container>
      <Card>
        <Card.Header>Savininkas</Card.Header>
        <ListGroup variant="flush">
          {owned.map((collective) => (
            <Link
              passHref
              key={collective._id}
              href={`/collectives/${collective._id}`}
            >
              <ListGroup.Item
                role="button"
                className="d-flex align-items-center justify-content-between"
              >
                <div className="lead">{collective.title}</div>
                <Image
                  alt="logo"
                  width={30}
                  height={30}
                  src={collective.logo}
                  rounded
                />
              </ListGroup.Item>
            </Link>
          ))}
        </ListGroup>
      </Card>

      <Card className="mt-3">
        <Card.Header>Narys</Card.Header>
        <ListGroup variant="flush">
          {member.map((collective) => (
            <Link
              key={collective._id}
              passHref
              href={`/collectives/${collective._id}`}
            >
              <ListGroup.Item
                role="button"
                className="d-flex align-items-center justify-content-between"
              >
                <div className="lead">{collective.title}</div>
                {collective.logo && (
                  <Image
                    alt="logo"
                    width={30}
                    height={30}
                    src={collective.logo}
                    rounded
                  />
                )}
              </ListGroup.Item>
            </Link>
          ))}
        </ListGroup>
      </Card>
    </Container>
  );
}

export default ListOfCollectives;
