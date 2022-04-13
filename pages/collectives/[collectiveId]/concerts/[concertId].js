import Image from "next/image";
import React from "react";
import { Container } from "react-bootstrap";
import { getConcertById } from "../../../../controllers/concertController";

const ConcertDetails = ({ concert }) => {
  return (
    <Container>
      <h1>Koncertas:{concert.title}</h1>
      <h1>Data: {concert.date}</h1>
      {concert.poster && (
        <Image alt="poster" src={concert.poster} width={250} height={125} />
      )}
      <h1>Song ids:</h1>
      {concert.songs && concert.songs.map((song) => <p>{song}</p>)}
    </Container>
  );
};

export default ConcertDetails;

export async function getServerSideProps(context) {
  const concert = JSON.parse(await getConcertById(context.query.concertId));

  return {
    props: {
      concert,
    },
  };
}
