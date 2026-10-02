import { useRef } from 'react';
import { Clock, Scissors, Sparkles, Hand, Package, ArrowRight } from 'lucide-react';
import { gsap } from '../hooks/useGSAP';
import type { Service } from '../types';

const CATEGORY_MAP: Record<string, { Icon: React.ElementType; gradient: string; iconBg: string }> = {
  Hair:     { Icon: Scissors, gradient: 'from-primary/25 via-primary/10 to-rose',   iconBg: 'bg-primary/15' },
  Nails:    { Icon: Hand,     gradient: 'from-pink-300/30 via-pink-100/20 to-rose',  iconBg: 'bg-pink-100' },
  Skin:     { Icon: Sparkles, gradient: 'from-amber-300/30 via-amber-100/20 to-rose',iconBg: 'bg-amber-100' },
  Packages: { Icon: Package,  gradient: 'from-purple-300/25 via-purple-100/15 to-rose',iconBg:'bg-purple-100'},
};

interface Props {
  service: Service;
  onBook?: () => void;
  compact?: boolean;
  index?: number;
}

export default function ServiceCard({ service, onBook, compact, index = 0 }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { Icon, gradient, iconBg } = CATEGORY_MAP[service.category] ?? CATEGORY_MAP.Hair;

  const hrs = Math.floor(service.durationMinutes / 60);
  const mins = service.durationMinutes % 60;
  const duration = hrs > 0 ? `${hrs}h${mins ? ` ${mins}m` : ''}` : `${mins}m`;

  const handleMouseEnter = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, { y: -6, scale: 1.02, duration: 0.3, ease: 'power2.out' });
    gsap.to(cardRef.current.querySelector('.card-icon'), { rotate: 15, scale: 1.1, duration: 0.3, ease: 'power2.out' });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, { y: 0, scale: 1, duration: 0.4, ease: 'power2.out' });
    gsap.to(cardRef.current.querySelector('.card-icon'), { rotate: 0, scale: 1, duration: 0.4, ease: 'power2.out' });
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ animationDelay: `${index * 80}ms` }}
      className="bg-surface rounded-3xl shadow-card overflow-hidden will-change-transform"
    >
      {/* Header */}
      <div className={`relative h-[110px] bg-gradient-to-br ${gradient} overflow-hidden`}>
        {/* Decorative blobs */}
        <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white/20" />
        <div className="absolute -bottom-6 -left-6 w-16 h-16 rounded-full bg-white/15" />

        {/* Category pill */}
        <span className="absolute top-3 left-3 text-[10px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full bg-white/80 text-primary-dk backdrop-blur-sm">
          {service.category}
        </span>

        {/* Duration */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/80 backdrop-blur-sm rounded-full px-2 py-1">
          <Clock size={9} className="text-tx2" />
          <span className="text-[10px] font-semibold text-tx2">{duration}</span>
        </div>

        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`card-icon w-14 h-14 rounded-2xl ${iconBg} shadow-soft flex items-center justify-center border border-white/60`}>
            <Icon size={24} className="text-primary-dk" />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className="font-bold text-tx1 text-sm leading-tight mb-1 line-clamp-1">{service.name}</h3>
        {!compact && (
          <p className="text-hint text-xs leading-relaxed line-clamp-2 mb-3">{service.description}</p>
        )}
        <div className={`flex items-center justify-between ${compact ? 'mt-2' : ''}`}>
          <div>
            <span className="font-extrabold text-primary text-base">PKR {service.price.toLocaleString()}</span>
          </div>
          {onBook && (
            <button
              onClick={e => { e.stopPropagation(); onBook(); }}
              className="flex items-center gap-1.5 bg-primary text-white text-xs font-bold px-3.5 py-2 rounded-xl hover:bg-primary-dk active:scale-95 transition-all duration-200 shadow-soft"
            >
              Book <ArrowRight size={11} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
