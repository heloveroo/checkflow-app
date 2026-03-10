import mongoose from 'mongoose';

const actionLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: { type: String, required: true },
  entity: { type: String }, // 'checklist', 'template', 'user', etc.
  entityId: { type: mongoose.Schema.Types.ObjectId },
  details: { type: mongoose.Schema.Types.Mixed },
  ip: { type: String },
  userAgent: { type: String }
}, { timestamps: true });

export default mongoose.model('ActionLog', actionLogSchema);
