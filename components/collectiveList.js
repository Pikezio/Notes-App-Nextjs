import Link from "next/link";
import { Container, Navbar, Image, Card, ListGroup } from "react-bootstrap";

function ListOfCollectives({ owned, member }) {
  return (
    <Container>
      <Card>
        <Card.Header>Savininkas</Card.Header>
        <ListGroup variant="flush">
          {owned.map((collective) => (
            <ListGroup.Item
              key={collective._id}
              className="d-flex align-items-center"
            >
              <Image
                alt="logo"
                width={30}
                height={30}
                src={collective.logo}
                rounded
              />
              <Link href={`/collectives/${collective._id}`}>
                {collective.title}
              </Link>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card>

      <Card className="mt-3">
        <Card.Header>Narys</Card.Header>
        <ListGroup variant="flush">
          {member.map((collective) => (
            <ListGroup.Item key={collective._id}>
              {collective.logo && (
                <Image
                  alt="logo"
                  width={30}
                  height={30}
                  src={collective.logo}
                  rounded
                />
              )}
              <Link href={`/collectives/${collective._id}`}>
                {collective.title}
              </Link>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card>
    </Container>
  );
}

export default ListOfCollectives;
