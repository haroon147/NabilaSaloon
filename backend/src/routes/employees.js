const express  = require('express');
const { body, param, query } = require('express-validator');
const Employee = require('../models/Employee');
const User     = require('../models/User');
const Booking  = require('../models/Booking');
const { protect, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/errorHandler');
const { getAvailableSlots } = require('../utils/slots');

const router = express.Router();

// ── GET /api/employees ────────────────────────────────────────────────────────
// Public
router.get('/', async (req, res, next) => {
  try {
    const employees = await Employee.find({ isActive: true })
      .populate('user', 'name email phone profileImage')
      .sort({ name: 1 });

    const data = employees.map(emp => ({
      id:           emp._id,
      userId:       emp.user?._id,
      name:         emp.name,
      photo:        emp.photo,
      specialties:  emp.specialties,
      rating:       emp.rating,
      reviewCount:  emp.reviewCount,
      availability: emp.availability,
    }));

    res.json({ success: true, data });
  } catch (err) { next(err); }
});

// ── GET /api/employees/:id ────────────────────────────────────────────────────
router.get('/:id', async (req, res, next) => {
  try {
    const emp = await Employee.findById(req.params.id).populate('user', 'name email phone');
    if (!emp) return res.status(404).json({ success: false, message: 'Employee not found' });
    res.json({ success: true, data: emp });
  } catch (err) { next(err); }
});

// ── GET /api/employees/:id/slots?date=YYYY-MM-DD ─────────────────────────────
router.get('/:id/slots',
  [
    param('id').isMongoId().withMessage('Invalid employee ID'),
    query('date').matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Date must be YYYY-MM-DD'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const emp = await Employee.findById(req.params.id);
      if (!emp) return res.status(404).json({ success: false, message: 'Employee not found' });

      const slots = await getAvailableSlots(emp, req.query.date, Booking);
      res.json({ success: true, data: slots });
    } catch (err) { next(err); }
  }
);

// ── POST /api/employees — admin creates an employee profile ───────────────────
router.post('/',
  protect, authorize('admin'),
  [
    body('userId').isMongoId().withMessage('Valid userId required'),
    body('specialties').optional().isArray(),
    body('availability').optional().isArray(),
  ],
  validate,
  async (req, res, next) => {
    try {
      const user = await User.findById(req.body.userId);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      if (user.role !== 'employee') {
        return res.status(400).json({ success: false, message: 'User must have employee role' });
      }

      const existing = await Employee.findOne({ user: user._id });
      if (existing) return res.status(409).json({ success: false, message: 'Employee profile already exists' });

      const emp = await Employee.create({
        user:         user._id,
        name:         req.body.name || user.name,
        photo:        req.body.photo || '',
        specialties:  req.body.specialties || [],
        availability: req.body.availability || [],
      });

      res.status(201).json({ success: true, data: emp });
    } catch (err) { next(err); }
  }
);

// ── PATCH /api/employees/:id — admin or the employee themselves ───────────────
router.patch('/:id',
  protect,
  async (req, res, next) => {
    try {
      const emp = await Employee.findById(req.params.id);
      if (!emp) return res.status(404).json({ success: false, message: 'Employee not found' });

      // Only admin or the employee's own user can update
      const isOwner = emp.user.toString() === req.user._id.toString();
      if (!isOwner && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Forbidden' });
      }

      const allowed = ['photo', 'specialties', 'availability', 'name'];
      if (req.user.role === 'admin') allowed.push('rating', 'reviewCount', 'isActive');

      const updates = {};
      allowed.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

      const updated = await Employee.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
      res.json({ success: true, data: updated });
    } catch (err) { next(err); }
  }
);

module.exports = router;
