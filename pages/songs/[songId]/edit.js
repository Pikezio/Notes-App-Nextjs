import React from 'react';
import {getSession} from "next-auth/react";
import {getSong} from "../../../controllers/songController";
import {getInstruments} from "../../../controllers/instrumentController";
import EditSong from "../../components/Song/EditSong";
import EditPart from "../../components/Song/EditPart";
import AddPart from "../../components/Song/AddPart";

function Edit({song, instrumentList}) {

    const dashes = <option key={0} value="---">---</option>
    const list = instrumentList && instrumentList.map((instrument, idx) => (
        <option key={++idx} value={instrument}>{instrument}</option>))
    const optionList = [dashes, ...list];

    return (
        <div>
            <EditSong song={song}/>

            <h1>Partijos</h1>
            <ul>
                {song.parts && song.parts.map(part =>
                    <EditPart key={part._id} optionList={optionList} part={part} songId={song._id}/>
                )}
            </ul>
            <AddPart optionList={optionList}  instrumentList={instrumentList} songId={song._id}/>
        </div>
    );
}

export default Edit;

export async function getServerSideProps(context) {
    const session = await getSession(context);
    if (!session) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }
    const song = JSON.parse(await getSong(context.query.songId));
    const instrumentList = JSON.parse(await getInstruments(song.collectiveId));
    return {
        props: {
            song,
            instrumentList: instrumentList.instruments
        }
    }
}