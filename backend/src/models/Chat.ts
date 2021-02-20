import mongoose from 'mongoose';

export const chatSchema = new mongoose.Schema({
  channel_id: mongoose.Schema.Types.ObjectId,
  name: String,
  message: String,
  created: Date
})

export const chatModel = mongoose.model('Chat', chatSchema);
