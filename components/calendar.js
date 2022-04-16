import moment from "moment";
import Link from "next/link";
import { Button, Card, Col, Container, Row } from "react-bootstrap";

const Calendar = ({ concerts }) => {
  return (
    <Container className="mt-4">
      <h1>Artimiausi koncertai</h1>
      <Row xs={2} md={4} className="g-4">
        {concerts &&
          concerts.map((concert) => (
            <Col key={concert._id}>
              <Card>
                <Card.Img variant="top" src={concert.poster} />
                <Card.Body>
                  <Card.Title>{concert.title}</Card.Title>
                  <Card.Text>{moment(concert.date).calendar()}</Card.Text>
                  <Card.Text>{concert.collectiveTitle}</Card.Text>
                  <Link
                    passHref
                    href={`/collectives/${concert.collectiveId}/concerts/${concert._id}`}
                  >
                    <Button variant="primary">Peržiūrėti</Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          ))}
      </Row>
    </Container>
  );
};

export default Calendar;
