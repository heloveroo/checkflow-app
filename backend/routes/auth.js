import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
  expiresIn: process.env.JWT_EXPIRES_IN || '7d'
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, department } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: 'Email already exists' });

    const user = await User.create({ name, email, password, department });
    const token = signToken(user._id);
    res.status(201).json({ success: true, data: { user, token } });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    if (!user.isActive) return res.status(403).json({ success: false, message: 'Account disabled' });

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = signToken(user._id);
    res.json({ success: true, data: { user, token } });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// GET /api/auth/me
router.get('/me', authenticate, (req, res) => {
  res.json({ success: true, data: req.user });
});

export default router;
