import React, {useEffect, useState} from 'react';
import axios from "axios";

function Search() {
    const [input, setInput] = useState("")
    const [songs, setSongs] = useState([])

    useEffect(() => {
        if (input !== "" && input.length > 3) {
            axios.get(`/api/songs?search=${input}`)
                .then(res => setSongs(res.data))
                .catch(err => console.log(err))
        } else setSongs([])
    }, [input])

    return (
        <div>
            <input type="text" placeholder="Paieška"
                   onChange={(e) => setInput(e.target.value)}
                   value={input}/>

            {/*List of found songs*/}
            <div>
                {songs && songs.map(collective =>
                    collective.map((s, index) =>
                        index === 0 ?
                            <div key={index}><strong>{s}</strong></div> :
                            <li key={s._id}>{s.title}</li>
                    )
                )}
            </div>
        </div>
    );
}

export default Search;