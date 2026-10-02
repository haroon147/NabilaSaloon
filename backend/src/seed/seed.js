/**
 * Database seeder — run with: npm run seed
 * Creates all services, employee users + profiles, a demo client, admin, and sample bookings.
 */
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const User     = require('../models/User');
const Employee = require('../models/Employee');
const Service  = require('../models/Service');
const Booking  = require('../models/Booking');

// ── Seed data ──────────────────────────────────────────────────────────────────
const SERVICES_DATA = [
  { name: "Women's Haircut & Style",    description: 'Precision cut tailored to your face shape, finished with a blow-dry and style.',               category: 'Hair',     durationMinutes: 60,  price: 2500  },
  { name: 'Hair Coloring',               description: 'Full head color using premium ammonia-free dyes. Includes toner and conditioning treatment.',   category: 'Hair',     durationMinutes: 120, price: 6500  },
  { name: 'Balayage & Highlights',       description: 'Hand-painted highlights for a natural sun-kissed look. Includes toning.',                       category: 'Hair',     durationMinutes: 150, price: 9000  },
  { name: 'Keratin Smoothing Treatment', description: 'Eliminate frizz and add shine for up to 4 months with our keratin formula.',                   category: 'Hair',     durationMinutes: 180, price: 12000 },
  { name: 'Blow Dry & Styling',          description: 'Professional blow-dry with your choice of finish — straight, wavy, or voluminous.',            category: 'Hair',     durationMinutes: 45,  price: 1800  },
  { name: 'Classic Manicure',            description: 'Nail shaping, cuticle care, hand massage, and your choice of polish.',                         category: 'Nails',    durationMinutes: 45,  price: 1200  },
  { name: 'Gel Pedicure',                description: 'Relaxing foot soak, exfoliation, massage, and long-lasting gel polish.',                       category: 'Nails',    durationMinutes: 60,  price: 1800  },
  { name: 'Hydrating Facial',            description: 'Deep-cleanse, exfoliation, mask, and moisturiser for glowing skin.',                           category: 'Skin',     durationMinutes: 75,  price: 3500  },
  { name: 'Threading & Brow Shaping',    description: 'Precise brow threading and shaping to frame your face perfectly.',                             category: 'Skin',     durationMinutes: 20,  price: 500   },
  { name: 'Bridal Package',              description: 'Full bridal glam: hair styling, makeup, manicure, pedicure, and brow shaping.',                category: 'Packages', durationMinutes: 300, price: 25000 },
];

const EMPLOYEE_USERS = [
  {
    user:         { name: 'Zara Ahmed',  email: 'zara@nabilasalon.com',  password: 'employee123', phone: '0300-2222222', role: 'employee' },
    specialties:  ['Hair Coloring', 'Balayage', 'Keratin Treatment'],
    rating:       4.9, reviewCount: 124,
    availability: [
      { day: 'Monday',    start: '09:00', end: '18:00' },
      { day: 'Tuesday',   start: '09:00', end: '18:00' },
      { day: 'Wednesday', start: '09:00', end: '18:00' },
      { day: 'Thursday',  start: '09:00', end: '18:00' },
      { day: 'Friday',    start: '10:00', end: '17:00' },
    ],
  },
  {
    user:         { name: 'Layla Hassan', email: 'layla@nabilasalon.com', password: 'employee123', phone: '0300-3333333', role: 'employee' },
    specialties:  ['Manicure', 'Pedicure', 'Nail Art', 'Gel Extensions'],
    rating:       4.8, reviewCount: 98,
    availability: [
      { day: 'Monday',    start: '10:00', end: '19:00' },
      { day: 'Tuesday',   start: '10:00', end: '19:00' },
      { day: 'Thursday',  start: '10:00', end: '19:00' },
      { day: 'Friday',    start: '10:00', end: '19:00' },
      { day: 'Saturday',  start: '09:00', end: '20:00' },
    ],
  },
  {
    user:         { name: 'Nadia Khan', email: 'nadia@nabilasalon.com', password: 'employee123', phone: '0300-4444444', role: 'employee' },
    specialties:  ['Facial', 'Skin Care', 'Threading', 'Waxing'],
    rating:       4.7, reviewCount: 87,
    availability: [
      { day: 'Tuesday',   start: '09:00', end: '17:00' },
      { day: 'Wednesday', start: '09:00', end: '17:00' },
      { day: 'Thursday',  start: '09:00', end: '17:00' },
      { day: 'Saturday',  start: '10:00', end: '18:00' },
      { day: 'Sunday',    start: '10:00', end: '16:00' },
    ],
  },
  {
    user:         { name: 'Aisha Malik', email: 'aisha@nabilasalon.com', password: 'employee123', phone: '0300-5555555', role: 'employee' },
    specialties:  ['Bridal Styling', 'Makeup', 'Hair Styling', 'Blow Dry'],
    rating:       4.9, reviewCount: 156,
    availability: [
      { day: 'Monday',    start: '09:00', end: '18:00' },
      { day: 'Wednesday', start: '09:00', end: '18:00' },
      { day: 'Friday',    start: '09:00', end: '18:00' },
      { day: 'Saturday',  start: '09:00', end: '20:00' },
      { day: 'Sunday',    start: '10:00', end: '17:00' },
    ],
  },
  {
    user:         { name: 'Fatima Ali', email: 'fatima@nabilasalon.com', password: 'employee123', phone: '0300-6666666', role: 'employee' },
    specialties:  ['Haircut', 'Blow Dry', 'Manicure', 'Threading'],
    rating:       4.6, reviewCount: 72,
    availability: [
      { day: 'Monday',    start: '11:00', end: '20:00' },
      { day: 'Tuesday',   start: '11:00', end: '20:00' },
      { day: 'Wednesday', start: '11:00', end: '20:00' },
      { day: 'Friday',    start: '11:00', end: '20:00' },
      { day: 'Saturday',  start: '10:00', end: '19:00' },
    ],
  },
];

