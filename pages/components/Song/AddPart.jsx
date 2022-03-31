import React, {useRef, useState} from 'react';
import {server} from "../../../util/urlConfig";
import axios from "axios";
import {useRouter} from "next/router";
import {toBase64} from "../../../util/toBase64";

function AddPart({optionList, songId}) {
    const fileRef = useRef();
    const [formData, setFormData] = useState({
        instrument: "---",
        file: ""
    });
    const router = useRouter()

    async function submitPart() {
        const fileString = await toBase64(formData.file);
        const payload = {
            instrument: formData.instrument,
            file: fileString
        }
        axios.post(`${server}/api/songs/${songId}/part`, payload)
            .then(() => {
                    setFormData({
                        instrument: "---",
                        file: ""
                    })
                    fileRef.current.value = null;
                    router.replace(router.asPath)
                }
            )
            .catch(err => console.log(err))
    }

    return (
        <div>
            <h1>Pridėti partiją</h1>
            <input type="file"
                   onChange={(e) =>
                       setFormData({...formData, file: e.target.files[0]})
                   } ref={fileRef}/>
            <select value={formData.instrument}
                    onChange={(e) => setFormData({...formData, instrument: e.target.value})}>
                {optionList}
            </select>
            <button disabled={formData.file === ""} onClick={submitPart}>Pridėti</button>
        </div>
    );
}

export default AddPart;