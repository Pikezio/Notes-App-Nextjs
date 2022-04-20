import moment from "moment";
import { getSession } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";
import {
  Container,
  ListGroup,
  Badge,
  Form,
  Row,
  Col,
  Button,
} from "react-bootstrap";
import { getUserCollectiveIds } from "../../controllers/collectiveController";
import { getAllConcerts } from "../../controllers/concertController";
import { checkSession } from "../../middleware/checkSession";

import lt from "date-fns/locale/lt";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const ConcertPage = ({ concerts, userCollectives }) => {
  const initialState = {};
  userCollectives.map((collective) => (initialState[collective._id] = true));

  const [checkedCollectives, setCheckedCollectives] = useState(initialState);

  // Date selection
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleDateSelect = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setCheckedCollectives({
      ...checkedCollectives,
      [name]: checked,
    });
  };

  const findCollectiveColor = (collectiveId) => {
    const collective = userCollectives.find(
      (collective) => collective._id === collectiveId
    );
    return collective.color;
  };

  // Filter concerts by date
  const filteredConcerts = concerts.filter((concert) => {
    if (startDate && endDate) {
      return (
        moment(concert.date).isSameOrAfter(startDate) &&
        moment(concert.date).isSameOrBefore(endDate)
      );
    } else {
      return true;
    }
  });

  // group concerts by upcoming and past
  const upcomingConcerts = filteredConcerts.filter(
    (concert) => new Date(concert.date) > new Date()
  );
  const pastConcerts = filteredConcerts.filter(
    (concert) => new Date(concert.date) < new Date()
  );

  // filter concerts by collective and date
  const filteredUpcomingConcerts = upcomingConcerts.filter(
    (concert) => checkedCollectives[concert.collectiveId]
  );
  const filteredPastConcerts = pastConcerts.filter(
    (concert) => checkedCollectives[concert.collectiveId]
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
              <Badge
                pill
                bg="secondary"
                style={{
                  backgroundColor: findCollectiveColor(concert.collectiveId),
                }}
              >
                {concert.collectiveTitle}
              </Badge>
            </div>
            <div className="lead">{moment(concert.date).format("LLLL")}</div>
          </div>
        </Link>
      </ListGroup.Item>
    ));
  };

  const mark = ["04-03-2020", "03-03-2020", "05-03-2020"];

  return (
    <Container>
      <h1>Koncertai</h1>
      <Row>
        <Col className="border rounded mx-1">
          <h2>Filtruoti pagal kolektyvą</h2>
          {userCollectives.map((collective) => (
            <Form.Check
              key={collective._id}
              type="checkbox"
              name={collective._id}
              onChange={(e) => handleCheckboxChange(e)}
              label={collective.title}
              defaultChecked={true}
            ></Form.Check>
          ))}
        </Col>
        <Col className="border rounded mx-1">
          <h2>Filtruoti pagal datą</h2>
          <Calendar
            onChange={handleDateSelect}
            selectRange={true}
            value={[startDate, endDate]}
            locale="lt-LT"
          />
          <Button
            className="my-2"
            onClick={() => {
              setStartDate(null);
              setEndDate(null);
            }}
          >
            Išvalyti filtrą
          </Button>
        </Col>
      </Row>
      <ListGroup>
        <h3>Artimiausi</h3>
        {constructList(filteredUpcomingConcerts)}
        <h3 className="mt-2">Praėję</h3>
        {constructList(filteredPastConcerts)}
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
      userCollectives,
    },
  };
}
