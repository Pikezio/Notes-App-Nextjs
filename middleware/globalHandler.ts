import nc from "next-connect";
import { connectToDB } from "./connectToDB";
import { isUserAuthenticated } from "./isUserAuthenticated";

const config = {
  onError : (error, req, res) => {
      // handle errors
  }
};

export default function globalHandler() {
  return nc(config).use(connectToDB);
};