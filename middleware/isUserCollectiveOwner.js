import { getCollectiveOwner } from "../controllers/collectiveController";

// collectiveId must be in URL and userId must be in request
export async function isUserCollectiveOwner(req, res, next) {
  const { collectiveId } = req.query;
  if (!isOwner(collectiveId, req.userId)) {
    res.status(403).json({ error: "This user is not the owner." });
    return;
  }
  next();
}

export async function isOwner(collectiveId, currentUserId) {
  const ownerId = await getCollectiveOwner(collectiveId);

  if (ownerId !== currentUserId) {
    return false;
  }

  return true;
}
