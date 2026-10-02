const express  = require('express');
const { body, param } = require('express-validator');
const Service  = require('../models/Service');
const { protect, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/errorHandler');

const router = express.Router();

// ── GET /api/services ─────────────────────────────────────────────────────────
// Public — no auth required
router.get('/', async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = { isActive: true };
    if (category) filter.category = category;
    const services = await Service.find(filter).sort({ category: 1, name: 1 });
    res.json({ success: true, data: services });
  } catch (err) { next(err); }
});

// ── GET /api/services/:id ─────────────────────────────────────────────────────
router.get('/:id', async (req, res, next) => {
  try {
    const svc = await Service.findById(req.params.id);
    if (!svc) return res.status(404).json({ success: false, message: 'Service not found' });
    res.json({ success: true, data: svc });
  } catch (err) { next(err); }
});

// ── POST /api/services — admin only ──────────────────────────────────────────
router.post('/',
  protect, authorize('admin'),
  [
    body('name').trim().notEmpty().withMessage('Name required'),
    body('category').isIn(['Hair', 'Nails', 'Skin', 'Packages']).withMessage('Invalid category'),
    body('durationMinutes').isInt({ min: 1 }).withMessage('Duration must be a positive integer'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be non-negative'),
    body('description').optional().trim(),
  ],
  validate,
  async (req, res, next) => {
    try {
      const svc = await Service.create(req.body);
      res.status(201).json({ success: true, data: svc });
    } catch (err) { next(err); }
  }
);

// ── PATCH /api/services/:id — admin only ─────────────────────────────────────
router.patch('/:id',
  protect, authorize('admin'),
  async (req, res, next) => {
    try {
      const svc = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!svc) return res.status(404).json({ success: false, message: 'Service not found' });
      res.json({ success: true, data: svc });
    } catch (err) { next(err); }
  }
);

// ── DELETE /api/services/:id — admin only (soft delete) ───────────────────────
router.delete('/:id',
  protect, authorize('admin'),
  async (req, res, next) => {
    try {
      const svc = await Service.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
      if (!svc) return res.status(404).json({ success: false, message: 'Service not found' });
      res.json({ success: true, message: 'Service deactivated' });
    } catch (err) { next(err); }
  }
);

module.exports = router;
