import { getPartById } from "../../../controllers/partController";
import globalHandler from "../../../middleware/globalHandler";

const handler = globalHandler()
  // Creating a new collective
  .get(async (req, res) => {
    const { partId } = req.query;
    const partData = JSON.parse(await getPartById(partId)).parts[0];
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${partData.filename}"`
    );
    res.send(Buffer.from(partData.file.split(",")[1], "base64"));
  });

export default handler;
