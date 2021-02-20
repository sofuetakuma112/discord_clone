import boom from 'boom';

import Category from '../models/Channel';

// 単一のカテゴリーにおける全てのチャンネルの取得
export const getChannelsCategory = async (req) => {
  try {
    const id = req.params.id;
    const channels = await Category.find({ category_id: id });
    return channels;
  } catch (error) {
    throw boom.boomify(error);
  }
};
