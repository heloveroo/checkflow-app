import mongoose from 'mongoose';

const tagSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true, lowercase: true },
  color: { type: String, default: '#8b5cf6' }
}, { timestamps: true });

export default mongoose.model('Tag', tagSchema);
