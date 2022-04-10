import User from "../models/User";
import { hash } from "bcryptjs";

//Route: /collectives/[collectiveId]/songs - POST, GET

export async function createUser(req) {
  const { username, password, name } = req.body;

  const passHash = await hash(password, 12);

  const user = await User.create({
    username,
    password: passHash,
    name,
  });

  return user;
}
