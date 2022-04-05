import globalHandler from "../../../../middleware/globalHandler";
import {addPart, deletePart, updatePart} from "../../../../controllers/songController";
import {attachCollectiveId} from "../../../../middleware/attachCollectiveId";
import {isUserCollectiveOwner} from "../../../../middleware/isUserCollectiveOwner";

const handler = globalHandler()
    .use(attachCollectiveId)
    .use(isUserCollectiveOwner)
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
