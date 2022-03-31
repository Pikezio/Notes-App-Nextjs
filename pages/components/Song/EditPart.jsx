import React, {useState} from 'react';
import {toBase64} from "../../../util/toBase64";

function EditPart({optionList, part}) {
    const [newPartData, setNewPartData] = useState({
        instrument: part.instrument,
        file: null
    })

    const showSaveButton =
        newPartData.instrument !== part.instrument || newPartData.file !== null


    function deletePart(partId) {
        if (confirm(`Ar tikrai norite pakeisti šį partijos failą?`)) {

            // axios
            //     .delete(`${server}/api/songs/${songId}/`)
            //     .then(router.replace("/"))
            //     .catch((err) => console.log(err));
        }
    }

    async function changePartFile(file) {
        const stringFile = await toBase64(file);
        setNewPartData({...newPartData, file: stringFile})
    }

    function submitChanges(partId) {
        
    }

    // TODO: preview file somehow
    return (
        <div>
            <select value={newPartData.instrument}
                    onChange={(e) => setNewPartData({...newPartData, instrument: e.target.value})}>
                {optionList}
            </select>
            <input type="file" onChange={(e) => changePartFile(e.target.files[0])}/>
            <button disabled={!showSaveButton} onClick={() => submitChanges(part._id)}>Išsaugoti</button>
            <button onClick={() => deletePart(part._id)}>Ištrinti partiją</button>
        </div>
    );
}

export default EditPart;