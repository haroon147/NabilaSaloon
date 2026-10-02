import { useEffect, useRef, useState } from 'react';
import { Clock, CheckCircle } from 'lucide-react';
import gsap from 'gsap';
import { useAuth } from '../../context/useAuth';
import { useApp } from '../../context/useApp';

const ALL_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function AvailabilityPage() {
  const { user } = useAuth();
  const { employees, loadEmployees } = useApp();
  const [saved, setSaved] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => { loadEmployees(); }, [loadEmployees]);

  useEffect(() => {
    if (!pageRef.current) return;
    gsap.fromTo(pageRef.current.querySelectorAll('.avail-row'),
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 0.4, stagger: 0.07, ease: 'power3.out' }
    );
  }, [employees.length]);

  const me = employees.find(e => e.id === user?.id || e.userId === user?.id);

  const handleSave = () => {
    setSaved(true);
    gsap.fromTo('.save-btn', { scale: 0.95 }, { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.5)' });
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div ref={pageRef} className="min-h-screen bg-bg">
      <div className="px-6 pt-6 pb-4 max-w-md mx-auto">
        <h1 className="text-xl font-extrabold text-tx1">My Availability</h1>
        <p className="text-tx2 text-sm mt-0.5">Your weekly working schedule</p>
      </div>

      <div className="px-6 pb-10 max-w-md mx-auto space-y-3">
        {!me ? (
          [...Array(5)].map((_, i) => <div key={i} className="h-16 rounded-2xl skeleton" />)
        ) : (
          <>
            {ALL_DAYS.map(day => {
              const slot = me.availability.find(a => a.day === day);
              return (
                <div key={day} className={`avail-row card p-4 flex items-center justify-between ${!slot ? 'opacity-50' : ''}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${slot ? 'bg-success' : 'bg-border'}`} />
                    <span className="font-bold text-tx1 text-sm">{day}</span>
                    {!slot && <span className="badge badge-hint text-[10px]">Off</span>}
                  </div>
                  {slot ? (
                    <div className="flex items-center gap-2 text-sm text-tx2 bg-rose px-3 py-1.5 rounded-xl">
                      <Clock size={12} className="text-hint" />
                      <span className="font-semibold">{slot.start}</span>
                      <span className="text-hint">–</span>
                      <span className="font-semibold">{slot.end}</span>
                    </div>
                  ) : (
                    <span className="text-hint text-xs">Day off</span>
                  )}
                </div>
              );
            })}

            {/* Specialties */}
            <div className="card p-5 mt-2">
              <h3 className="font-bold text-tx1 text-sm mb-3">My Specialties</h3>
              <div className="flex flex-wrap gap-2">
                {me.specialties.map(s => (
                  <span key={s} className="badge badge-primary">{s}</span>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="card p-4 bg-rose border border-border">
              <div className="flex items-center gap-2 text-sm text-tx2">
                <CheckCircle size={15} className="text-primary flex-shrink-0" />
                <span><strong className="text-tx1">{me.availability.length} days</strong> per week · Contact management to update schedule</span>
              </div>
            </div>

            <button onClick={handleSave} className="save-btn btn-primary w-full py-3.5 text-base">
              {saved ? <><CheckCircle size={18} /> Schedule Updated!</> : 'Save Changes'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
