import boom from 'boom';

import { channelModel } from '../models/Channel';

// 単一のカテゴリーにおける全てのチャンネルの取得
export const getChannelsCategory = async (req) => {
  try {
    const id = req.params === undefined ? req.id : req.params.id;
    const channels = await channelModel.find({ category_id: id });
    return channels;
  } catch (error) {
    throw boom.boomify(error);
  }
};

export const getSingleChannel = async (req) => {
  try {
    const id = req.params === undefined ? req.id : req.params.id;
    const channels = await channelModel.findById(id);
    return channels;
  } catch (error) {
    throw boom.boomify(error);
  }
};

// requestにcategory_idも含める
export const createNewChannel = async (req) => {
  try {
    const channel = new channelModel(req.body);
    const newChannel = await channel.save();
    return newChannel;
  } catch (error) {
    throw boom.boomify(error);
  }
};
