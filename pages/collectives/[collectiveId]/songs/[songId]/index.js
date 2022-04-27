import { getSession } from "next-auth/react";
import {
  Card,
  Container,
  Button,
  Collapse,
  Tabs,
  Tab,
  ListGroup,
} from "react-bootstrap";
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
import dynamic from "next/dynamic";

const PDFViewer = dynamic(
  () => import("../../../../../components/pdfs/pdfViewer"),
  {
    ssr: false,
  }
);

export default function SongDetails({ part, filteredInstruments, owner }) {
  const router = useRouter();
  const { songId, collectiveId } = router.query;
  const [openVideo, setOpenVideo] = useState(false);

  const baseUrl = `/collectives/${collectiveId}/songs`;

  const defaultNoteHeight = 1200;

  const otherParts = (
    <div className="mt-2">
      <h3>Kitos partijos</h3>
      <ListGroup>
        <Link passHref href={`${baseUrl}/${songId}?part=all`}>
          <ListGroup.Item action>Visos</ListGroup.Item>
        </Link>
        {filteredInstruments.map(
          (instrument, idx) =>
            instrument != part.instrument && (
              <Link
                passHref
                key={idx}
                href={`${baseUrl}/${songId}?part=${instrument}`}
              >
                <ListGroup.Item action>{instrument}</ListGroup.Item>
              </Link>
            )
        )}
      </ListGroup>
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
                  <Button className="mx-2">Redaguoti</Button>
                </Link>
              )}
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
              <Tabs id="tab" className="my-3" unmountOnExit={true}>
                {part.parts.map((item, idx) => (
                  <Tab
                    key={idx}
                    eventKey={idx}
                    title={item.filename ? item.filename : `Partija ${idx + 1}`}
                  >
                    <a href={`/api/pdf?partId=${item._id}`} target="`_blank`">
                      Atidaryti kitame lange
                    </a>
                    <PDFViewer
                      file={item.file}
                      partId={item._id}
                      defaultNoteHeight={defaultNoteHeight}
                    />
                  </Tab>
                ))}
              </Tabs>
            </Card.Body>
          </Card>
          {otherParts}
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
