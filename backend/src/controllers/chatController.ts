import boom from 'boom';

import { chatModel } from '../models/Chat';

export const getChatsChannel = async (req) => {
  try {
    const id = req.params.id;
    const chats = await chatModel.find({ channel_id: id });
    return chats;
  } catch (error) {
    throw boom.boomify(error);
  }
};

export const createNewChat = async (req) => {
  try {
    const chat = new chatModel(req.body);
    const newChat = await chat.save();
    return newChat;
  } catch (error) {
    throw boom.boomify(error);
  }
};
