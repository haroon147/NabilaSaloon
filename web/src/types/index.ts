export type UserRole = 'client' | 'employee' | 'admin';
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  profileImage?: string;
}

export interface AvailabilitySlot {
  day: string;
  start: string;
  end: string;
}

export interface Employee {
  id: string;
  userId?: string;
  name: string;
  photo?: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
  availability: AvailabilitySlot[];
}

export interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  durationMinutes: number;
  price: number;
  image?: string;
}

export interface Booking {
  id: string;
  clientId: string;
  clientName?: string;
  employeeId: string;
  employeeName?: string;
  serviceId: string;
  serviceName?: string;
  date: string;        // YYYY-MM-DD
  startTime: string;   // HH:MM
  endTime: string;     // HH:MM
  status: BookingStatus;
  price: number;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface Review {
  id: string;
  bookingId: string;
  employeeId: string;
  rating: number;
  comment: string;
}

export interface AdminStats {
  totalBookings: number;
  todayBookings: number;
  monthRevenue: number;
  activeClients: number;
  completionRate: number;
}
