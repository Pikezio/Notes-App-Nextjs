import { getCollectiveOwner } from "../controllers/collectiveController";
import {getSongCollectiveId} from "../controllers/songController";

// collectiveId must be in URL and userId must be in request
export async function attachCollectiveId(req, res, next) {
    const { collectiveId } = await getSongCollectiveId(req);
    req.query.collectiveId = collectiveId;
    next();
}
