import mongoose from 'mongoose';

const channelSchema = new mongoose.Schema({
  category_id: mongoose.Schema.Types.ObjectId,
  name: String,
})

export default mongoose.model('Channel', channelSchema);
