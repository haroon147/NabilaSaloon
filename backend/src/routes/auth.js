const express  = require('express');
const jwt      = require('jsonwebtoken');
const { body } = require('express-validator');
const User     = require('../models/User');
const Employee = require('../models/Employee');
const { validate } = require('../middleware/errorHandler');
const { protect }  = require('../middleware/auth');

const router = express.Router();

function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

// ── POST /api/auth/register ───────────────────────────────────────────────────
router.post('/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('phone').optional().trim(),
    body('role').optional().isIn(['client', 'employee']).withMessage('Role must be client or employee'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { name, email, password, phone = '', role = 'client' } = req.body;

      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(409).json({ success: false, message: 'Email already registered' });
      }

      const user = await User.create({ name, email, password, phone, role });
      const token = signToken(user._id);

      res.status(201).json({
        success: true,
        token,
        user: user.toPublic(),
      });
    } catch (err) { next(err); }
  }
);

// ── POST /api/auth/login ──────────────────────────────────────────────────────
router.post('/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password is required'),
    body('role').isIn(['client', 'employee', 'admin']).withMessage('Valid role required'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { email, password, role } = req.body;

      const user = await User.findOne({ email, role }).select('+password');
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      const token = signToken(user._id);
      res.json({ success: true, token, user: user.toPublic() });
    } catch (err) { next(err); }
  }
);

// ── GET /api/auth/me ──────────────────────────────────────────────────────────
router.get('/me', protect, (req, res) => {
  res.json({ success: true, data: req.user.toPublic() });
});

// ── POST /api/auth/change-password ───────────────────────────────────────────
router.post('/change-password',
  protect,
  [
    body('currentPassword').notEmpty().withMessage('Current password required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const user = await User.findById(req.user._id).select('+password');
      if (!(await user.comparePassword(req.body.currentPassword))) {
        return res.status(401).json({ success: false, message: 'Current password is incorrect' });
      }
      user.password = req.body.newPassword;
      await user.save();
      res.json({ success: true, message: 'Password updated successfully' });
    } catch (err) { next(err); }
  }
);

// ── PATCH /api/auth/profile ───────────────────────────────────────────────────
router.patch('/profile',
  protect,
  [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('phone').optional().trim(),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { name, phone, profileImage } = req.body;
      const user = await User.findByIdAndUpdate(
        req.user._id,
        { ...(name && { name }), ...(phone !== undefined && { phone }), ...(profileImage && { profileImage }) },
        { new: true, runValidators: true }
      );
      res.json({ success: true, data: user.toPublic() });
    } catch (err) { next(err); }
  }
);

module.exports = router;
