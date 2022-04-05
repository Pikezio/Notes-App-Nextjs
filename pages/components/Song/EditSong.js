import React, {useState} from 'react';
import axios from "axios";
import {server} from "../../../util/urlConfig";
import {useRouter} from "next/router";

function EditSong({song}) {
    const router = useRouter();
    const [newSongData, setNewSongData] = useState({
        title: song.title,
        composer: song.composer,
        arranger: song.arranger,
    });

    const songId = song._id;
    const showSaveButton =
        newSongData.title !== song.title || newSongData.composer !== song.composer || newSongData.arranger !== song.arranger;

    const submitEdit = async () => {
        // Construct the payload for updating the specific elements
        let payload = {};
        if (newSongData.title !== song.title) {
            payload = {
                ...payload,
                title: newSongData.title,
            };
        }

        if (newSongData.composer !== song.composer) {
            payload = {
                ...payload,
                composer: newSongData.composer,
            };
        }

        if (newSongData.arranger !== song.arranger) {
            payload = {
                ...payload,
                arranger: newSongData.arranger,
            };
        }

        axios
            .patch(`${server}/api/songs/${songId}/`, payload)
            .then(() => router.replace(router.asPath))
            .catch((err) => console.log(err));
    };

    const confirmDelete = () => {
        if (confirm(`Ar tikrai norite ištrinti kūrinį "${song.title}"?`)) {
            axios
                .delete(`${server}/api/songs/${songId}/`)
                .then(() => router.replace("/"))
                .catch((err) => console.log(err));
        }
    };

    return (
        <form>
            <label htmlFor="title">Pavadinimas</label>
            <input type="text" name="title" value={newSongData.title}
                   onChange={(e) => setNewSongData({...newSongData, title: e.target.value})}/>

            <label htmlFor="composer">Kompozitorius</label>
            <input type="text" name="composer" value={newSongData.composer}
                   onChange={(e) => setNewSongData({...newSongData, composer: e.target.value})}/>

            <label htmlFor="arranger">Aranžuotojas</label>
            <input type="text" name="arranger" value={newSongData.arranger}
                   onChange={(e) => setNewSongData({...newSongData, arranger: e.target.value})}/>

            <button disabled={!showSaveButton} onClick={submitEdit} type="button">Išsaugoti</button>
            <button onClick={confirmDelete} type="button">Ištrinti</button>
        </form>
    );
}

export default EditSong;