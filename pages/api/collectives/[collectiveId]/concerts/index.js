import globalHandler from "../../../../../middleware/globalHandler";
import { isUserCollectiveOwner } from "../../../../../middleware/isUserCollectiveOwner";
import Concert from "../../../../../models/Concert";

const handler = globalHandler()
  // Creating a new concert
  .use(isUserCollectiveOwner)
  .post(async (req, res) => {
    const createdConcert = await Concert.create({
      ...req.body,
    });
    res.send(createdConcert);
  })
  .delete(async (req, res) => {
    const { id } = req.query;
    const deletedConcert = await Concert.findByIdAndDelete(id);
    res.send(deletedConcert);
  })
  .patch(async (req, res) => {
    const { id } = req.query;
    const updatedConcert = await Concert.findByIdAndUpdate(id, req.body);
    res.send(updatedConcert);
  });

export default handler;
