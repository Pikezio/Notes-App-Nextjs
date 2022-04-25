import React from "react";
import PerformanceView from "../../../../../components/performanceView";
import { getConcertById } from "../../../../../controllers/concertController";
import { getUniquePartInstruments } from "../../../../../controllers/partController";
import { checkSession } from "../../../../../middleware/checkSession";

const Performance = ({ concert, instruments }) => {
  return (
    <div>
      <PerformanceView concert={concert} parts={instruments} />;
    </div>
  );
};

export default Performance;

export async function getServerSideProps(context) {
  const hasSession = await checkSession(context);
  if (hasSession != null) return hasSession;

  const { concertId, collectiveId } = context.query;
  const concert = JSON.parse(await getConcertById(concertId));

  const withInstruments = await Promise.all(
    concert.songs.map(async (song) => ({
      ...song,
      instruments: await getUniquePartInstruments(song._id),
    }))
  );

  return {
    props: {
      concert: { ...concert, songs: withInstruments },
    },
  };
}
