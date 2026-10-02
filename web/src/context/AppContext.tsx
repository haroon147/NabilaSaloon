import { useState, useCallback, type ReactNode } from 'react';
import type { Service, Employee, Booking, TimeSlot } from '../types';
import * as mockApi from '../services/mockApi';
import * as realApi from '../services/api';
import { AppContext } from './appContextValue';

const USE_BACKEND = import.meta.env.VITE_USE_BACKEND === 'true';
const api = USE_BACKEND ? realApi : mockApi;

export function AppProvider({ children }: { children: ReactNode }) {
  const [services,  setServices]  = useState<Service[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [bookings,  setBookings]  = useState<Booking[]>([]);
  const [loadingServices,  setLoadingServices]  = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [loadingBookings,  setLoadingBookings]  = useState(false);

  const [selectedService,  setSelectedService]  = useState<Service | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedDate,     setSelectedDate]     = useState<string | null>(null);
  const [selectedSlot,     setSelectedSlot]     = useState<TimeSlot | null>(null);
  const [availableSlots,   setAvailableSlots]   = useState<TimeSlot[]>([]);
  const [loadingSlots,     setLoadingSlots]     = useState(false);
  const [bookingLoading,   setBookingLoading]   = useState(false);

  const loadServices = useCallback(async () => {
    if (services.length) return;
    setLoadingServices(true);
    try { setServices(await api.getServices()); } finally { setLoadingServices(false); }
  }, [services.length]);

  const loadEmployees = useCallback(async () => {
    if (employees.length) return;
    setLoadingEmployees(true);
    try { setEmployees(await api.getEmployees()); } finally { setLoadingEmployees(false); }
  }, [employees.length]);

  const loadBookingsForClient = useCallback(async (id: string) => {
    setLoadingBookings(true);
    try { setBookings(await api.getBookingsForClient(id)); } finally { setLoadingBookings(false); }
  }, []);

  const loadBookingsForEmployee = useCallback(async (id: string) => {
    setLoadingBookings(true);
    try { setBookings(await api.getBookingsForEmployee(id)); } finally { setLoadingBookings(false); }
  }, []);

  const loadAllBookings = useCallback(async () => {
    setLoadingBookings(true);
    try { setBookings(await api.getAllBookings()); } finally { setLoadingBookings(false); }
  }, []);

  const cancelBooking = useCallback(async (id: string) => {
    await api.cancelBooking(id);
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' as const } : b));
  }, []);

  const selectDate = useCallback(async (date: string) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    if (!selectedEmployee) return;
    setLoadingSlots(true);
    try { setAvailableSlots(await api.getAvailableSlots(selectedEmployee.id, date)); }
    finally { setLoadingSlots(false); }
  }, [selectedEmployee]);

  const clearSelection = () => {
    setSelectedService(null); setSelectedEmployee(null);
    setSelectedDate(null); setSelectedSlot(null); setAvailableSlots([]);
  };

  const confirmBooking = async (clientId: string, clientName: string): Promise<Booking | null> => {
    if (!selectedService || !selectedEmployee || !selectedDate || !selectedSlot) return null;
    setBookingLoading(true);
    try {
      const b = await api.createBooking({
        clientId, clientName,
        serviceId:   selectedService.id,
        serviceName: selectedService.name,
        employeeId:  selectedEmployee.id,
        employeeName: selectedEmployee.name,
        date:      selectedDate,
        startTime: selectedSlot.startTime,
        endTime:   selectedSlot.endTime,
        price:     selectedService.price,
      });
      setBookings(prev => [...prev, b]);
      return b;
    } catch { return null; }
    finally { setBookingLoading(false); }
  };

  return (
    <AppContext.Provider value={{
      services, employees, bookings,
      loadingServices, loadingEmployees, loadingBookings,
      loadServices, loadEmployees,
      loadBookingsForClient, loadBookingsForEmployee, loadAllBookings, cancelBooking,
      selectedService, selectedEmployee, selectedDate, selectedSlot,
      availableSlots, loadingSlots, bookingLoading,
      selectService: setSelectedService, selectEmployee: setSelectedEmployee,
      selectDate, selectSlot: setSelectedSlot, clearSelection, confirmBooking,
    }}>
      {children}
    </AppContext.Provider>
  );
}
