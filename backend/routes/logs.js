import express from 'express';
import ActionLog from '../models/ActionLog.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);

router.get('/', authorize('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const logs = await ActionLog.find()
      .populate('user', 'name email role')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await ActionLog.countDocuments();
    res.json({ success: true, data: logs, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
