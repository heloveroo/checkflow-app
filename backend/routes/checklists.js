import express from 'express';
import ChecklistInstance from '../models/ChecklistInstance.js';
import ChecklistTemplate from '../models/ChecklistTemplate.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { logAction } from '../middleware/logger.js';

const router = express.Router();
router.use(authenticate);

// GET /api/checklists
router.get('/', async (req, res) => {
  try {
    const { status, assignedTo, mine, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;
    if (mine === 'true') query.$or = [{ assignedTo: req.user._id }, { createdBy: req.user._id }];
    if (assignedTo) query.assignedTo = assignedTo;
    if (!['admin', 'manager'].includes(req.user.role) && mine !== 'false') {
      query.$or = [{ assignedTo: req.user._id }, { createdBy: req.user._id }];
    }

    const checklists = await ChecklistInstance.find(query)
      .populate('category', 'name color icon')
      .populate('tags', 'name color')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await ChecklistInstance.countDocuments(query);
    res.json({ success: true, data: checklists, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/checklists/stats
router.get('/stats', async (req, res) => {
  try {
    const query = ['admin', 'manager'].includes(req.user.role)
      ? {}
      : { $or: [{ assignedTo: req.user._id }, { createdBy: req.user._id }] };

    const [total, completed, inProgress, overdue, pending] = await Promise.all([
      ChecklistInstance.countDocuments(query),
      ChecklistInstance.countDocuments({ ...query, status: 'completed' }),
      ChecklistInstance.countDocuments({ ...query, status: 'in_progress' }),
      ChecklistInstance.countDocuments({ ...query, status: 'overdue' }),
      ChecklistInstance.countDocuments({ ...query, status: 'pending' })
    ]);

    res.json({ success: true, data: { total, completed, inProgress, overdue, pending } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/checklists/:id
router.get('/:id', async (req, res) => {
  try {
    const checklist = await ChecklistInstance.findById(req.params.id)
      .populate('category', 'name color icon')
      .populate('tags', 'name color')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name')
      .populate('items.completedBy', 'name')
      .populate('comments.author', 'name');
    if (!checklist) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: checklist });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/checklists - create from template
router.post('/', logAction('CREATE_CHECKLIST', 'checklist'), async (req, res) => {
  try {
    let { templateId, title, assignedTo, dueDate, priority, description } = req.body;
    if (!assignedTo) assignedTo = undefined;
    if (!dueDate) dueDate = undefined;
    let items = req.body.items || [];

    if (templateId) {
      const template = await ChecklistTemplate.findById(templateId);
      if (!template) return res.status(404).json({ success: false, message: 'Template not found' });
      items = template.items.map(i => ({ ...i.toObject(), isCompleted: false }));
      template.usageCount += 1;
      await template.save();
    }

    const checklist = await ChecklistInstance.create({
      title: title || 'Новий чекліст',
      description,
      template: templateId,
      items,
      assignedTo,
      dueDate,
      priority,
      createdBy: req.user._id
    });

    res.status(201).json({ success: true, data: checklist });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PATCH /api/checklists/:id/items/:itemId - toggle item
router.patch('/:id/items/:itemId', logAction('TOGGLE_ITEM', 'checklist'), async (req, res) => {
  try {
    const checklist = await ChecklistInstance.findById(req.params.id);
    if (!checklist) return res.status(404).json({ success: false, message: 'Not found' });

    const item = checklist.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });

    item.isCompleted = !item.isCompleted;
    item.completedBy = item.isCompleted ? req.user._id : null;
    item.completedAt = item.isCompleted ? new Date() : null;
    if (req.body.comment) item.comment = req.body.comment;

    checklist.updateProgress();
    await checklist.save();

    res.json({ success: true, data: checklist });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// POST /api/checklists/:id/comments
router.post('/:id/comments', async (req, res) => {
  try {
    const checklist = await ChecklistInstance.findById(req.params.id);
    if (!checklist) return res.status(404).json({ success: false, message: 'Not found' });
    checklist.comments.push({ author: req.user._id, text: req.body.text });
    await checklist.save();
    await checklist.populate('comments.author', 'name');
    res.json({ success: true, data: checklist });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PATCH /api/checklists/:id
router.patch('/:id', authorize('manager', 'admin'), async (req, res) => {
  try {
    const checklist = await ChecklistInstance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: checklist });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE /api/checklists/:id
router.delete('/:id', authorize('admin', 'manager'), async (req, res) => {
  try {
    await ChecklistInstance.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;