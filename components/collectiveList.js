import Link from "next/link";
import { useState } from "react";
import {
  Container,
  Image,
  Card,
  ListGroup,
  Button,
  Col,
  Row,
} from "react-bootstrap";

function ListOfCollectives({ owned, member }) {
  const [sortOwned, setSortOwned] = useState(false);
  const [sortMember, setSortMember] = useState(false);

  return (
    <Container>
      <Row>
        <Col xs={12} md={6}>
          <Card className="mb-2">
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                Savininkas
                <Button variant="dark" onClick={() => setSortOwned(!sortOwned)}>
                  {sortOwned ? "z-a" : "a-z"}
                </Button>
              </div>
            </Card.Header>
            <ListGroup variant="flush">
              {owned
                .sort((a, b) => {
                  if (a.title.toLowerCase() < b.title.toLowerCase())
                    return sortOwned ? -1 : 1;
                  if (a.title.toLowerCase() > b.title.toLowerCase())
                    return sortOwned ? 1 : -1;
                  return 0;
                })
                .map((collective) => (
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
        </Col>
        <Col>
          <Card>
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                Narys
                <Button
                  variant="dark"
                  onClick={() => setSortMember(!sortMember)}
                >
                  {sortMember ? "z-a" : "a-z"}
                </Button>
              </div>
            </Card.Header>
            <ListGroup variant="flush">
              {member
                .sort((a, b) => {
                  if (a.title.toLowerCase() < b.title.toLowerCase())
                    return sortMember ? -1 : 1;
                  if (a.title.toLowerCase() > b.title.toLowerCase())
                    return sortMember ? 1 : -1;
                  return 0;
                })
                .map((collective) => (
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
        </Col>
      </Row>
    </Container>
  );
}

export default ListOfCollectives;
