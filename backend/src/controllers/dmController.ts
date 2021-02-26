import boom from 'boom';

import { dmModel } from '../models/Dm';

export const createDm = async (req) => {
  const request = req.body === undefined ? req : req.body;
  const result = await dmModel.find({
    from_user_id: request.from_user_id,
    to_user_id: request.to_user_id,
  });
  if (result.length !== 0) return result[0];
  const dm = new dmModel(request);
  const newDm = await dm.save();
  return newDm;
};

export const getAllDm = async () => {
  const chats = await dmModel.find();
  return chats;
};
