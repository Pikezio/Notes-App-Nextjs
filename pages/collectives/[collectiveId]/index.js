import { useRouter } from "next/router";
import Link from "next/link";
import {
  getCollectiveOwner,
  getCollectiveMembers,
  getCollective,
} from "../../../controllers/collectiveController";
import { useRecoilState } from "recoil";
import { getSession } from "next-auth/react";
import axios from "axios";
import { isMember } from "../../../middleware/isUserCollectiveMember";
import { server } from "../../../util/urlConfig";
import { instrumentState } from "../../../atoms";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Container,
  FloatingLabel,
  Form,
  ListGroup,
  Button,
  Badge,
} from "react-bootstrap";

function Collective({ data, collective }) {
  const router = useRouter();
  const { collectiveId } = router.query;
  const [songs, setSongs] = useState([]);
  const [selectedInstrument, setSelectedInstrument] =
    useRecoilState(instrumentState);
  const [sort, setSort] = useState(false);

  // Refetch when instrument changes
  useEffect(() => {
    const getSavedInstrument = async () => {
      if (router.isReady && collectiveId) {
        const item = localStorage.getItem(collectiveId);
        if (item != null) {
          setSelectedInstrument(item);
        }
      }
    };
    getSavedInstrument();
    axios
      .get(
        `/api/collectives/${collectiveId}/songs?instrument=${selectedInstrument}`
      )
      .then((res) => setSongs(res.data))
      .catch((err) => console.log(err));
  }, [selectedInstrument, collectiveId, router.isReady, setSelectedInstrument]);

  const modifyUser = async (userId, action) => {
    await axios
      .patch(`${server}/api/collectives/${collectiveId}/users/${userId}`, {
        action: action,
      })
      .then(() => router.replace(router.asPath))
      .catch((err) => console.log(err));
  };

  const deleteUser = (userId) => {
    if (window.confirm("Ar tikrai norite pašalinti šį narį?")) {
      axios
        .delete(`${server}/api/collectives/${collectiveId}/users/${userId}`)
        .then(() => router.replace(router.asPath))
        .catch((err) => console.log(err));
    }
  };

  const onInstrumentChange = (e) => {
    setSelectedInstrument(e.target.value);
    localStorage.setItem(collectiveId, e.target.value);
  };

  const urlBase = `/collectives/${collectiveId}/songs`;

  if (data.member || data.owner) {
    return (
      <Container>
        <div
          className="d-flex justify-content-between
           align-items-center p-2 px-4 mb-2 rounded border"
          style={{ background: collective.color }}
        >
          <div>
            <small>Kolektyvas</small>
            <h1>{collective.title}</h1>
          </div>
          <div className="d-flex">
            <Link href={`${collectiveId}/instruments`} passHref>
              <Button variant="dark" className="mx-2 my-1">
                Redaguoti instrumentus
              </Button>
            </Link>
            <Link href={`${collectiveId}/edit`} passHref>
              <Button variant="dark" className="mx-2 my-1">
                Redaguoti kolektyvą
              </Button>
            </Link>
            <Link href={`${collectiveId}/concerts`} passHref>
              <Button variant="dark" className="mx-2 my-1">
                Koncertai
              </Button>
            </Link>
            {collective.logo && (
              <Image
                alt="logo"
                width={50}
                height={50}
                src={collective.logo}
                className="rounded"
              />
            )}
          </div>
        </div>

        <FloatingLabel controlId="floatingSelect" label="Partija">
          <Form.Select
            name="part"
            id="part"
            onChange={onInstrumentChange}
            value={
              collective.instruments.includes(selectedInstrument)
                ? selectedInstrument
                : "Visos"
            }
            className="mb-2"
          >
            <option value="all">Visos</option>
            {collective.instruments &&
              collective.instruments.map((i, idx) => (
                <option key={idx} value={i}>
                  {i}
                </option>
              ))}
          </Form.Select>
        </FloatingLabel>
        <div className="d-flex justify-content-between align-items-center">
          <h2>Kūriniai</h2>
          <Button variant="dark" onClick={() => setSort(!sort)}>
            {sort ? "z-a" : "a-z"}
          </Button>
        </div>

        <ListGroup className="mb-2">
          {songs &&
            songs
              .sort((a, b) => {
                if (a.title.toLowerCase() < b.title.toLowerCase())
                  return sort ? -1 : 1;
                if (a.title.toLowerCase() > b.title.toLowerCase())
                  return sort ? 1 : -1;
                return 0;
              })
              .map((s) => (
                <Link
                  passHref
                  key={s._id}
                  href={`${urlBase}/${s._id}?part=${selectedInstrument}`}
                >
                  <ListGroup.Item
                    action
                    className="d-flex justify-content-between align-items-center"
                  >
                    <div className="lead">{s.title}</div>
                    {data.owner && (
                      <Link href={`${urlBase}/${s._id}/edit`} passHref>
                        <Button>Redaguoti</Button>
                      </Link>
                    )}
                  </ListGroup.Item>
                </Link>
              ))}
        </ListGroup>

        {data.owner && (
          <div>
            <div className="d-flex mb-2">
              <Link href={`${collectiveId}/songs/create`} passHref>
                <Button variant="dark">Pridėti kūrinį</Button>
              </Link>
            </div>
            <h3>Kolektyvo nariai</h3>
            <ListGroup>
              {data.requestedUsers &&
                data.requestedUsers.map((user) => (
                  <ListGroup.Item
                    key={user._id}
                    className="d-flex justify-content-between"
                  >
                    {user.name}{" "}
                    <div>
                      <Badge bg="danger">
                        {user.status === "Declined" && "Atmestas"}
                      </Badge>
                      {user.status === "Requested" && (
                        <>
                          <Button
                            variant="success"
                            className="px-2 p-0 mx-2"
                            onClick={() => modifyUser(user.userId, "accept")}
                          >
                            Priimti
                          </Button>
                          <Button
                            className="px-2 p-0"
                            variant="danger"
                            onClick={() => modifyUser(user.userId, "decline")}
                          >
                            Nepriimti
                          </Button>
                        </>
                      )}
                      <Button
                        className="mx-2 p-0 px-2"
                        variant="dark"
                        onClick={() => deleteUser(user.userId)}
                      >
                        Pašalinti
                      </Button>
                    </div>
                  </ListGroup.Item>
                ))}
            </ListGroup>
          </div>
        )}
      </Container>
    );
  } else {
    return <h1>Nėra prieigos.</h1>;
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
        destination: "/",
        permanent: false,
      },
    };
  }

  const { collectiveId } = context.query;
  const collectiveOwner = await getCollectiveOwner(collectiveId);

  if (session.userId === collectiveOwner) owner = true;

  if (!owner) {
    member = await isMember(collectiveId, session.userId);
  }

  if (owner) {
    //const songs = JSON.parse(await getSongs(collectiveId));
    const requestedUsers = await JSON.parse(
      await getCollectiveMembers(collectiveId)
    ).members;
    data = {
      owner: true,
      member: false,
      requestedUsers,
    };
  }

  // TODO: owner view for seeing all songs, probably lazy loading
  if (!owner && member) {
    //const songs = JSON.parse(await getSongs(collectiveId));

    data = {
      owner: false,
      member: true,
    };
  }

  const collective = JSON.parse(await getCollective(collectiveId));

  return {
    props: {
      data,
      collective,
    },
  };
}

export default Collective;
