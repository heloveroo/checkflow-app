import express from 'express';
import ChecklistTemplate from '../models/ChecklistTemplate.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { logAction } from '../middleware/logger.js';

const router = express.Router();
router.use(authenticate);

// GET /api/templates
router.get('/', async (req, res) => {
  try {
    const { category, search, page = 1, limit = 20 } = req.query;
    const query = {};
    if (category) query.category = category;
    if (search) query.title = { $regex: search, $options: 'i' };

    const templates = await ChecklistTemplate.find(query)
      .populate('category', 'name color icon')
      .populate('tags', 'name color')
      .populate('createdBy', 'name')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await ChecklistTemplate.countDocuments(query);
    res.json({ success: true, data: templates, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/templates/:id
router.get('/:id', async (req, res) => {
  try {
    const template = await ChecklistTemplate.findById(req.params.id)
      .populate('category', 'name color icon')
      .populate('tags', 'name color')
      .populate('createdBy', 'name');
    if (!template) return res.status(404).json({ success: false, message: 'Template not found' });
    res.json({ success: true, data: template });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/templates
router.post('/', authorize('manager', 'admin'), logAction('CREATE_TEMPLATE', 'template'), async (req, res) => {
  try {
    const template = await ChecklistTemplate.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ success: true, data: template });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PATCH /api/templates/:id
router.patch('/:id', authorize('manager', 'admin'), logAction('UPDATE_TEMPLATE', 'template'), async (req, res) => {
  try {
    const template = await ChecklistTemplate.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!template) return res.status(404).json({ success: false, message: 'Template not found' });
    res.json({ success: true, data: template });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE /api/templates/:id
router.delete('/:id', authorize('admin'), async (req, res) => {
  try {
    await ChecklistTemplate.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
