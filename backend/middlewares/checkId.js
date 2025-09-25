import { isValidObjectId } from 'mongoose';

function checkId(req, res, next) {
  const { id } = req.params;

  // Check if the ID is a valid MongoDB ObjectId
  if (!isValidObjectId(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  next();
}
export default checkId;