async function seed() {
  console.log('🌱  Connecting to MongoDB…');
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
  console.log('✅  Connected\n');

  // ── Wipe existing data ────────────────────────────────────────────────────
  console.log('🗑️   Clearing existing data…');
  await Promise.all([
    Booking.deleteMany({}),
    Employee.deleteMany({}),
    Service.deleteMany({}),
    User.deleteMany({}),
  ]);

  // ── Services ──────────────────────────────────────────────────────────────
  console.log('📋  Seeding services…');
  const services = await Service.insertMany(SERVICES_DATA);
  console.log(`    ✓ ${services.length} services`);

  // ── Admin user ────────────────────────────────────────────────────────────
  console.log('👑  Creating admin…');
  const admin = await User.create({
    name: 'Nabila Admin', email: 'admin@nabilasalon.com',
    password: 'admin123', phone: '0300-1111111', role: 'admin',
  });
  console.log('    ✓ admin@nabilasalon.com  /  admin123');

  // ── Demo client ───────────────────────────────────────────────────────────
  console.log('💅  Creating demo client…');
  const client = await User.create({
    name: 'Sara Khan', email: 'sara@demo.com',
    password: 'client123', phone: '0300-0000001', role: 'client',
  });
  console.log('    ✓ sara@demo.com  /  client123');

  // ── Employees ─────────────────────────────────────────────────────────────
  console.log('✂️   Creating employees…');
  const employeeRecords = [];
  for (const { user: userData, specialties, rating, reviewCount, availability } of EMPLOYEE_USERS) {
    const user = await User.create(userData);
    const emp  = await Employee.create({
      user: user._id,
      name: user.name,
      specialties,
      rating,
      reviewCount,
      availability,
    });
    employeeRecords.push({ user, emp });
    console.log(`    ✓ ${user.email}  /  employee123`);
  }

  // ── Sample bookings ───────────────────────────────────────────────────────
  console.log('📅  Creating sample bookings…');

  // Helpers
  const svcMap  = Object.fromEntries(services.map(s => [s.name, s]));
  const empMap  = Object.fromEntries(employeeRecords.map(({ user, emp }) => [user.name, emp]));

  // Upcoming date helpers
  const future = (days) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  };
  const past = (days) => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d.toISOString().split('T')[0];
  };

  const sampleBookings = [
    {
      client:    { _id: client._id, name: client.name },
      employee:  { _id: empMap['Zara Ahmed']._id,  name: 'Zara Ahmed'  },
      service:   { _id: svcMap['Hair Coloring']._id, name: 'Hair Coloring' },
      date: future(5), startTime: '10:00', endTime: '12:00',
      price: 6500, status: 'confirmed',
    },
    {
      client:    { _id: client._id, name: client.name },
      employee:  { _id: empMap['Layla Hassan']._id, name: 'Layla Hassan' },
      service:   { _id: svcMap['Classic Manicure']._id, name: 'Classic Manicure' },
      date: future(8), startTime: '14:00', endTime: '14:45',
      price: 1200, status: 'pending',
    },
    {
      client:    { _id: client._id, name: client.name },
      employee:  { _id: empMap['Aisha Malik']._id, name: 'Aisha Malik' },
      service:   { _id: svcMap['Bridal Package']._id, name: 'Bridal Package' },
      date: past(10), startTime: '09:00', endTime: '14:00',
      price: 25000, status: 'completed',
    },
    {
      client:    { _id: client._id, name: client.name },
      employee:  { _id: empMap['Nadia Khan']._id, name: 'Nadia Khan' },
      service:   { _id: svcMap['Hydrating Facial']._id, name: 'Hydrating Facial' },
      date: past(20), startTime: '11:00', endTime: '12:15',
      price: 3500, status: 'completed',
    },
    {
      client:    { _id: client._id, name: client.name },
      employee:  { _id: empMap['Fatima Ali']._id, name: 'Fatima Ali' },
      service:   { _id: svcMap["Women's Haircut & Style"]._id, name: "Women's Haircut & Style" },
      date: past(5), startTime: '15:00', endTime: '16:00',
      price: 2500, status: 'cancelled',
    },
    // Extra bookings for different clients (admin view variety)
    {
      client:    { _id: admin._id, name: 'Amna Raza' },
      employee:  { _id: empMap['Zara Ahmed']._id, name: 'Zara Ahmed' },
      service:   { _id: svcMap['Balayage & Highlights']._id, name: 'Balayage & Highlights' },
      date: future(3), startTime: '11:00', endTime: '13:30',
      price: 9000, status: 'confirmed',
    },
    {
      client:    { _id: admin._id, name: 'Hira Baig' },
      employee:  { _id: empMap['Layla Hassan']._id, name: 'Layla Hassan' },
      service:   { _id: svcMap['Gel Pedicure']._id, name: 'Gel Pedicure' },
      date: future(2), startTime: '15:00', endTime: '16:00',
      price: 1800, status: 'pending',
    },
  ];

  const bookings = await Booking.insertMany(sampleBookings);
  console.log(`    ✓ ${bookings.length} bookings`);

  console.log('\n✅  Seed complete!\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  Demo Credentials');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  CLIENT   sara@demo.com           / client123');
  console.log('  EMPLOYEE zara@nabilasalon.com    / employee123');
  console.log('  ADMIN    admin@nabilasalon.com   / admin123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error('❌  Seed failed:', err.message);
  process.exit(1);
});
