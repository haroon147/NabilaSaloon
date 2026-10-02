const mongoose = require('mongoose');

const AvailabilitySchema = new mongoose.Schema({
  day:   { type: String, required: true }, // e.g. "Monday"
  start: { type: String, required: true }, // e.g. "09:00"
  end:   { type: String, required: true }, // e.g. "18:00"
}, { _id: false });

const EmployeeSchema = new mongoose.Schema({
  // Links to the User document for auth
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  name:        { type: String, required: true },
  photo:       { type: String, default: '' },
  specialties: [{ type: String }],
  rating:      { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  availability:[AvailabilitySchema],
  isActive:    { type: Boolean, default: true },
}, { timestamps: true });

// Virtuals for client-facing id
EmployeeSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
EmployeeSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Employee', EmployeeSchema);
