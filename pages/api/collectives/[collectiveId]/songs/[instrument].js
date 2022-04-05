import globalHandler from "../../../../../middleware/globalHandler";
import {isUserCollectiveMember} from "../../../../../middleware/isUserCollectiveMember";
import {getSongNamesByPart} from "../../../../../controllers/songController";

const handler = globalHandler()
    .use(isUserCollectiveMember)
    .get(async (req, res) => {
        const result = await getSongNamesByPart(req);
        res.send(result);
    })

export default handler;