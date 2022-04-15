import globalHandler from "../../../middleware/globalHandler";
import {getAllSongs} from "../../../controllers/songController";
import {isUserAuthenticated} from "../../../middleware/isUserAuthenticated";

const handler = globalHandler()
    .use(isUserAuthenticated)
    .get(async (req, res) => {
        const result = await getAllSongs(req);
        res.send(result);
    })

export default handler;
