import mongoose from 'mongoose';

export const dmSchema = new mongoose.Schema({
  from_user_id: mongoose.Schema.Types.ObjectId,
  to_user_id: mongoose.Schema.Types.ObjectId,
  lastUpdated: Date,
});

export const dmModel = mongoose.model('Dm', dmSchema);
