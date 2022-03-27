import nc from "next-connect";
import { connectToDB } from "./connectToDB";
import { isUserAuthenticated } from "./isUserAuthenticated";

const config = {
  onError: (err, req, res) => {
    console.log("ERROR FROM CONFIG: " + err.stack);
    console.error(err.stack);
    res.status(500).json({ error: "Something broke!" });
  },
  onNoMatch: (req, res) => {
    res.status(404).json({ error: "Page is not found" });
  },
};

export default function globalHandler() {
  return nc(config).use(connectToDB).use(isUserAuthenticated);
}
