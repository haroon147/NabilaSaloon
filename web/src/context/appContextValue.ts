import { createContext } from 'react';
import type { Service, Employee, Booking, TimeSlot } from '../types';

export interface AppCtx {
  services: Service[];
  employees: Employee[];
  bookings: Booking[];
  loadingServices: boolean;
  loadingEmployees: boolean;
  loadingBookings: boolean;
  loadServices: () => Promise<void>;
  loadEmployees: () => Promise<void>;
  loadBookingsForClient: (id: string) => Promise<void>;
  loadBookingsForEmployee: (id: string) => Promise<void>;
  loadAllBookings: () => Promise<void>;
  cancelBooking: (id: string) => Promise<void>;
  selectedService: Service | null;
  selectedEmployee: Employee | null;
  selectedDate: string | null;
  selectedSlot: TimeSlot | null;
  availableSlots: TimeSlot[];
  loadingSlots: boolean;
  bookingLoading: boolean;
  selectService: (s: Service | null) => void;
  selectEmployee: (e: Employee | null) => void;
  selectDate: (date: string) => Promise<void>;
  selectSlot: (slot: TimeSlot) => void;
  clearSelection: () => void;
  confirmBooking: (clientId: string, clientName: string) => Promise<Booking | null>;
}

export const AppContext = createContext<AppCtx>(null!);
