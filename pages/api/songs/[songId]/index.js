import globalHandler from "../../../../middleware/globalHandler";
import {deleteSong, updateSong, getPartOfSong} from "../../../../controllers/songController";
import {isUserCollectiveMember} from "../../../../middleware/isUserCollectiveMember";
import {attachCollectiveId} from "../../../../middleware/attachCollectiveId";
import {isUserCollectiveOwner} from "../../../../middleware/isUserCollectiveOwner";

const handler = globalHandler()
    .use(attachCollectiveId)
    .use(isUserCollectiveMember)
    .get(async (req, res) => {
        const result = await getPartOfSong(req);
        res.send(result);
    })
    .use(isUserCollectiveOwner)
    .delete(async (req, res) => {
        const result = await deleteSong(req);
        res.send(result);
    })
    .patch(async (req, res) => {
        const result = await updateSong(req);
        res.send(result);
    });

export default handler;
