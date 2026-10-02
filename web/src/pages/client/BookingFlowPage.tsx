import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CheckCircle, Sparkles, Clock, Tag, User as UserIcon, CalendarDays } from 'lucide-react';
import gsap from 'gsap';
import { useAuth } from '../../context/useAuth';
import { useApp } from '../../context/useApp';
import ServiceCard from '../../components/ServiceCard';
import EmployeeCard from '../../components/EmployeeCard';

const STEPS = [
  { label: 'Service',   icon: Tag },
  { label: 'Stylist',   icon: UserIcon },
  { label: 'Date & Time', icon: CalendarDays },
  { label: 'Confirm',   icon: CheckCircle },
];

function StepBar({ current }: { current: number }) {
  return (
    <div className="flex items-center px-6 py-4 bg-surface border-b border-border">
      {STEPS.map(({ label, icon: Icon }, i) => (
        <div key={label} className="flex items-center flex-1 last:flex-none">
          <div className={`flex items-center gap-1.5 transition-all duration-300 ${i === current ? 'text-primary' : i < current ? 'text-success' : 'text-hint'}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all duration-300 ${
              i < current ? 'bg-success text-white' :
              i === current ? 'bg-primary text-white ring-4 ring-primary/20' :
              'bg-border/50 text-hint'
            }`}>
              {i < current ? <CheckCircle size={14} className="fill-white" strokeWidth={0} /> : <Icon size={13} />}
            </div>
            <span className={`text-[11px] font-semibold hidden sm:block ${i === current ? 'text-primary' : i < current ? 'text-success' : 'text-hint'}`}>{label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`flex-1 h-0.5 mx-2 rounded-full transition-all duration-500 ${i < current ? 'bg-success' : 'bg-border'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function BookingFlowPage() {
  const { user } = useAuth();
  const {
    services, employees, loadServices, loadEmployees,
    selectedService, selectedEmployee, selectedDate, selectedSlot,
    availableSlots, loadingSlots, bookingLoading,
    selectService, selectEmployee, selectDate, selectSlot, clearSelection, confirmBooking,
  } = useApp();
  const navigate = useNavigate();

  const [step, setStep] = useState(selectedService ? 1 : 0);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => { loadServices(); loadEmployees(); }, [loadServices, loadEmployees]);

  const animateStep = (direction: 'forward' | 'back') => {
    if (!contentRef.current) return;
    const x = direction === 'forward' ? 40 : -40;
    gsap.fromTo(contentRef.current, { opacity: 0, x }, { opacity: 1, x: 0, duration: 0.35, ease: 'power3.out' });
  };

  const goNext = () => { setStep(s => s + 1); animateStep('forward'); };
  const goBack = () => {
    if (step > 0) { setStep(s => s - 1); animateStep('back'); }
    else navigate('/client/services');
  };

  const canNext = () => {
    if (step === 0) return !!selectedService;
    if (step === 1) return !!selectedEmployee;
    if (step === 2) return !!selectedDate && !!selectedSlot;
    return false;
  };

  const handleConfirm = async () => {
    if (!user) return;
    setError(null);
    const b = await confirmBooking(user.id, user.name);
    if (b) {
      // success animation
      gsap.fromTo('.success-card', { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.5)' });
      setConfirmed(true);
      clearSelection();
    } else {
      setError('Booking failed. Please try again.');
    }
  };

  // 14 available dates from tomorrow
  const dates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return d;
  });

  if (confirmed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-bg">
        <div className="success-card max-w-sm w-full">
          <div className="card p-10 text-center">
            {/* Animated success icon */}
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 bg-green-100 rounded-full animate-pulse-ring" />
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-soft">
                <CheckCircle size={36} className="text-white fill-white" strokeWidth={0} />
              </div>
            </div>
            <h2 className="text-2xl font-extrabold text-tx1 mb-2">All Set! 🎉</h2>
            <p className="text-tx2 text-sm mb-8 leading-relaxed">
              Your appointment has been confirmed. We look forward to seeing you!
            </p>
            <div className="space-y-3">
              <button onClick={() => navigate('/client/bookings')} className="btn-primary w-full">
                View My Bookings
              </button>
              <button onClick={() => { setStep(0); setConfirmed(false); }} className="btn-ghost w-full">
                Book Another Service
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      {/* Step bar */}
      <StepBar current={step} />

      {/* Back button */}
      <div className="flex items-center gap-3 px-6 py-4 max-w-2xl w-full mx-auto">
        <button onClick={goBack} className="btn-ghost p-2 rounded-full -ml-2">
          <ChevronLeft size={20} />
        </button>
        <h1 className="font-bold text-tx1 text-lg">{STEPS[step].label}</h1>
      </div>

      {/* Content */}
      <div ref={contentRef} className="flex-1 px-6 pb-32 max-w-2xl w-full mx-auto">

        {/* ── Step 0: Service ── */}
        {step === 0 && (
          <div>
            <p className="text-tx2 text-sm mb-5">Choose a service you'd like to book</p>
            {services.length === 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => <div key={i} className="rounded-3xl h-52 skeleton" />)}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {services.map((svc, i) => (
                  <div key={svc.id}
                    onClick={() => selectService(svc)}
                    className={`cursor-pointer transition-all duration-200 ${selectedService?.id === svc.id ? 'ring-2 ring-primary rounded-3xl shadow-glow' : ''}`}
                  >
                    <ServiceCard service={svc} compact index={i} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Step 1: Stylist ── */}
        {step === 1 && (
          <div>
            <p className="text-tx2 text-sm mb-5">Pick your preferred stylist</p>
            <div className="space-y-3">
              {employees.map((emp, i) => (
                <EmployeeCard key={emp.id} employee={emp}
                  selected={selectedEmployee?.id === emp.id}
                  onSelect={() => { selectEmployee(emp); if (selectedDate) selectDate(selectedDate); }}
                  index={i} />
              ))}
            </div>
          </div>
        )}

        {/* ── Step 2: Date & Time ── */}
        {step === 2 && (
          <div className="space-y-7">
            <div>
              <p className="font-semibold text-tx1 mb-3">Select Date</p>
              <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
                {dates.map(d => {
                  const iso = d.toISOString().split('T')[0];
                  const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
                  const dayNum = d.getDate();
                  const mon = d.toLocaleDateString('en-US', { month: 'short' });
                  const isSelected = selectedDate === iso;
                  return (
                    <button key={iso} onClick={() => selectDate(iso)}
                      className={`flex-shrink-0 flex flex-col items-center w-14 py-3 rounded-2xl border-2 transition-all duration-200 active:scale-95 ${
                        isSelected
                          ? 'bg-primary border-primary text-white shadow-soft'
                          : 'bg-surface border-border text-tx2 hover:border-primary hover:text-primary'
                      }`}>
                      <span className="text-[10px] font-semibold uppercase tracking-wide">{dayName}</span>
                      <span className="font-extrabold text-xl leading-tight">{dayNum}</span>
                      <span className="text-[10px] opacity-70">{mon}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedDate && (
              <div>
                <p className="font-semibold text-tx1 mb-3">Select Time</p>
                {loadingSlots ? (
                  <div className="grid grid-cols-4 gap-2">
                    {[...Array(8)].map((_, i) => <div key={i} className="h-11 rounded-xl skeleton" />)}
                  </div>
                ) : availableSlots.length === 0 ? (
                  <div className="text-center py-10 bg-rose/50 rounded-2xl">
                    <Clock size={28} className="mx-auto mb-2 text-hint" />
                    <p className="text-tx2 text-sm font-semibold">No slots available</p>
                    <p className="text-hint text-xs mt-1">Try a different date</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-2">
                    {availableSlots.map(slot => {
                      const isSelected = selectedSlot?.startTime === slot.startTime;
                      return (
                        <button key={slot.startTime}
                          disabled={!slot.isAvailable}
                          onClick={() => selectSlot(slot)}
                          className={`py-2.5 text-xs font-bold rounded-xl border-2 transition-all duration-200 active:scale-95 ${
                            !slot.isAvailable
                              ? 'border-border bg-border/20 text-hint cursor-not-allowed line-through'
                              : isSelected
                              ? 'border-primary bg-primary text-white shadow-soft'
                              : 'border-border bg-surface text-tx1 hover:border-primary hover:text-primary'
                          }`}>
                          {slot.startTime}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Step 3: Confirm ── */}
        {step === 3 && selectedService && selectedEmployee && selectedDate && selectedSlot && (
          <div>
            <p className="text-tx2 text-sm mb-5">Review your booking details</p>

            {/* Summary card */}
            <div className="card overflow-hidden mb-5">
              {/* Header */}
              <div className="bg-gradient-to-br from-primary/15 to-rose p-5 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
                    <Sparkles size={22} className="text-primary-dk" />
                  </div>
                  <div>
                    <p className="font-extrabold text-tx1">{selectedService.name}</p>
                    <p className="text-hint text-xs">{selectedService.category}</p>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="p-5 space-y-3.5">
                {[
                  { label: 'Stylist',   value: selectedEmployee.name,   icon: UserIcon },
                  { label: 'Date',      value: new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-PK', { weekday:'long', day:'numeric', month:'long', year:'numeric' }), icon: CalendarDays },
                  { label: 'Time',      value: `${selectedSlot.startTime} – ${selectedSlot.endTime}`, icon: Clock },
                  { label: 'Duration',  value: `${selectedService.durationMinutes} minutes`,           icon: Clock },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-rose flex items-center justify-center flex-shrink-0">
                      <Icon size={14} className="text-primary" />
                    </div>
                    <div className="flex-1 flex justify-between items-center">
                      <span className="text-tx2 text-sm">{label}</span>
                      <span className="font-semibold text-tx1 text-sm text-right max-w-[55%] truncate">{value}</span>
                    </div>
                  </div>
                ))}

                {/* Price row */}
                <div className="pt-3 border-t border-border flex items-center justify-between">
                  <span className="font-bold text-tx1">Total</span>
                  <span className="font-extrabold text-primary text-xl">PKR {selectedService.price.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-danger text-sm font-medium">
                {error}
              </div>
            )}

            <button onClick={handleConfirm} className="btn-primary w-full text-base py-3.5" disabled={bookingLoading}>
              {bookingLoading ? (
                <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Confirming…</span>
              ) : (
                <><CheckCircle size={18} /> Confirm Booking</>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Fixed bottom bar */}
      {step < 3 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-surface/95 backdrop-blur-md border-t border-border">
          <div className="max-w-2xl mx-auto flex items-center gap-3">
            {selectedService && step > 0 && (
              <div className="flex-1 min-w-0">
                <p className="font-bold text-tx1 text-sm truncate">{selectedService.name}</p>
                <p className="text-primary text-xs font-semibold">PKR {selectedService.price.toLocaleString()}</p>
              </div>
            )}
            <button
              onClick={goNext}
              disabled={!canNext()}
              className={`btn-primary flex-shrink-0 ${!selectedService || step === 0 ? 'w-full' : 'px-8'}`}
            >
              Continue <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
