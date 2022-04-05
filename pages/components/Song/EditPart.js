import React, {useState} from 'react';
import {toBase64} from "../../../util/toBase64";
import axios from "axios";
import {server} from "../../../util/urlConfig";
import {useRouter} from "next/router";
import Link from "next/link";

function EditPart({optionList, part, songId}) {
    const [newPartData, setNewPartData] = useState({
        instrument: part.instrument, file: null
    })

    const showSaveButton = newPartData.instrument !== part.instrument || newPartData.file !== null

    const router = useRouter()

    function deletePart(partId) {
        if (confirm(`Ar tikrai norite ištrinti šią partiją?`)) {
            axios
                .delete(`${server}/api/songs/${songId}/part?partId=${partId}`)
                .then(() => {
                    router.replace(router.asPath)
                })
                .catch((err) => console.log(err));
        }
    }

    async function changePartFile(file) {
        const stringFile = await toBase64(file);
        setNewPartData({...newPartData, file: stringFile})
    }

    function submitChanges(partId) {
        axios
            .patch(`${server}/api/songs/${songId}/part?partId=${partId}`, newPartData)
            .then(() => {
                console.log("DONE")
                router.replace(router.asPath)
            })
            .catch((err) => console.log(err));
    }

    return (<div>
            <Link href={`/songs/${songId}?part=${part.instrument}`}>Peržiūrėti</Link>
            <select value={newPartData.instrument}
                    onChange={(e) => setNewPartData({...newPartData, instrument: e.target.value})}>
                {optionList}
            </select>
            <>{part.filename}</>
            <input type="file" onChange={(e) => changePartFile(e.target.files[0])}/>
            <button disabled={!showSaveButton} onClick={() => submitChanges(part._id)}>Išsaugoti</button>
            <button onClick={() => deletePart(part._id)}>Ištrinti partiją</button>
        </div>);
}

export default EditPart;