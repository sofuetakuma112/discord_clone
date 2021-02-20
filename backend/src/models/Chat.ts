import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  channel_id: mongoose.Schema.Types.ObjectId,
  name: String,
  message: String,
  created: Date
})

export default mongoose.model('Chat', chatSchema);
