const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name:  { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6, select: false },
  phone: { type: String, default: '' },
  role:  { type: String, enum: ['client', 'employee', 'admin'], default: 'client' },
  profileImage: { type: String, default: '' },
}, { timestamps: true });

// Hash password before save (Mongoose 9 async pre-hooks: no next() callback)
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// Compare passwords
UserSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

// Public projection (strip password)
UserSchema.methods.toPublic = function () {
  return {
    id:           this._id,
    name:         this.name,
    email:        this.email,
    phone:        this.phone,
    role:         this.role,
    profileImage: this.profileImage,
  };
};

module.exports = mongoose.model('User', UserSchema);
