import { useRef } from 'react';
import { Star, CheckCircle } from 'lucide-react';
import { gsap } from '../hooks/useGSAP';
import type { Employee } from '../types';

const AVATAR_GRADIENTS = [
  'from-primary to-primary-dk',
  'from-pink-400 to-rose-600',
  'from-amber-400 to-orange-600',
  'from-purple-400 to-violet-600',
  'from-teal-400 to-cyan-600',
];

interface Props {
  employee: Employee;
  selected?: boolean;
  onSelect?: () => void;
  compact?: boolean;
  index?: number;
}

export default function EmployeeCard({ employee, selected, onSelect, compact, index = 0 }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const gradient = AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length];

  const handleClick = () => {
    if (!onSelect || !cardRef.current) return;
    gsap.fromTo(cardRef.current,
      { scale: 0.97 },
      { scale: 1, duration: 0.3, ease: 'spring(1, 80, 10, 0)' }
    );
    onSelect();
  };

  return (
    <div
      ref={cardRef}
      onClick={onSelect ? handleClick : undefined}
      className={`bg-surface rounded-2xl shadow-card p-4 transition-all duration-300 will-change-transform
        ${onSelect ? 'cursor-pointer' : ''}
        ${selected ? 'ring-2 ring-primary shadow-card-hover' : onSelect ? 'hover:shadow-card-hover' : ''}`}
    >
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className={`w-13 h-13 w-[52px] h-[52px] rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-soft`}>
            <span className="text-white font-bold text-xl">{employee.name[0].toUpperCase()}</span>
          </div>
          {selected && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center ring-2 ring-white">
              <CheckCircle size={12} className="text-white fill-white" strokeWidth={0} />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="font-bold text-tx1 text-sm truncate">{employee.name}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={10}
                  className={i < Math.round(employee.rating) ? 'text-amber-400 fill-amber-400' : 'text-border fill-border'} />
              ))}
            </div>
            <span className="text-[11px] text-tx2 font-medium">{employee.rating} · {employee.reviewCount} reviews</span>
          </div>
        </div>
      </div>

      {!compact && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {employee.specialties.slice(0, 3).map(s => (
            <span key={s} className="badge badge-primary">{s}</span>
          ))}
          {employee.specialties.length > 3 && (
            <span className="badge badge-hint">+{employee.specialties.length - 3} more</span>
          )}
        </div>
      )}
    </div>
  );
}
