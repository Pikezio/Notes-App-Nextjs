import axios from "axios";
import { getSession } from "next-auth/react";
import { getAllCollectives } from "../../controllers/collectiveController";
import { server } from "../../util/urlConfig";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

function ListOfAllCollectives({ collectives }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const submitJoin = async (collectiveId) => {
    await axios.post(`${server}/api/collectives/${collectiveId}/join`, {
      userId: session.userId,
      name: session.user.name,
    });
    router.replace(router.asPath);
  };

  return (
    <div>
      <h1>Visi kolektyvai</h1>
      {collectives.unjoinedCollectives.map((collective) => (
        <div key={collective._id}>
          <li>{collective.title}</li>
          <button onClick={() => submitJoin(collective._id)}>
            Prisijungti
          </button>
        </div>
      ))}

      {collectives.joinedCollectives.map((collective) => (
        <div key={collective._id}>
          <li>
            {collective.title} <strong>{collective.members[0].status}</strong>
          </li>
        </div>
      ))}
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const response = await getAllCollectives(session.userId);
  const data = JSON.parse(response);

  return {
    props: {
      collectives: data,
    },
  };
}

export default ListOfAllCollectives;
