import boom from 'boom';

import { chatModel } from '../models/Chat';

export const getChatsChannel = async (req) => {
  try {
    const id = req.params === undefined ? req.id : req.params.id;
    const chats = await chatModel.find({ channel_id: id });
    return chats;
  } catch (error) {
    throw boom.boomify(error);
  }
};

export const addChat = async (req) => {
  try {
    // GraphQLから送信した場合、送信したobjectはreqに入っている
    const request = req.body === undefined ? req : req.body;
    const chatData = {
      name: request.name,
      message: request.message,
      created: new Date(),
      channel_id: request.channel_id,
      user_id: request.user_id,
      imageData: request.imageData,
      imageTitle: request.imageTitle,
    };
    const chat = new chatModel(chatData);
    const newChat = await chat.save();
    return newChat;
  } catch (error) {
    throw boom.boomify(error);
  }
};

export const editChat = async (req) => {
  const request = req.body === undefined ? req : req.body;
  const result = await chatModel.updateOne(
    {
      _id: request._id,
    },
    { $set: { message: request.message } }
  );
  return result;
};

export const deleteChat = async (req) => {
  const request = req.body === undefined ? req : req.body;
  const result = await chatModel.deleteOne({ _id: request._id });
  return result;
};
