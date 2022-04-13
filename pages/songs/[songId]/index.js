import { getSession } from "next-auth/react";
import { Card, Container, Button } from "react-bootstrap";
import {
  doesPartExistForInstrument,
  getSpecificPart,
} from "../../../controllers/partController";
import { getInstruments } from "../../../controllers/instrumentController";
import Link from "next/link";
import { useRouter } from "next/router";
import YoutubePlayer from "../../../components/youtubePlayer";
import { isOwner } from "../../../middleware/isUserCollectiveOwner";
import { getSongCollectiveId } from "../../../controllers/songController";

export default function SongDetails({ part, filteredInstruments, owner }) {
  const router = useRouter();
  const { songId } = router.query;

  return (
    <Container>
      {part ? (
        <>
          <Card className="text-center">
            <Card.Header>{part.instrument}</Card.Header>
            <Card.Body>
              <Card.Title>{part.title}</Card.Title>
              <Card.Text>
                Kompozicija {part.composer} | Aranžuotė {part.arranger}
              </Card.Text>
              {owner && (
                <Link passHref href={`/songs/${songId}/edit`}>
                  <Button>Redaguoti</Button>
                </Link>
              )}
            </Card.Body>
          </Card>
          <div className="embed-responsive ">
            <embed
              className="embed-responsive-item"
              src={part.file}
              width="100%"
              height="375"
            />
          </div>
          <div>
            Kitos partijos
            {filteredInstruments.map(
              (instrument, idx) =>
                instrument != part.instrument && (
                  <li key={idx}>
                    <Link href={`/songs/${songId}?part=${instrument}`}>
                      <a>{instrument}</a>
                    </Link>
                  </li>
                )
            )}
          </div>
          {part.video && <YoutubePlayer videoUrl={part.video} />}
        </>
      ) : (
        <>
          <h1>Nėra tokios partijos...</h1>
          <div>
            Kitos partijos
            {filteredInstruments.map((instrument, idx) => (
              <li key={idx}>
                <Link href={`/songs/${songId}?part=${instrument}`}>
                  <a>{instrument}</a>
                </Link>
              </li>
            ))}
          </div>
        </>
      )}
    </Container>
  );
}

SongDetails.auth = true;

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

  const { songId, part: partQuery } = context.query;
  const part = partQuery
    ? JSON.parse(await getSpecificPart(songId, partQuery))
    : null;

  if (part == null) {
    const song = await getSongCollectiveId(songId);
    const collectiveId = song.collectiveId;

    // Get all instruments for a collective
    const instruments = JSON.parse(await getInstruments(collectiveId));

    // Make an array of parts that exists for the instrument
    const doesExist = await Promise.all(
      instruments.map(async (i) => {
        return await doesPartExistForInstrument(songId, i);
      })
    );

    // Filter by that array
    const filteredInstruments = instruments.filter(
      (_v, index) => doesExist[index]
    );

    return {
      props: {
        part: null,
        filteredInstruments,
      },
    };
  }

  const owner = await isOwner(part.collectiveId, session.userId);

  // Get all instruments for a collective
  const instruments = JSON.parse(await getInstruments(part.collectiveId));

  // Make an array of parts that exists for the instrument
  const doesExist = await Promise.all(
    instruments.map(async (i) => {
      return await doesPartExistForInstrument(songId, i);
    })
  );

  // Filter by that array
  const filteredInstruments = instruments.filter(
    (_v, index) => doesExist[index]
  );

  return {
    props: {
      filteredInstruments,
      part,
      owner,
    },
  };
}
