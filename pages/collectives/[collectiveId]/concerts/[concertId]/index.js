import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { Container } from "react-bootstrap";
import { getConcertById } from "../../../../../controllers/concertController";

const ConcertDetails = ({ concert }) => {
  const router = useRouter();
  const { collectiveId } = router.query;
  return (
    <Container>
      <h1>Koncertas:{concert.title}</h1>
      <h1>Data: {concert.date}</h1>
      {concert.poster && (
        <Image alt="poster" src={concert.poster} width={250} height={125} />
      )}
      <h1>Song ids:</h1>
      {concert.songs &&
        concert.songs.map((song) => (
          <Link
            key={song._id}
            passHref
            href={`/collectives/${collectiveId}/songs/${song._id}`}
          >
            <p>{song.title}</p>
          </Link>
        ))}
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
