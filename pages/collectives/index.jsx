import React from "react";
import Link from "next/link";
import { getSession } from "next-auth/react";
import { getCollectives } from "../../controllers/collectiveController";

function ListOfCollectives({ owned, member }) {
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
  const response = await getCollectives(session.userId);
  const data = JSON.parse(response).data;

  return {
    props: {
      owned: data.owned,
      member: data.member,
    },
  };
}

export default ListOfCollectives;
