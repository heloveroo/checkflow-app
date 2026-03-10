import mongoose from 'mongoose';

const templateItemSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  order: { type: Number, default: 0 },
  isRequired: { type: Boolean, default: true },
  estimatedTime: { type: Number, default: 0 } // minutes
});

const checklistTemplateSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
  items: [templateItemSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isPublic: { type: Boolean, default: true },
  priority: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
  estimatedDuration: { type: Number, default: 0 }, // total minutes
  usageCount: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('ChecklistTemplate', checklistTemplateSchema);
