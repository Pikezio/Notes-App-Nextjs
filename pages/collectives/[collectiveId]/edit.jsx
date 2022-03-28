import { getSession } from "next-auth/react";
import { getCollective } from "../../../controllers/collectiveController";
import React, { useState } from "react";
import { toBase64 } from "../../../util/toBase64";
import axios from "axios";
import { server } from "../../../util/urlConfig";
import { useRouter } from "next/router";
import Image from "next/image";

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

    console.log(payload);
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
    <div>
      <h1>Kolektyvo {collective.title} nustatymai</h1>
      <label htmlFor="title">Pavadinimas</label>
      <input
        type="text"
        name="title"
        value={newData.title}
        onChange={(e) => setNewData({ ...newData, title: e.target.value })}
      />

      <label htmlFor="logo">Logotipas</label>
      {collective.logo && (
        <Image src={collective.logo} alt="Logo" width={300} height={300} />
      )}

      <input
        type="file"
        name="logo"
        onChange={(e) => setNewData({ ...newData, logo: e.target.files[0] })}
      />

      <p>Sukūrimo data: {createdDate}</p>
      <p>Paskutinio atnaujinimo data: {updatedData}</p>
      <button disabled={!showSaveButton} onClick={submitEdit}>
        Išsaugoti pakeitimus
      </button>
      <button onClick={confirmDelete}>Ištrinti kolektyvą</button>
    </div>
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
