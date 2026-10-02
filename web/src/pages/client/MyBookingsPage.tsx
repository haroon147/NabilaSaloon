import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarPlus, BookOpen } from 'lucide-react';
import gsap from 'gsap';
import { useAuth } from '../../context/useAuth';
import { useApp } from '../../context/useApp';
import BookingCard from '../../components/BookingCard';
import type { BookingStatus } from '../../types';

const TABS: { value: BookingStatus | 'all'; label: string; color: string }[] = [
  { value: 'all',       label: 'All',       color: 'bg-tx1' },
  { value: 'confirmed', label: 'Confirmed', color: 'bg-primary' },
  { value: 'pending',   label: 'Pending',   color: 'bg-warning' },
  { value: 'completed', label: 'Done',      color: 'bg-success' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-danger' },
];

export default function MyBookingsPage() {
  const { user } = useAuth();
  const { bookings, loadingBookings, loadBookingsForClient, cancelBooking } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState<BookingStatus | 'all'>('all');
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) loadBookingsForClient(user.id);
  }, [user, loadBookingsForClient]);

  useEffect(() => {
    if (!listRef.current || loadingBookings) return;
    gsap.fromTo(listRef.current.querySelectorAll('.booking-item'),
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.4, stagger: 0.07, ease: 'power3.out' }
    );
  }, [tab, loadingBookings, bookings.length]);

  const filtered = (tab === 'all' ? bookings : bookings.filter(b => b.status === tab))
    .sort((a, b) => b.date.localeCompare(a.date));

  const counts = {
    all: bookings.length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    pending: bookings.filter(b => b.status === 'pending').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  };

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-xl font-extrabold text-tx1">My Bookings</h1>
          <button
            onClick={() => navigate('/client/services')}
            className="btn-primary text-sm py-2 px-4"
          >
            <CalendarPlus size={15} /> New
          </button>
        </div>
        <p className="text-tx2 text-sm">{bookings.length} total appointments</p>
      </div>

      {/* Tabs */}
      <div className="px-6 max-w-2xl mx-auto">
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1 mb-5">
          {TABS.map(t => (
            <button key={t.value} onClick={() => setTab(t.value)}
              className={`tab-btn flex-shrink-0 flex items-center gap-1.5${tab === t.value ? ' active' : ''}`}>
              {t.label}
              {counts[t.value] > 0 && (
                <span className={`text-[10px] font-bold w-4.5 h-4.5 w-5 h-5 flex items-center justify-center rounded-full ${
                  tab === t.value ? 'bg-white/25 text-white' : 'bg-border text-hint'
                }`}>
                  {counts[t.value]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="px-6 pb-10 max-w-2xl mx-auto">
        {loadingBookings ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => <div key={i} className="h-32 rounded-2xl skeleton" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-3xl bg-rose flex items-center justify-center mx-auto mb-5">
              <BookOpen size={32} className="text-primary/60 animate-float" />
            </div>
            <p className="font-bold text-tx1 text-base mb-1">
              {tab === 'all' ? 'No bookings yet' : `No ${tab} bookings`}
            </p>
            <p className="text-tx2 text-sm mb-6">Ready to schedule your next appointment?</p>
            <button onClick={() => navigate('/client/services')} className="btn-primary">
              <CalendarPlus size={16} /> Book a Service
            </button>
          </div>
        ) : (
          <div ref={listRef} className="space-y-3">
            {filtered.map((b, i) => (
              <div key={b.id} className="booking-item">
                <BookingCard booking={b} onCancel={cancelBooking} index={i} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
