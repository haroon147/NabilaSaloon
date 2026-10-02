import { useRef } from 'react';
import { Calendar, Clock, User, Tag, X, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { gsap } from '../hooks/useGSAP';
import type { Booking, BookingStatus } from '../types';

const STATUS_CONFIG: Record<BookingStatus, {
  label: string; barColor: string; badgeClass: string; Icon: React.ElementType;
}> = {
  pending:   { label: 'Pending',   barColor: 'bg-warning',  badgeClass: 'badge badge-warning', Icon: Loader },
  confirmed: { label: 'Confirmed', barColor: 'bg-primary',  badgeClass: 'badge badge-primary', Icon: AlertCircle },
  completed: { label: 'Done',      barColor: 'bg-success',  badgeClass: 'badge badge-success', Icon: CheckCircle },
  cancelled: { label: 'Cancelled', barColor: 'bg-danger',   badgeClass: 'badge badge-danger',  Icon: X },
};

interface Props {
  booking: Booking;
  onCancel?: (id: string) => void;
  showClient?: boolean;
  index?: number;
}

export default function BookingCard({ booking, onCancel, showClient, index = 0 }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const cfg = STATUS_CONFIG[booking.status];

  const date = new Date(booking.date + 'T00:00:00');
  const dateStr = date.toLocaleDateString('en-PK', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  });

  const handleCancel = () => {
    if (!cardRef.current || !onCancel) return;
    gsap.to(cardRef.current, {
      opacity: 0, x: -30, height: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0,
      duration: 0.4, ease: 'power2.in',
      onComplete: () => onCancel(booking.id),
    });
  };

  return (
    <div
      ref={cardRef}
      style={{ animationDelay: `${index * 60}ms` }}
      className="overflow-hidden rounded-2xl shadow-card bg-surface will-change-transform flex"
    >
      {/* Left accent bar */}
      <div className={`w-1 flex-shrink-0 ${cfg.barColor}`} />

      <div className="flex-1 p-4 min-w-0">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <p className="font-bold text-tx1 text-sm leading-tight truncate">{booking.serviceName}</p>
            {showClient && (
              <p className="text-hint text-xs mt-0.5 flex items-center gap-1">
                <User size={10} /> {booking.clientName}
              </p>
            )}
          </div>
          <span className={`flex-shrink-0 ${cfg.badgeClass} flex items-center gap-1`}>
            <cfg.Icon size={9} />
            {cfg.label}
          </span>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-2 gap-y-1.5 gap-x-4 text-xs text-tx2">
          <div className="flex items-center gap-1.5">
            <Calendar size={12} className="text-hint flex-shrink-0" />
            <span className="truncate">{dateStr}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={12} className="text-hint flex-shrink-0" />
            <span>{booking.startTime} – {booking.endTime}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <User size={12} className="text-hint flex-shrink-0" />
            <span className="truncate">{booking.employeeName}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Tag size={12} className="text-hint flex-shrink-0" />
            <span className="font-bold text-tx1">PKR {booking.price.toLocaleString()}</span>
          </div>
        </div>

        {/* Footer */}
        {(booking.status === 'pending' || booking.status === 'confirmed') && onCancel && (
          <div className="mt-3 pt-3 border-t border-border">
            <button
              onClick={handleCancel}
              className="flex items-center gap-1.5 text-danger text-xs font-semibold hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors border border-red-100"
            >
              <X size={12} /> Cancel Booking
            </button>
          </div>
        )}
        {booking.status === 'completed' && (
          <div className="mt-3 pt-3 border-t border-border flex items-center gap-1.5">
            <CheckCircle size={13} className="text-success" />
            <span className="text-xs text-success font-semibold">Service completed</span>
          </div>
        )}
      </div>
    </div>
  );
}
