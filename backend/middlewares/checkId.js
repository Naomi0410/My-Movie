import { isValidObjectId } from "mongoose";

// 🧠 Validate MongoDB ObjectId
const checkId = (req, res, next) => {
  if (!isValidObjectId(req.params.id)) {
    res.status(404);
    throw new Error(`Invalid ObjectId: ${req.params.id}`);
  }
  next();
};

export default checkId;
