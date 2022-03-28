import { getCollectiveMember } from "../controllers/collectiveController";
import { getCollectiveOwner } from "../controllers/collectiveController";

// collectiveId must be in URL and userId must be in request
async function isUserCollectiveMember(req, res, next) {
  const { collectiveId } = req.query;

  const ownerId = await getCollectiveOwner(collectiveId);
  if (ownerId === req.userId) {
    next();
    return;
  }

  const member = await isMember(collectiveId, req.userId);
  if (!member) {
    res.status(403).json({ error: "User is not a member" });
    return;
  }
  next();
}

async function isMember(collectiveId, userId) {
  const collective = await getCollectiveMember(collectiveId, userId);
  if (
    !collective ||
    !collective.members ||
    !collective.members[0] ||
    collective.members[0].status !== "Accepted"
  ) {
    return false;
  }

  return true;
}

module.exports = {
  isMember,
  isUserCollectiveMember,
};
