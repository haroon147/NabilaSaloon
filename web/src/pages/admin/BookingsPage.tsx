import { useEffect, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import gsap from 'gsap';
import { useApp } from '../../context/useApp';
import BookingCard from '../../components/BookingCard';
import type { BookingStatus } from '../../types';

const TABS: { value: BookingStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Done' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function BookingsPage() {
  const { bookings, loadingBookings, loadAllBookings, cancelBooking } = useApp();
  const [tab, setTab] = useState<BookingStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => { loadAllBookings(); }, [loadAllBookings]);

  useEffect(() => {
    if (!listRef.current || loadingBookings) return;
    gsap.fromTo(listRef.current.querySelectorAll('.booking-item'),
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.06, ease: 'power3.out' }
    );
  }, [tab, search, loadingBookings, bookings.length]);

  const filtered = bookings
    .filter(b => tab === 'all' || b.status === tab)
    .filter(b => !search ||
      b.clientName?.toLowerCase().includes(search.toLowerCase()) ||
      b.serviceName?.toLowerCase().includes(search.toLowerCase()) ||
      b.employeeName?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => b.date.localeCompare(a.date));

  const counts = Object.fromEntries(
    TABS.map(t => [t.value, t.value === 'all' ? bookings.length : bookings.filter(b => b.status === t.value).length])
  ) as Record<string, number>;

  return (
    <div className="min-h-screen bg-bg">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-bg/95 backdrop-blur-md border-b border-border px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-extrabold text-tx1">All Bookings</h1>
            <span className="badge badge-primary">{bookings.length} total</span>
          </div>
          <div className="relative mb-3">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-hint pointer-events-none" />
            <input className="input pl-10 pr-9" placeholder="Search by client, service, or stylist…"
              value={search} onChange={e => setSearch(e.target.value)} />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-hint hover:text-tx2">
                <X size={14} />
              </button>
            )}
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-none">
            {TABS.map(t => (
              <button key={t.value} onClick={() => setTab(t.value)}
                className={`tab-btn flex-shrink-0 flex items-center gap-1.5${tab === t.value ? ' active' : ''}`}>
                {t.label}
                <span className={`text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1 ${
                  tab === t.value ? 'bg-white/25 text-white' : 'bg-border text-hint'
                }`}>{counts[t.value]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* List */}
      <div className="px-6 pt-5 pb-10 max-w-3xl mx-auto">
        {loadingBookings ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="h-32 rounded-2xl skeleton" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-tx2">
            <p className="font-bold text-tx1">No bookings found</p>
            <p className="text-sm mt-1">Try a different filter or search term</p>
          </div>
        ) : (
          <div ref={listRef} className="space-y-3">
            {filtered.map((b, i) => (
              <div key={b.id} className="booking-item">
                <BookingCard booking={b} onCancel={cancelBooking} showClient index={i} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
