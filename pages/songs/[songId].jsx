import { server } from "../../util/urlConfig";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { instrumentState } from "../../atoms";
import axios from "axios";
import { useRouter } from "next/router";

export default function SongDetails() {
  const router = useRouter();
  const { songId } = router.query;
  const instrument = useRecoilValue(instrumentState);
  const [part, setPart] = useState(null);

  useEffect(() => {
    const getPart = async () => {
      if (router.isReady) {
        const response = await axios.get(
          `${server}/api/songs/${songId}?part=${instrument}`
        );
        setPart(response.data);
      }
    };
    getPart();
  }, [instrument, songId, router.isReady]);

  return (
    <div>
      {part ? (
        <div>
          <h1>{part.title}</h1>
          <h2>{part.composer}</h2>
          <h2>{part.arranger}</h2>
          <embed src={part.parts[0].file} width="80%" height="auto" />
        </div>
      ) : (
        <h1>Nėra tokios partijos...</h1>
      )}
    </div>
  );
}

SongDetails.auth = true;
