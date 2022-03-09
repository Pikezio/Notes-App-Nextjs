import React from "react";
import { getSession } from "next-auth/react";
import { server } from "../../util/urlConfig";
import Link from "next/link";

function ListOfCollectives({ data }) {
  const collectives = data.collectives;
  return (
    <div>
      {collectives.map((collective) => (
        <Link key={collective._id} href={`/collectives/${collective._id}`}>
          <a>
            <li>{collective.title}</li>
          </a>
        </Link>
      ))}
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  const data = await fetch(`${server}/api/users/${session.userId}/collectives`);
  const collectives = await data.json();

  return {
    props: {
      data: collectives,
    },
  };
}

export default ListOfCollectives;
