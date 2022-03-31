import {deleteSong, getPartOfSong, updateSong} from "../../../controllers/songController";
import globalHandler from "../../../middleware/globalHandler";

// TODO: implement security here
const handler = globalHandler()
    .get(async (req, res) => {
        const result = await getPartOfSong(req);
        res.send(result);
    })
    .delete(async (req, res) => {
        const result = await deleteSong(req);
        res.send(result);
    })
    .patch(async (req, res) => {
        const result = await updateSong(req);
        res.send(result);
    });

export default handler;
