import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { getSongs } from "../../../controllers/songController";
import { useRecoilValue } from "recoil";
import { instrumentState } from "../../../atoms";

function Collective({ songs }) {
  const { collectiveId } = useRouter().query;
  const instrument = useRecoilValue(instrumentState);

  return (
    <div>
      <h1>Kūriniai:</h1>
      <p>Instrumentas: {instrument}</p>
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
      <p>
        <Link href={`${collectiveId}/instruments`}>
          <a>Redaguoti instrumentus</a>
        </Link>
      </p>
      <p>
        <Link href={`${collectiveId}/instruments`}>
          <a>Sukurti pakvietimo nuorodą</a>
        </Link>
      </p>
    </div>
  );
}

export async function getServerSideProps(context) {
  const response = await getSongs(context.query.collectiveId);
  const songs = await JSON.parse(response);

  return {
    props: {
      songs: songs.collectiveSongs,
    },
  };
}

export default Collective;
