import { connectToDB } from "../../../middleware/connectToDB";
import { getSong } from "../../../controllers/songController";
import nc from "next-connect";

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
  //   .use(async (req, res, next) => {
  //     await isUserConnected(req, res, next);
  //   })
  .get(async (req, res) => {
    const result = await getSong(req);
    res.send(result);
  });

export default handler;
