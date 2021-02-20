import boom from 'boom';

import Chat from '../models/Channel';

export const getChatsChannel = async (req) => {
  try {
    const id = req.params.id;
    const chats = await Chat.find({ channel_id: id });
    return chats;
  } catch (error) {
    throw boom.boomify(error);
  }
};