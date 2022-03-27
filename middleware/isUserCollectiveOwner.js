import { getCollectiveOwner } from "../controllers/collectiveController";

// collectiveId must be in URL and userId must be in request
export async function isUserCollectiveOwner(req, res, next) {
  const { collectiveId } = req.query;
  const ownerId = await getCollectiveOwner(collectiveId);
  if (ownerId !== req.userId) {
    res.status(403).json({ error: "This user is not the owner." });
  }
  next();
}
