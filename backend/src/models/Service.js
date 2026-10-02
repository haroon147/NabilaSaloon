const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  name:            { type: String, required: true, trim: true },
  description:     { type: String, default: '' },
  category:        { type: String, enum: ['Hair', 'Nails', 'Skin', 'Packages'], required: true },
  durationMinutes: { type: Number, required: true, min: 1 },
  price:           { type: Number, required: true, min: 0 },
  image:           { type: String, default: '' },
  isActive:        { type: Boolean, default: true },
}, { timestamps: true });

ServiceSchema.virtual('id').get(function () { return this._id.toHexString(); });
ServiceSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Service', ServiceSchema);
