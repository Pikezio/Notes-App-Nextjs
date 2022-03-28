import { getSession } from "next-auth/react";
import { getCollectives } from "../controllers/collectiveController";
import ListOfCollectives from "./components/ListOfCollectives";

export default function Home({ owned, member }) {
  return (
    <>
      <h1>Calendar</h1>
      <li>Concert 1 2023-01-14</li>
      <li>Concert 1 2023-01-14</li>
      <p>calendar box with dates marked</p>

      <ListOfCollectives owned={owned} member={member} />
    </>
  );
}

export async function getServerSideProps(context) {
  // Check session and redirect if not logged in.
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/nextauth/login",
        permanent: false,
      },
    };
  }

  const response = await getCollectives(session.userId);
  const data = JSON.parse(response).data;

  return {
    props: {
      owned: data.owned,
      member: data.member,
    },
  };
}
