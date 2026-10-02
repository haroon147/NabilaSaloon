import { useEffect, useRef } from 'react';
import { Star, CalendarDays, TrendingUp } from 'lucide-react';
import gsap from 'gsap';
import { useApp } from '../../context/useApp';

const AVATAR_GRADIENTS = [
  'from-primary to-primary-dk',
  'from-pink-400 to-rose-600',
  'from-amber-400 to-orange-500',
  'from-purple-400 to-violet-600',
  'from-teal-400 to-cyan-600',
];

export default function TeamPage() {
  const { employees, loadEmployees, bookings, loadAllBookings } = useApp();
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => { loadEmployees(); loadAllBookings(); }, [loadEmployees, loadAllBookings]);

  useEffect(() => {
    if (!gridRef.current || employees.length === 0) return;
    gsap.fromTo(gridRef.current.querySelectorAll('.team-card'),
      { opacity: 0, y: 40, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.3)' }
    );
  }, [employees.length]);

  return (
    <div className="min-h-screen bg-bg">
      <div className="px-6 pt-6 pb-4 max-w-4xl mx-auto">
        <h1 className="text-xl font-extrabold text-tx1">Team</h1>
        <p className="text-tx2 text-sm mt-0.5">{employees.length} talented staff members</p>
      </div>

      <div ref={gridRef} className="px-6 pb-10 max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-5">
        {employees.length === 0 ? (
          [...Array(4)].map((_, i) => <div key={i} className="h-52 rounded-3xl skeleton" />)
        ) : employees.map((emp, i) => {
          const empBookings = bookings.filter(b => b.employeeId === emp.id && b.status !== 'cancelled');
          const revenue = empBookings.reduce((s, b) => s + b.price, 0);
          const completedCount = bookings.filter(b => b.employeeId === emp.id && b.status === 'completed').length;
          const gradient = AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length];

          return (
            <div key={emp.id} className="team-card card p-5 overflow-hidden relative">
              {/* Background accent */}
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${gradient} opacity-5 rounded-bl-[60px]`} />

              <div className="flex items-start gap-4 relative">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0 shadow-soft`}>
                  <span className="text-white font-extrabold text-2xl">{emp.name[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-extrabold text-tx1 text-base">{emp.name}</h3>
                  <div className="flex items-center gap-1 mt-0.5 mb-2">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} size={11}
                        className={j < Math.round(emp.rating) ? 'text-amber-400 fill-amber-400' : 'text-border fill-border'} />
                    ))}
                    <span className="text-[11px] text-hint ml-1 font-medium">{emp.rating} · {emp.reviewCount} reviews</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {emp.specialties.slice(0, 3).map(s => (
                      <span key={s} className="badge badge-primary">{s}</span>
                    ))}
                    {emp.specialties.length > 3 && (
                      <span className="badge badge-hint">+{emp.specialties.length - 3}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-border">
                <div className="text-center">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-1">
                    <CalendarDays size={13} className="text-primary" />
                  </div>
                  <p className="font-extrabold text-tx1 text-base">{empBookings.length}</p>
                  <p className="text-hint text-[10px]">Bookings</p>
                </div>
                <div className="text-center">
                  <div className="w-7 h-7 rounded-lg bg-success/10 flex items-center justify-center mx-auto mb-1">
                    <Star size={13} className="text-success" />
                  </div>
                  <p className="font-extrabold text-tx1 text-base">{completedCount}</p>
                  <p className="text-hint text-[10px]">Done</p>
                </div>
                <div className="text-center">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center mx-auto mb-1">
                    <TrendingUp size={13} className="text-emerald-600" />
                  </div>
                  <p className="font-extrabold text-tx1 text-sm">
                    {revenue >= 1000 ? `${(revenue / 1000).toFixed(0)}k` : revenue}
                  </p>
                  <p className="text-hint text-[10px]">PKR Rev.</p>
                </div>
              </div>

              {/* Availability days */}
              <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-border">
                {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(day => {
                  const avail = emp.availability.find(a => a.day === day);
                  return (
                    <div key={day} title={avail ? `${avail.start}–${avail.end}` : 'Off'}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${avail ? 'bg-primary/10 text-primary' : 'bg-border/40 text-hint line-through'}`}>
                      {day.slice(0, 3)}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
