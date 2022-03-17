import User from "../models/User";
import { hash } from "bcryptjs";

//Route: /collectives/[collectiveId]/songs - POST, GET

async function createUser(req) {
  const { username, password } = req.body;

  const passHash = await hash(password, 12);

  const user = await User.create({ username, password: passHash });

  return user;
}

module.exports = {
  createUser,
};
