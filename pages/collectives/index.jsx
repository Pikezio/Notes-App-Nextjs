import React from "react";
import { getSession } from "next-auth/react";
import { server } from "../../util/urlConfig";
import Link from "next/link";

function ListOfCollectives({ owned, member }) {
  console.log({ owned, member });
  return (
    <div>
      <div>
        <h1>Owned</h1>
        {owned.map((collective) => (
          <Link key={collective._id} href={`/collectives/${collective._id}`}>
            <a>
              <li>{collective.title}</li>
            </a>
          </Link>
        ))}
      </div>
      <div>
        <h1>Member</h1>
        {member.map((collective) => (
          <Link key={collective._id} href={`/collectives/${collective._id}`}>
            <a>
              <li>{collective.title}</li>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  const data = await fetch(`${server}/api/collectives`);
  const collectives = await data.json();

  return {
    props: {
      owned: collectives.owned,
      member: collectives.member,
    },
  };
}

export default ListOfCollectives;
