const express  = require('express');
const { body, param, query } = require('express-validator');
const Booking  = require('../models/Booking');
const Employee = require('../models/Employee');
const Service  = require('../models/Service');
const { protect, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/errorHandler');
const { getAvailableSlots } = require('../utils/slots');

const router = express.Router();

// ── GET /api/bookings ─────────────────────────────────────────────────────────
// Admins get all; clients get their own; employees get their own
router.get('/', protect, async (req, res, next) => {
  try {
    let filter = {};

    if (req.user.role === 'client') {
      filter['client._id'] = req.user._id;
    } else if (req.user.role === 'employee') {
      const emp = await Employee.findOne({ user: req.user._id });
      if (!emp) return res.json({ success: true, data: [] });
      filter['employee._id'] = emp._id;
    }
    // admin: no filter — gets everything

    // Optional status filter
    if (req.query.status) filter.status = req.query.status;
    // Optional date filter
    if (req.query.date) filter.date = req.query.date;

    const bookings = await Booking.find(filter).sort({ date: -1, startTime: -1 });
    res.json({ success: true, data: bookings.map(b => b.toClient()) });
  } catch (err) { next(err); }
});

// ── GET /api/bookings/:id ─────────────────────────────────────────────────────
router.get('/:id',
  protect,
  [param('id').isMongoId()],
  validate,
  async (req, res, next) => {
    try {
      const booking = await Booking.findById(req.params.id);
      if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

      // Only admin, the client, or the employee can read this booking
      const isClient   = booking.client._id.toString() === req.user._id.toString();
      const emp        = await Employee.findOne({ user: req.user._id });
      const isEmployee = emp && booking.employee._id.toString() === emp._id.toString();

      if (!isClient && !isEmployee && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Forbidden' });
      }

      res.json({ success: true, data: booking.toClient() });
    } catch (err) { next(err); }
  }
);

// ── POST /api/bookings ────────────────────────────────────────────────────────
router.post('/',
  protect,
  [
    body('serviceId').isMongoId().withMessage('Valid serviceId required'),
    body('employeeId').isMongoId().withMessage('Valid employeeId required'),
    body('date').matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Date must be YYYY-MM-DD'),
    body('startTime').matches(/^\d{2}:\d{2}$/).withMessage('startTime must be HH:MM'),
    body('notes').optional().trim().isLength({ max: 500 }),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { serviceId, employeeId, date, startTime, notes = '' } = req.body;

      // Load service and employee
      const [service, employee] = await Promise.all([
        Service.findById(serviceId),
        Employee.findById(employeeId),
      ]);
      if (!service)  return res.status(404).json({ success: false, message: 'Service not found' });
      if (!employee) return res.status(404).json({ success: false, message: 'Employee not found' });

      // Validate the slot is actually available
      const slots = await getAvailableSlots(employee, date, Booking);
      const slot = slots.find(s => s.startTime === startTime);
      if (!slot) {
        return res.status(400).json({ success: false, message: 'This time slot is not in the employee schedule' });
      }
      if (!slot.isAvailable) {
        return res.status(409).json({ success: false, message: 'This time slot is already booked' });
      }

      const booking = await Booking.create({
        client:   { _id: req.user._id, name: req.user.name },
        employee: { _id: employee._id, name: employee.name },
        service:  { _id: service._id,  name: service.name  },
        date,
        startTime,
        endTime:  slot.endTime,
        price:    service.price,
        status:   'confirmed',
        notes,
      });

      res.status(201).json({ success: true, data: booking.toClient() });
    } catch (err) { next(err); }
  }
);

// ── PATCH /api/bookings/:id/cancel ───────────────────────────────────────────
router.patch('/:id/cancel',
  protect,
  [param('id').isMongoId()],
  validate,
  async (req, res, next) => {
    try {
      const booking = await Booking.findById(req.params.id);
      if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

      if (['completed', 'cancelled'].includes(booking.status)) {
        return res.status(400).json({ success: false, message: `Cannot cancel a ${booking.status} booking` });
      }

      // Only admin, the booking's client, or the assigned employee can cancel
      const isClient   = booking.client._id.toString() === req.user._id.toString();
      const emp        = await Employee.findOne({ user: req.user._id });
      const isEmployee = emp && booking.employee._id.toString() === emp._id.toString();

      if (!isClient && !isEmployee && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Forbidden' });
      }

      booking.status = 'cancelled';
      await booking.save();

      res.json({ success: true, data: booking.toClient() });
    } catch (err) { next(err); }
  }
);

// ── PATCH /api/bookings/:id/status — admin or employee ───────────────────────
router.patch('/:id/status',
  protect, authorize('admin', 'employee'),
  [
    param('id').isMongoId(),
    body('status').isIn(['pending', 'confirmed', 'completed', 'cancelled']).withMessage('Invalid status'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const booking = await Booking.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true, runValidators: true }
      );
      if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
      res.json({ success: true, data: booking.toClient() });
    } catch (err) { next(err); }
  }
);

module.exports = router;
