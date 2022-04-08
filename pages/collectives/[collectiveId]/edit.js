import { getSession } from "next-auth/react";
import { getCollective } from "../../../controllers/collectiveController";
import React, { useState } from "react";
import { toBase64 } from "../../../util/toBase64";
import axios from "axios";
import { server } from "../../../util/urlConfig";
import { useRouter } from "next/router";
import Image from "next/image";
import { Container, Form, Button } from "react-bootstrap";

const EditCollective = ({ collective, collectiveId }) => {
  const createdDate = new Date(collective.createdAt).toLocaleString("lt-LT");
  const updatedData = new Date(collective.updatedAt).toLocaleString("lt-LT");

  const router = useRouter();

  const [newData, setNewData] = useState({
    title: collective.title,
    logo: collective.logo,
  });

  const showSaveButton =
    newData.title !== collective.title || newData.logo !== collective.logo;

  const submitEdit = async () => {
    // Construct the payload for updating the specific elements
    let payload = {};
    if (newData.title !== collective.title) {
      payload = {
        ...payload,
        title: newData.title,
      };
    }

    if (newData.logo !== collective.logo) {
      const fileString = await toBase64(newData.logo);
      payload = {
        ...payload,
        logo: fileString,
      };
    }

    axios
      .patch(`${server}/api/collectives/${collectiveId}/`, payload)
      .then(router.replace(router.asPath))
      .catch((err) => console.log(err));
  };

  const confirmDelete = () => {
    if (confirm(`Ar tikrai norite ištrinti kolektyvą: ${collective.title}?`)) {
      axios
        .delete(`${server}/api/collectives/${collectiveId}/`)
        .then(router.replace("/"))
        .catch((err) => console.log(err));
    }
  };

  return (
    <Container>
      <Form>
        <Form.Group className="d-flex justify-content-between align-items-center">
          <div>
            <Form.Label>Pavadinimas</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={newData.title}
              onChange={(e) =>
                setNewData({ ...newData, title: e.target.value })
              }
              className="mb-2"
            />
          </div>
          <div>
            <Form.Label>Logotipas</Form.Label>
            <br />
            {collective.logo && (
              <Image
                className="rounded"
                src={collective.logo}
                alt="Logo"
                width={100}
                height={100}
              />
            )}
          </div>
        </Form.Group>

        <Form.Control
          type="file"
          name="logo"
          className="mb-2"
          onChange={(e) => setNewData({ ...newData, logo: e.target.files[0] })}
        />
        <div className="d-flex justify-content-between align-items-center">
          <Form.Label htmlFor="collectiveColor">Kolektyvo spalva</Form.Label>
          <Form.Control
            type="color"
            id="collectiveColor"
            defaultValue="#563d7c"
            title="Pasirinkite kolektyvo spalvą"
            className="mb-2 ml-2"
          />
        </div>
        <div className="d-flex justify-content-between">
          <p>Sukūrimo data</p>
          <strong>{createdDate}</strong>
        </div>
        <div className="d-flex justify-content-between">
          <p>Paskutinio atnaujinimo data</p>
          <strong>{updatedData}</strong>
        </div>
        <div className="d-flex justify-content-between justify-content-sm-start">
          <Button
            variant="success"
            disabled={!showSaveButton}
            onClick={submitEdit}
          >
            Išsaugoti pakeitimus
          </Button>
          <Button variant="danger" className="mx-2" onClick={confirmDelete}>
            Ištrinti kolektyvą
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default EditCollective;

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const collective = await JSON.parse(
    await getCollective(context.query.collectiveId)
  );

  return {
    props: {
      collectiveId: context.query.collectiveId,
      collective,
    },
  };
}
