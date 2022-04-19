import { getSpecificPart } from "../../../controllers/partController";
import globalHandler from "../../../middleware/globalHandler";

const handler = globalHandler()
  // Creating a new collective
  .get(async (req, res) => {
    const { songId, part } = req.query;
    const partData = JSON.parse(await getSpecificPart(songId, part));
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${part}.pdf"`);
    res.send(Buffer.from(partData.parts[0].file.split(",")[1], "base64"));
  });

export default handler;
