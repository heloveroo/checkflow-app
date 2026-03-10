import mongoose from 'mongoose';

const checklistItemSchema = new mongoose.Schema({
  templateItemId: { type: mongoose.Schema.Types.ObjectId },
  title: { type: String, required: true },
  description: { type: String },
  order: { type: Number, default: 0 },
  isRequired: { type: Boolean, default: true },
  isCompleted: { type: Boolean, default: false },
  completedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  completedAt: { type: Date },
  comment: { type: String },
  estimatedTime: { type: Number, default: 0 }
});

const checklistInstanceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  template: { type: mongoose.Schema.Types.ObjectId, ref: 'ChecklistTemplate' },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [checklistItemSchema],
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'overdue', 'cancelled'],
    default: 'pending'
  },
  priority: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
  dueDate: { type: Date },
  completedAt: { type: Date },
  progress: { type: Number, default: 0 }, // 0-100
  comments: [{
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

// Auto-calculate progress
checklistInstanceSchema.methods.updateProgress = function() {
  if (!this.items.length) { this.progress = 0; return; }
  const completed = this.items.filter(i => i.isCompleted).length;
  this.progress = Math.round((completed / this.items.length) * 100);
  if (this.progress === 100) {
    this.status = 'completed';
    this.completedAt = new Date();
  } else if (this.progress > 0) {
    this.status = 'in_progress';
  }
};

export default mongoose.model('ChecklistInstance', checklistInstanceSchema);
