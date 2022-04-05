import React, { useEffect, useState } from "react";
import {useRecoilState} from "recoil";
import axios from "axios";
import { useRouter } from "next/router";
import {instrumentState} from "../../../atoms";
import {server} from "../../../util/urlConfig";

export default function SongDetails() {
    const router = useRouter();
    const { songId, part } = router.query;
    const [song, setSong] = useState(null);

    useEffect(() => {
        const getPart = async () => {
            if (router.isReady) {
                const response = await axios.get(
                    `${server}/api/songs/${songId}?part=${part}`
                );
                setSong(response.data);
            }
        };
        getPart();
    }, [part, songId, router.isReady]);

    // TODO: make a loading bar
    return (
        <div>
            {song ? (
                <div>
                    <h1>{song.title}</h1>
                    <h2>{song.composer}</h2>
                    <h2>{song.arranger}</h2>
                    <embed src={song.parts[0].file} width="80%" height="auto" />
                </div>
            ) : (
                <h1>Nėra tokios partijos...</h1>
            )}
        </div>
    );
}

SongDetails.auth = true;
