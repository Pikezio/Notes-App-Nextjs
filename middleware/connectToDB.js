import dbConnect from "../util/dbConnect";

// Checks if there is a userId in the session and adds it to req.userId
export async function connectToDB(req, res, next) {
  try {
    await dbConnect();
  } catch (err) {
    res.json(500).end("Failed connecting to database.");
  }
  next();
}
