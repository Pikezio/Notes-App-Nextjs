import { useRouter } from "next/router";
import Link from "next/link";
import {
  getCollectiveOwner,
  getCollectiveMembers,
} from "../../../controllers/collectiveController";
import { useRecoilValue } from "recoil";
import { instrumentState } from "../../../atoms";
import { getSession } from "next-auth/react";
import { getSongs } from "../../../controllers/songController";
import axios from "axios";
import { server } from "../../../util/urlConfig";

function Collective({ songs, owner, requestedUsers }) {
  const { collectiveId } = useRouter().query;
  const instrument = useRecoilValue(instrumentState);

  const acceptUser = (userId) => {
    axios.post(`${server}/api/collectives/${collectiveId}/user`, {
      action: "accept",
      userId,
      collectiveId,
    });
  };

  const declineUser = (userId) => {
    axios.post(`${server}/api/collectives/${collectiveId}/user`, {
      action: "decline",
      userId,
      collectiveId,
    });
  };

  return (
    <div>
      <h1>Kūriniai:</h1>
      <h1>Savininkas: {owner ? "Taip" : "Ne"}</h1>
      <p>Instrumentas: {instrument}</p>

      <ul>
        {songs &&
          songs.map((s) => (
            <li key={s._id}>
              <Link href={`/songs/${s._id}?part=${instrument}`}>
                <a>{s.title}</a>
              </Link>
            </li>
          ))}
      </ul>

      {owner && (
        <>
          <Link href={`${collectiveId}/songs/create`}>
            <a>Pridėti kūrinį</a>
          </Link>
          <p>
            <Link href={`${collectiveId}/instruments`}>
              <a>Redaguoti instrumentus</a>
            </Link>
          </p>

          <h1>Kolektyvo nariai</h1>
          {requestedUsers &&
            requestedUsers.map((user) => (
              <li key={user._id}>
                {user.name} <strong>{user.status}</strong>
                <button onClick={() => acceptUser(user.userId)}>Accept</button>
                <button onClick={() => declineUser(user.userId)}>
                  Decline
                </button>
              </li>
            ))}
        </>
      )}
    </div>
  );
}

export async function getServerSideProps(context) {
  const collectiveId = context.query.collectiveId;
  const response = await getSongs(collectiveId);
  const songs = await JSON.parse(response);

  const collectiveOwner = await getCollectiveOwner(collectiveId);
  const session = await getSession(context);

  let owner = false;
  if (session.userId === collectiveOwner) owner = true;

  let requestedUsers = null;
  if (owner) {
    const data = await getCollectiveMembers(collectiveId);
    requestedUsers = await JSON.parse(data).members;
  }

  return {
    props: {
      songs: songs.collectiveSongs,
      owner,
      requestedUsers: requestedUsers,
    },
  };
}

export default Collective;
