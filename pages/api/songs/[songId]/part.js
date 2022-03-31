// TODO: implement security here
import globalHandler from "../../../../middleware/globalHandler";
import {addPart, deletePart, updatePart} from "../../../../controllers/songController";

const handler = globalHandler()
    .post(async (req, res) => {
        const result = await addPart(req);
        res.send(result);
    })
    .delete(async (req, res) => {
        const result = await deletePart(req);
        res.send(result);
    })
    .patch(async (req, res) => {
        const result = await updatePart(req);
        res.send(result);
    });

export default handler;
