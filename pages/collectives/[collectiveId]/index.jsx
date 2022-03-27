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
import { isMember } from "../../../middleware/isUserCollectiveMember";

function Collective({ data }) {
  const router = useRouter();
  const { collectiveId } = router.query;
  const instrument = useRecoilValue(instrumentState);

  const acceptUser = async (_id) => {
    await axios.post(`${server}/api/collectives/${collectiveId}/user`, {
      _id,
      action: "accept",
      collectiveId,
    });
    router.replace(router.asPath);
  };

  const declineUser = async (_id) => {
    await axios.post(`${server}/api/collectives/${collectiveId}/user`, {
      _id,
      action: "decline",
      collectiveId,
    });
    router.replace(router.asPath);
  };

  if (data.member || data.owner) {
    return (
      <div>
        <h1>Kūriniai:</h1>
        <h1>Savininkas: {data.owner ? "Taip" : "Ne"}</h1>
        <p>Instrumentas: {instrument}</p>

        <ul>
          {data.songs &&
            data.songs.map((s) => (
              <li key={s._id}>
                <Link href={`/songs/${s._id}?part=${instrument}`}>
                  <a>{s.title}</a>
                </Link>
              </li>
            ))}
        </ul>

        {data.owner && (
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
            {data.requestedUsers &&
              data.requestedUsers.map((user) => (
                <li key={user._id}>
                  {user._id}
                  {user.name} <strong>{user.status}</strong>
                  {user.status === "Requested" && (
                    <>
                      <button onClick={() => acceptUser(user._id)}>
                        Accept
                      </button>
                      <button onClick={() => declineUser(user._id)}>
                        Decline
                      </button>
                    </>
                  )}
                </li>
              ))}
          </>
        )}
      </div>
    );
  } else {
    return <h1>No access.</h1>;
  }
}

export async function getServerSideProps(context) {
  let owner = false;
  let member = false;
  let data = {};
  const session = await getSession(context);
  const collectiveId = context.query.collectiveId;
  const collectiveOwner = await getCollectiveOwner(collectiveId);

  if (!session)
    return {
      props: {
        data: {
          owner: false,
          member: false,
        },
      },
    };

  if (session.userId === collectiveOwner) owner = true;

  if (!owner) {
    member = await isMember(collectiveId, session.userId);
  }

  if (owner) {
    const songs = JSON.parse(await getSongs(collectiveId));
    const requestedUsers = await JSON.parse(
      await getCollectiveMembers(collectiveId)
    ).members;
    data = {
      owner: true,
      member: false,
      songs,
      requestedUsers,
    };
  }

  if (!owner && member) {
    const songs = JSON.parse(await getSongs(collectiveId));

    data = {
      owner: false,
      member: true,
      songs,
    };
  }

  return {
    props: {
      data,
    },
  };
}

export default Collective;
