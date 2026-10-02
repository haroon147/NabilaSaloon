/**
 * Real REST API client for Phase 3 backend.
 * Swap `mockApi.ts` → `api.ts` import in AuthContext and AppContext to go live.
 */
import type { User, Service, Employee, Booking, TimeSlot, AdminStats } from '../types';

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api';

// ── Token helpers ─────────────────────────────────────────────────────────────
export function getToken(): string | null { return localStorage.getItem('token'); }
export function setToken(t: string)       { localStorage.setItem('token', t); }
export function clearToken()              { localStorage.removeItem('token'); }

// ── Core fetch wrapper ────────────────────────────────────────────────────────
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...((options.headers as Record<string, string>) ?? {}),
    },
  });

  const body = await res.json();
  if (!res.ok) throw new Error(body.message ?? `HTTP ${res.status}`);
  return body;
}

const get  = <T>(path: string)              => request<{ success: true; data: T }>(path);
const post = <T>(path: string, data: unknown) => request<{ success: true; data?: T; token?: string; user?: User }>(path, { method: 'POST', body: JSON.stringify(data) });
const patch = <T>(path: string, data?: unknown) => request<{ success: true; data: T }>(path, { method: 'PATCH', body: JSON.stringify(data ?? {}) });

// ── Auth ──────────────────────────────────────────────────────────────────────
export async function login(email: string, password: string, role: string): Promise<User> {
  const res = await post('/auth/login', { email, password, role });
  if (res.token) setToken(res.token);
  return res.user!;
}

export async function register(params: { name: string; email: string; phone: string; password: string; role: string }): Promise<User> {
  const res = await post('/auth/register', params);
  if (res.token) setToken(res.token);
  return res.user!;
}

export async function getMe(): Promise<User> {
  const res = await get<User>('/auth/me');
  return res.data;
}

export function logout() { clearToken(); }

export async function updateProfile(params: { name?: string; phone?: string; profileImage?: string }): Promise<User> {
  const res = await patch<User>('/auth/profile', params);
  return res.data;
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  await post('/auth/change-password', { currentPassword, newPassword });
}

// ── Services ──────────────────────────────────────────────────────────────────
export async function getServices(): Promise<Service[]> {
  const res = await get<RawService[]>('/services');
  return res.data.map(normalizeService);
}

// ── Employees ─────────────────────────────────────────────────────────────────
export async function getEmployees(): Promise<Employee[]> {
  const res = await get<Employee[]>('/employees');
  return res.data;
}

export async function getAvailableSlots(employeeId: string, date: string): Promise<TimeSlot[]> {
  const res = await get<TimeSlot[]>(`/employees/${employeeId}/slots?date=${date}`);
  return res.data;
}

// ── Bookings ──────────────────────────────────────────────────────────────────
export async function getBookingsForClient(_clientId: string): Promise<Booking[]> {
  const res = await get<RawBooking[]>('/bookings');
  return res.data.map(normalizeBooking);
}

export async function getBookingsForEmployee(_employeeId: string): Promise<Booking[]> {
  const res = await get<RawBooking[]>('/bookings');
  return res.data.map(normalizeBooking);
}

export async function getAllBookings(): Promise<Booking[]> {
  const res = await get<RawBooking[]>('/bookings');
  return res.data.map(normalizeBooking);
}

export async function createBooking(params: {
  clientId: string; clientName: string;
  serviceId: string; serviceName: string;
  employeeId: string; employeeName: string;
  date: string; startTime: string; endTime: string; price: number;
}): Promise<Booking> {
  const res = await post<RawBooking>('/bookings', {
    serviceId:  params.serviceId,
    employeeId: params.employeeId,
    date:       params.date,
    startTime:  params.startTime,
  });
  return normalizeBooking(res.data!);
}

export async function cancelBooking(bookingId: string): Promise<void> {
  await patch(`/bookings/${bookingId}/cancel`);
}

// ── Admin ─────────────────────────────────────────────────────────────────────
export async function getAdminStats(): Promise<AdminStats> {
  const res = await get<AdminStats>('/admin/stats');
  return res.data;
}

// ── Type normalization (backend _id → id) ─────────────────────────────────────
interface RawService { _id: string; id?: string; name: string; description: string; category: string; durationMinutes: number; price: number; image?: string; }
interface RawBooking { id?: string; _id?: string; clientId?: string; clientName?: string; employeeId?: string; employeeName?: string; serviceId?: string; serviceName?: string; date: string; startTime: string; endTime: string; price: number; status: Booking['status']; }

function normalizeService(s: RawService): Service {
  return { id: s.id ?? s._id, name: s.name, description: s.description, category: s.category, durationMinutes: s.durationMinutes, price: s.price, image: s.image };
}
function normalizeBooking(b: RawBooking): Booking {
  return { id: b.id ?? b._id ?? '', clientId: b.clientId ?? '', clientName: b.clientName, employeeId: b.employeeId ?? '', employeeName: b.employeeName, serviceId: b.serviceId ?? '', serviceName: b.serviceName, date: b.date, startTime: b.startTime, endTime: b.endTime, price: b.price, status: b.status };
}
