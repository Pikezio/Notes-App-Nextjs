import { createUser } from "../../../controllers/userController";
import globalHandler from "../../../middleware/globalHandler";

const handler = globalHandler().post(async (req, res) => {
  const user = await createUser(req);
  res.send(user);
});

export default handler;
