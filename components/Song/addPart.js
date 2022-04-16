import axios from "axios";
import { useRouter } from "next/router";
import FileUpload from "../files/fileUpload";

function AddPart({ instrumentList, songId }) {
  const router = useRouter();
  const { collectiveId } = router.query;

  const returnParts = async (parts) => {
    await submitData(parts);
  };

  async function submitData(parts) {
    axios
      .post(`/api/collectives/${collectiveId}/songs/${songId}/part`, parts)
      .then(() => router.push(router.asPath))
      .catch((err) => console.log(err));
  }

  return (
    <div>
      <FileUpload
        instrumentList={["---", ...instrumentList]}
        returnParts={returnParts}
        buttonText="Pridėti"
      />
    </div>
  );
}

export default AddPart;
