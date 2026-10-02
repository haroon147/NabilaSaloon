/**
 * Generate available 60-minute time slots for an employee on a given date.
 * Marks slots that are already booked (non-cancelled) as unavailable.
 */
async function getAvailableSlots(employee, dateStr, Booking) {
  const d = new Date(dateStr + 'T00:00:00');
  const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });
  const avail = employee.availability.find(a => a.day === dayName);
  if (!avail) return [];

  // Parse start and end times into total minutes
  const [sh, sm] = avail.start.split(':').map(Number);
  const [eh, em] = avail.end.split(':').map(Number);
  const startMins = sh * 60 + sm;
  const endMins   = eh * 60 + em;

  // Fetch taken slots for this employee+date
  const taken = await Booking.find({
    'employee._id': employee._id,
    date:   dateStr,
    status: { $ne: 'cancelled' },
  }).select('startTime');
  const takenSet = new Set(taken.map(b => b.startTime));

  // Build 60-minute slots
  const slots = [];
  let cur = startMins;
  while (cur + 60 <= endMins) {
    const startTime = `${String(Math.floor(cur / 60)).padStart(2, '0')}:${String(cur % 60).padStart(2, '0')}`;
    const endMin    = cur + 60;
    const endTime   = `${String(Math.floor(endMin / 60)).padStart(2, '0')}:${String(endMin % 60).padStart(2, '0')}`;
    slots.push({ startTime, endTime, isAvailable: !takenSet.has(startTime) });
    cur += 60;
  }
  return slots;
}

module.exports = { getAvailableSlots };
