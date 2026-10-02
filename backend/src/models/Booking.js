const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  client: {
    _id:  { type: mongoose.Schema.Types.ObjectId, ref: 'User',     required: true },
    name: { type: String, required: true },
  },
  employee: {
    _id:  { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    name: { type: String, required: true },
  },
  service: {
    _id:  { type: mongoose.Schema.Types.ObjectId, ref: 'Service',  required: true },
    name: { type: String, required: true },
  },
  date:      { type: String, required: true }, // YYYY-MM-DD
  startTime: { type: String, required: true }, // HH:MM
  endTime:   { type: String, required: true }, // HH:MM
  price:     { type: Number, required: true },
  status:    { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'confirmed' },
  notes:     { type: String, default: '' },
}, { timestamps: true });

// Prevent double-booking: same employee, same date, same startTime, non-cancelled
BookingSchema.index({ 'employee._id': 1, date: 1, startTime: 1, status: 1 });

// Shape the response to match the frontend contract
BookingSchema.methods.toClient = function () {
  return {
    id:           this._id,
    clientId:     this.client._id,
    clientName:   this.client.name,
    employeeId:   this.employee._id,
    employeeName: this.employee.name,
    serviceId:    this.service._id,
    serviceName:  this.service.name,
    date:         this.date,
    startTime:    this.startTime,
    endTime:      this.endTime,
    price:        this.price,
    status:       this.status,
    notes:        this.notes,
  };
};

module.exports = mongoose.model('Booking', BookingSchema);
