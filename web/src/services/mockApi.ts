/**
 * Mock API — identical method signatures to the real REST client (Phase 3).
 * Swap this file for a real HTTP client when the backend is ready.
 */
import type { User, Service, Employee, Booking, TimeSlot, AdminStats, BookingStatus } from '../types';
import { SERVICES, EMPLOYEES, MOCK_USERS, SAMPLE_BOOKINGS, ADMIN_STATS } from '../data/mockData';

const delay = (ms = 500) => new Promise(r => setTimeout(r, ms));

let bookings = [...SAMPLE_BOOKINGS];
let nextId = bookings.length + 1;

// ── Auth ──────────────────────────────────────────────────────────────────────

export async function login(email: string, _password: string, role: string): Promise<User> {
  await delay(600);
  const found = MOCK_USERS.find(u => u.role === role);
  if (found) return { ...found, email };
  throw new Error('Invalid credentials');
}

export async function register(params: { name: string; email: string; phone: string; password: string; role: string }): Promise<User> {
  await delay(600);
  return { id: `u_${Date.now()}`, name: params.name, email: params.email, phone: params.phone, role: params.role as User['role'] };
}

// ── Services ──────────────────────────────────────────────────────────────────

export async function getServices(): Promise<Service[]> {
  await delay(400);
  return [...SERVICES];
}

// ── Employees ─────────────────────────────────────────────────────────────────

export async function getEmployees(): Promise<Employee[]> {
  await delay(400);
  return [...EMPLOYEES];
}

// ── Bookings ──────────────────────────────────────────────────────────────────

export async function getBookingsForClient(clientId: string): Promise<Booking[]> {
  await delay(500);
  return bookings.filter(b => b.clientId === clientId);
}

export async function getBookingsForEmployee(employeeId: string): Promise<Booking[]> {
  await delay(500);
  return bookings.filter(b => b.employeeId === employeeId);
}

export async function getAllBookings(): Promise<Booking[]> {
  await delay(500);
  return [...bookings];
}

export async function getAvailableSlots(employeeId: string, date: string): Promise<TimeSlot[]> {
  await delay(400);
  const emp = EMPLOYEES.find(e => e.id === employeeId);
  if (!emp) return [];

  const d = new Date(date);
  const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });
  const avail = emp.availability.find(a => a.day === dayName);
  if (!avail) return [];

  const slots: TimeSlot[] = [];
  let [h, m] = avail.start.split(':').map(Number);
  const [eh, em] = avail.end.split(':').map(Number);
  const endMins = eh * 60 + em;

  while (h * 60 + m + 60 <= endMins) {
    const start = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    const nh = Math.floor((h * 60 + m + 60) / 60);
    const nm = (m + 60) % 60;
    const end = `${String(nh).padStart(2, '0')}:${String(nm).padStart(2, '0')}`;

    const taken = bookings.some(b =>
      b.employeeId === employeeId &&
      b.date === date &&
      b.status !== 'cancelled' &&
      b.startTime === start
    );
    slots.push({ startTime: start, endTime: end, isAvailable: !taken });
    h = nh; m = nm;
  }
  return slots;
}

export async function createBooking(params: {
  clientId: string;
  clientName: string;
  serviceId: string;
  serviceName: string;
  employeeId: string;
  employeeName: string;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
}): Promise<Booking> {
  await delay(700);
  const booking: Booking = { id: `b${++nextId}`, status: 'confirmed', ...params };
  bookings.push(booking);
  return booking;
}

export async function cancelBooking(bookingId: string): Promise<void> {
  await delay(400);
  bookings = bookings.map(b => b.id === bookingId ? { ...b, status: 'cancelled' as BookingStatus } : b);
}

export async function getAdminStats(): Promise<AdminStats> {
  await delay(600);
  return { ...ADMIN_STATS, totalBookings: bookings.length };
}
