import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { server } from "../../../util/urlConfig";

function Collective({ songs }) {
  const { collectiveId } = useRouter().query;

  return (
    <div>
      <h1>Kūriniai:</h1>
      <ul>
        {songs &&
          songs.map((s) => (
            <li key={s._id}>
              <Link href={`/songs/${s._id}`}>
                <a>{s.title}</a>
              </Link>
            </li>
          ))}
      </ul>
      <Link href={`${collectiveId}/songs/create`}>
        <a>Pridėti kūrinį</a>
      </Link>
    </div>
  );
}

export async function getServerSideProps(context) {
  //const session = await getSession(context);
  //const data = await fetch(`${server}/api/users/${session.userId}/collectives`);
  const data = await fetch(
    `${server}/api/collectives/${context.query.collectiveId}/songs`
  );
  const songs = await data.json();

  return {
    props: {
      songs: songs.collectiveSongs,
    },
  };
}

export default Collective;
