import nc from "next-connect";
import { connectToDB } from "../../../../middleware/connectToDB";
import { postSong, getSongs } from "../../../../controllers/songController";

const handler = nc({
  onError: (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).end("Something broke!");
  },
  onNoMatch: (req, res) => {
    res.status(404).end("Page is not found");
  },
})
  .use(async (req, res, next) => {
    await connectToDB(req, res, next);
  })
  .get(async (req, res) => {
    const result = await getSongs(req);
    res.send(result);
  })
  .post(async (req, res) => {
    const result = await postSong(req);
    res.send(result);
  });

export default handler;

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};
