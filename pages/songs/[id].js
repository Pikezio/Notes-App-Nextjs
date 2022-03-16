import { server } from "../../util/urlConfig";
import React, { useEffect, useRef } from "react";

export default function SongDetails({ song }) {
  return <embed src={song.parts[0].file} width="100%" height="2000px" />;
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
