import nc from "next-connect";
import { connectToDB } from "../../../../middleware/connectToDB";
import {
  postInstruments,
  getInstrumentsJson,
} from "../../../../controllers/collectiveController";

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
    const result = await getInstrumentsJson(req.query.collectiveId);
    res.send(result);
  })
  .post(async (req, res) => {
    const result = await postInstruments(req);
    res.send(result);
  });

export default handler;
