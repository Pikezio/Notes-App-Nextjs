import { server } from "../../util/urlConfig";
import React, { useEffect, useRef } from "react";
import { getSong } from "../../controllers/songController";

export default function SongDetails({ song }) {
  const parts = song.parts.map((p, idx) => (
    <embed key={idx} src={p.file} width="80%" height="auto" />
  ));

  return parts;
}

export async function getServerSideProps(context) {
  const response = await getSong(context.query.id);
  const song = JSON.parse(response);

  return {
    props: {
      song,
    },
  };
}
