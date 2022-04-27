import { getSession } from "next-auth/react";
import { getCollectives } from "../controllers/collectiveController";
import ListOfCollectives from "../components/collectiveList";
import Calendar from "../components/calendar";
import { getCollectiveConcerts } from "../controllers/concertController";
import { checkSession } from "../middleware/checkSession";

export default function Home({ owned, member, concerts }) {
  return (
    <>
      <ListOfCollectives owned={owned} member={member} />
      <Calendar concerts={concerts} />
    </>
  );
}

export async function getServerSideProps(context) {
  // Check session and redirect if not logged in.
  const hasSession = await checkSession(context);
  if (hasSession != null) return hasSession;

  const session = await getSession(context);

  const response = await getCollectives(session.userId);
  const data = JSON.parse(response).data;

  // Merge collective arrays into one
  const merged = [...data.owned, ...data.member];

  // Get concerts for all user collectives
  // Merge collective ids to one list
  const all = merged.map((collective) => {
    return collective._id;
  });

  // Request concert for all collectives
  const concerts = JSON.parse(await getCollectiveConcerts(all, 4));

  const concertsWithCollectives = concerts.map((concert) => {
    const collective = merged.find((collective) => {
      return collective._id === concert.collectiveId;
    });
    concert.collectiveTitle = collective.title;
    concert.collectiveId = collective._id;
    return concert;
  });

  return {
    props: {
      owned: data.owned,
      member: data.member,
      concerts: concertsWithCollectives,
    },
  };
}
