import {useRouter} from "next/router";
import Link from "next/link";
import {
    getCollectiveOwner, getCollectiveMembers, getCollective,
} from "../../../controllers/collectiveController";
import {useRecoilState} from "recoil";
import {getSession} from "next-auth/react";
import {getSongs} from "../../../controllers/songController";
import axios from "axios";
import {isMember} from "../../../middleware/isUserCollectiveMember";
import {server} from "../../../util/urlConfig";
import {instrumentState} from "../../../atoms";
import {useEffect, useState} from "react";

function Collective({data, collective}) {
    const router = useRouter();
    const {collectiveId} = router.query;
    const [songs, setSongs] = useState([]);
    const [selectedInstrument, setSelectedInstrument] =
        useRecoilState(instrumentState);

    // Refetch when instrument changes
    useEffect(() => {
        axios.get(`/api/collectives/${collectiveId}/songs/${selectedInstrument}`).then(
            res => setSongs(res.data)
        ).catch(err => console.log(err))
    }, [selectedInstrument])

    // Get instrument from local storage
    useEffect(() => {
        const getSavedInstrument = async () => {
            if (router.isReady && collectiveId) {
                setSelectedInstrument(localStorage.getItem(collectiveId));
            }
        };
        getSavedInstrument();
    }, [router.isReady, collectiveId, setSelectedInstrument]);

    const modifyUser = async (_id, action) => {
        await axios.post(`${server}/api/collectives/${collectiveId}/user`, {
            _id, action: action, collectiveId,
        });
        router.replace(router.asPath);
    };

    const onInstrumentChange = (e) => {
        setSelectedInstrument(e.target.value);
        localStorage.setItem(collectiveId, e.target.value);
    };

    if (data.member || data.owner) {
        return (<div>
            <h1>Pavadinimas: {collective.title}</h1>
            <embed src={collective.logo} width="50px"/>
            <h3>Savininkas: {data.owner ? "Taip" : "Ne"}</h3>
            <p>Instrumentas:
                <select
                    name="part"
                    id="part"
                    onChange={onInstrumentChange}
                    value={
                        selectedInstrument ? selectedInstrument : "Nepasirinktas"
                    }
                >
                    {collective.instruments &&
                        collective.instruments.map((i, idx) => (
                            <option key={idx} value={i}>
                                {i}
                            </option>
                        ))}
                </select>
            </p>
            <h2>Kūriniai:</h2>
            <ul>
                {songs && songs.map((s) => (<div key={s._id}>
                    <li>
                        <Link href={`/songs/${s._id}?part=${selectedInstrument}`}>
                            <a>{s.title}</a>
                        </Link>
                    </li>
                    {data.owner && <Link href={`/songs/${s._id}/edit`}> Redaguoti</Link>}
                </div>))}
            </ul>

            {data.owner && (<>
                <Link href={`${collectiveId}/songs/create`}>
                    <a>Pridėti kūrinį</a>
                </Link>
                <p>
                    <Link href={`${collectiveId}/instruments`}>
                        <a>Redaguoti instrumentus</a>
                    </Link>
                </p>
                <p>
                    <Link href={`${collectiveId}/edit`}>
                        <a>Redaguoti kolektyvą</a>
                    </Link>
                </p>

                <h3>Kolektyvo nariai</h3>
                {data.requestedUsers && data.requestedUsers.map((user) => (<li key={user._id}>
                    {user._id}
                    {user.name} <strong>{user.status}</strong>
                    {user.status === "Requested" && (<>
                        <button onClick={() => modifyUser(user._id, "accept")}>
                            Accept
                        </button>
                        <button onClick={() => modifyUser(user._id, "decline")}>
                            Decline
                        </button>
                    </>)}
                </li>))}
            </>)}
        </div>);
    } else {
        return <h1>No access.</h1>;
    }
}

export async function getServerSideProps(context) {
    let owner = false;
    let member = false;
    let data = {};
    const session = await getSession(context);
    if (!session) {
        return {
            redirect: {
                destination: "/", permanent: false,
            },
        };
    }

    const {collectiveId} = context.query;
    const collectiveOwner = await getCollectiveOwner(collectiveId);

    if (session.userId === collectiveOwner) owner = true;

    if (!owner) {
        member = await isMember(collectiveId, session.userId);
    }

    if (owner) {
        const songs = JSON.parse(await getSongs(collectiveId));
        const requestedUsers = await JSON.parse(await getCollectiveMembers(collectiveId)).members;
        data = {
            owner: true, member: false, songs, requestedUsers,
        };
    }

    // TODO: owner view for seeing all songs, probably lazy loading
    if (!owner && member) {
        const songs = JSON.parse(await getSongs(collectiveId));

        data = {
            owner: false, member: true, songs,
        };
    }

    const collective = JSON.parse(await getCollective(collectiveId))

    return {
        props: {
            data,
            collective
        },
    };
}

export default Collective;
