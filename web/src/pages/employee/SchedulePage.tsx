import { useEffect, useRef, useState } from 'react';
import { Clock, CheckCircle } from 'lucide-react';
import gsap from 'gsap';
import { useAuth } from '../../context/useAuth';
import { useApp } from '../../context/useApp';
import BookingCard from '../../components/BookingCard';

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function getWeekDates(): Date[] {
  const today = new Date();
  const day = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (day === 0 ? 6 : day - 1));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

export default function SchedulePage() {
  const { user } = useAuth();
  const { bookings, loadingBookings, loadBookingsForEmployee } = useApp();
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const listRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) loadBookingsForEmployee(user.id);
  }, [user, loadBookingsForEmployee]);

  useEffect(() => {
    if (!headerRef.current) return;
    gsap.fromTo(headerRef.current.querySelectorAll('.day-btn'),
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: 'back.out(1.3)' }
    );
  }, []);

  useEffect(() => {
    if (!listRef.current || loadingBookings) return;
    gsap.fromTo(listRef.current.querySelectorAll('.appt-item'),
      { opacity: 0, x: 30 },
      { opacity: 1, x: 0, duration: 0.4, stagger: 0.08, ease: 'power3.out' }
    );
  }, [selectedDate, loadingBookings, bookings.length]);

  const weekDates = getWeekDates();
  const dayBookings = bookings
    .filter(b => b.date === selectedDate && b.status !== 'cancelled')
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const totalToday = bookings.filter(b => b.date === today && b.status !== 'cancelled').length;

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 max-w-2xl mx-auto">
        <h1 className="text-xl font-extrabold text-tx1">My Schedule</h1>
        <p className="text-tx2 text-sm mt-0.5">
          {totalToday > 0
            ? `${totalToday} appointment${totalToday !== 1 ? 's' : ''} today`
            : 'No appointments today'}
        </p>
      </div>

      {/* Week strip */}
      <div ref={headerRef} className="px-6 max-w-2xl mx-auto mb-5">
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
          {weekDates.map((d, i) => {
            const iso = d.toISOString().split('T')[0];
            const isToday = iso === today;
            const isSelected = iso === selectedDate;
            const hasAppts = bookings.some(b => b.date === iso && b.status !== 'cancelled');

            return (
              <button key={iso} onClick={() => setSelectedDate(iso)}
                className={`day-btn flex-shrink-0 flex flex-col items-center w-14 py-3 rounded-2xl border-2 transition-all duration-200 active:scale-95 ${
                  isSelected
                    ? 'bg-primary border-primary text-white shadow-soft'
                    : isToday
                    ? 'border-primary/40 text-primary bg-rose'
                    : 'bg-surface border-border text-tx2 hover:border-primary/40'
                }`}>
                <span className="text-[10px] font-bold uppercase tracking-wide">{DAY_LABELS[i]}</span>
                <span className={`font-extrabold text-xl leading-tight ${isToday && !isSelected ? 'text-primary' : ''}`}>
                  {d.getDate()}
                </span>
                <div className={`w-1.5 h-1.5 rounded-full mt-0.5 transition-colors ${
                  hasAppts ? (isSelected ? 'bg-white/60' : 'bg-primary') : 'bg-transparent'
                }`} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Appointments */}
      <div className="px-6 pb-10 max-w-2xl mx-auto">
        {loadingBookings ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <div key={i} className="h-32 rounded-2xl skeleton" />)}
          </div>
        ) : dayBookings.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-3xl bg-rose flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-primary/40 animate-float" />
            </div>
            <p className="font-bold text-tx1">No appointments</p>
            <p className="text-tx2 text-sm mt-1">
              {selectedDate === today ? 'Enjoy your day off! 🌸' : 'Nothing scheduled for this day.'}
            </p>
          </div>
        ) : (
          <div>
            <p className="text-sm font-semibold text-tx2 mb-3 flex items-center gap-1.5">
              <Clock size={13} className="text-primary" />
              {dayBookings.length} appointment{dayBookings.length !== 1 ? 's' : ''}
            </p>
            <div ref={listRef} className="space-y-3">
              {dayBookings.map((b, i) => (
                <div key={b.id} className="appt-item">
                  <BookingCard booking={b} showClient index={i} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
