import { getSession } from "next-auth/react";
import { Card, Container, Button, Collapse, Tabs, Tab } from "react-bootstrap";
import {
  doesPartExistForInstrument,
  getSpecificPart,
} from "../../../../../controllers/partController";
import { getInstruments } from "../../../../../controllers/instrumentController";
import Link from "next/link";
import { useRouter } from "next/router";
import YoutubePlayer from "../../../../../components/youtubePlayer";
import { isOwner } from "../../../../../middleware/isUserCollectiveOwner";
import { useState } from "react";
import { checkSession } from "../../../../../middleware/checkSession";

export default function SongDetails({ part, filteredInstruments, owner }) {
  const router = useRouter();
  const { songId, collectiveId } = router.query;
  const [openVideo, setOpenVideo] = useState(false);
  const baseUrl = `/collectives/${collectiveId}/songs`;

  const otherParts = (
    <div>
      Kitos partijos
      <li>
        <Link href={`${baseUrl}/${songId}?part=all`}>Visos</Link>
      </li>
      {filteredInstruments.map(
        (instrument, idx) =>
          instrument != part.instrument && (
            <li key={idx}>
              <Link href={`${baseUrl}/${songId}?part=${instrument}`}>
                {instrument}
              </Link>
            </li>
          )
      )}
    </div>
  );

  return (
    <Container>
      {part ? (
        <>
          <Card className="text-center">
            <Card.Header>
              {part.instrument ? part.instrument : "Visos partijos"}
            </Card.Header>
            <Card.Body>
              <Card.Title>{part.title}</Card.Title>
              <Card.Text>
                Kompozicija {part.composer} | Aranžuotė {part.arranger}
              </Card.Text>
              {owner && (
                <Link
                  passHref
                  href={`/collectives/${collectiveId}/songs/${songId}/edit`}
                >
                  <Button>Redaguoti</Button>
                </Link>
              )}
              <Tabs id="tab" className="my-3">
                {part.parts.map((item, idx) => (
                  <Tab
                    key={idx}
                    eventKey={idx}
                    title={item.filename ? item.filename : `Partija ${idx + 1}`}
                  >
                    <div className="embed-responsive ">
                      <embed
                        className="embed-responsive-item"
                        src={item.file}
                        width="100%"
                        height="800"
                      />
                    </div>
                  </Tab>
                ))}
              </Tabs>
            </Card.Body>
          </Card>
          {otherParts}
          {console.log(part)}
          {part.video && (
            <>
              <Button
                onClick={() => setOpenVideo(!openVideo)}
                aria-controls="collapse-video"
                aria-expanded={openVideo}
              >
                {openVideo ? "Nerodyti video" : "Rodyti video"}
              </Button>
              <Collapse in={openVideo}>
                <div id="collapse-video">
                  <YoutubePlayer videoUrl={part.video} />
                </div>
              </Collapse>
            </>
          )}
        </>
      ) : (
        <>
          <h1>Nėra tokios partijos...</h1>
          {otherParts}
        </>
      )}
    </Container>
  );
}

SongDetails.auth = true;

export async function getServerSideProps(context) {
  const hasSession = await checkSession(context);
  if (hasSession != null) return hasSession;

  const { songId, part: partQuery, collectiveId } = context.query;
  const part = JSON.parse(await getSpecificPart(songId, partQuery));

  const session = await getSession(context);
  const owner = await isOwner(collectiveId, session.userId);

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
      filteredInstruments,
      part,
      owner,
    },
  };
}
