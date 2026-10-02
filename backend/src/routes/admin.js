const express  = require('express');
const Booking  = require('../models/Booking');
const User     = require('../models/User');
const Employee = require('../models/Employee');
const Service  = require('../models/Service');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All admin routes require authentication + admin role
router.use(protect, authorize('admin'));

// ── GET /api/admin/stats ──────────────────────────────────────────────────────
router.get('/stats', async (req, res, next) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const now   = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString().split('T')[0];

    const [
      totalBookings,
      todayBookings,
      monthBookings,
      activeClients,
      completedCount,
      totalNonCancelled,
    ] = await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ date: today, status: { $ne: 'cancelled' } }),
      Booking.find({ date: { $gte: monthStart }, status: { $ne: 'cancelled' } }).select('price'),
      User.countDocuments({ role: 'client' }),
      Booking.countDocuments({ status: 'completed' }),
      Booking.countDocuments({ status: { $ne: 'cancelled' } }),
    ]);

    const monthRevenue    = monthBookings.reduce((s, b) => s + b.price, 0);
    const completionRate  = totalNonCancelled > 0
      ? Math.round((completedCount / totalNonCancelled) * 100)
      : 0;

    res.json({
      success: true,
      data: {
        totalBookings,
        todayBookings,
        monthRevenue,
        activeClients,
        completionRate,
      },
    });
  } catch (err) { next(err); }
});

// ── GET /api/admin/users ──────────────────────────────────────────────────────
router.get('/users', async (req, res, next) => {
  try {
    const { role, page = 1, limit = 20 } = req.query;
    const filter = role ? { role } : {};
    const users  = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await User.countDocuments(filter);
    res.json({ success: true, data: users.map(u => u.toPublic()), total, page: Number(page) });
  } catch (err) { next(err); }
});

// ── DELETE /api/admin/users/:id — soft disable ────────────────────────────────
router.delete('/users/:id', async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own account' });
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User removed' });
  } catch (err) { next(err); }
});

// ── GET /api/admin/revenue ────────────────────────────────────────────────────
// Revenue breakdown per employee + per service for the current month
router.get('/revenue', async (req, res, next) => {
  try {
    const now        = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString().split('T')[0];
    const monthEnd   = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      .toISOString().split('T')[0];

    const bookings = await Booking.find({
      date:   { $gte: monthStart, $lte: monthEnd },
      status: { $ne: 'cancelled' },
    });

    // Group by employee
    const byEmployee = {};
    const byService  = {};
    const byDay      = {};

    for (const b of bookings) {
      const eKey = b.employee.name;
      byEmployee[eKey] = (byEmployee[eKey] || 0) + b.price;

      const sKey = b.service.name;
      byService[sKey] = (byService[sKey] || 0) + b.price;

      byDay[b.date] = (byDay[b.date] || 0) + b.price;
    }

    res.json({
      success: true,
      data: {
        total:      bookings.reduce((s, b) => s + b.price, 0),
        byEmployee: Object.entries(byEmployee).map(([name, revenue]) => ({ name, revenue })),
        byService:  Object.entries(byService).map(([name, revenue]) => ({ name, revenue })),
        byDay:      Object.entries(byDay).sort().map(([date, revenue]) => ({ date, revenue })),
      },
    });
  } catch (err) { next(err); }
});

module.exports = router;
