import React, {useState} from 'react';
import axios from "axios";
import {useRouter} from "next/router";
import {toBase64} from "../../../util/toBase64";
import FileUpload from "../files/FileUpload";

function AddPart({optionList, instrumentList, songId}) {
    const [parts, setParts] = useState([]);
    const router = useRouter()

    async function submitForm() {
        const base64parts = await Promise.all(
            parts.map(async (item) => {
                const base64 = await toBase64(item.file);
                item.file = base64;
                return item;
            })
        );
        axios.post(`/api/songs/${songId}/part`, base64parts)
            .then(() => {
                    setParts([]);
                    router.push(router.asPath);
                }
            )
            .catch(err => console.log(err))
    }

    // Updates state, when files change
    function handleFileChange(e) {
        let newState = Array.from(e.target.files).map((file) => {
            return {
                file: file,
                filename: file.name,
                instrument: "undefined",
            };
        });
        setParts(newState);
    }

    function handleDropDownChange(e, partId) {
        const selectedInstrument = e.target.value;
        let newParts = [...parts];
        newParts[partId].instrument = selectedInstrument;
        setParts(newParts);
    }

    return (
        <div>
            <FileUpload handleFileChange={handleFileChange}
                        handleDropDownChange={handleDropDownChange}
                        parts={parts}
                        instrumentList={instrumentList}/>
            <button disabled={parts.length === 0} onClick={submitForm}>Pridėti</button>
        </div>
    );
}

export default AddPart;