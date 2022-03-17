import nc from "next-connect";
import { connectToDB } from "../../../middleware/connectToDB";
import { createUser } from "../../../controllers/userController";

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
  .post(async (req, res) => {
    const user = await createUser(req);
    res.send(user);
  });

export default handler;
