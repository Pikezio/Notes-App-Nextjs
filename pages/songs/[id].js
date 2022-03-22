import { server } from "../../util/urlConfig";
import React, { useEffect, useRef } from "react";

export default function SongDetails({ song }) {
  const parts = song.parts.map((p, idx) => (
    <embed key={idx} src={p.file} width="80%" height="auto" />
  ));

  return parts;
}

export async function getServerSideProps(context) {
  const data = await fetch(`${server}/api/songs/${context.query.id}`);
  const song = await data.json();
  return {
    props: {
      song,
    },
  };
}
