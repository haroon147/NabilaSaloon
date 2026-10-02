import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scissors, Hand, Sparkles, Package, CalendarPlus, Star, Clock, TrendingUp, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAuth } from '../../context/useAuth';
import { useApp } from '../../context/useApp';
import ServiceCard from '../../components/ServiceCard';

gsap.registerPlugin(ScrollTrigger);

const CATEGORIES = [
  { name: 'Hair',      icon: Scissors, bg: 'bg-primary/10',    ic: 'text-primary',   desc: '5 services' },
  { name: 'Nails',     icon: Hand,     bg: 'bg-pink-100',      ic: 'text-pink-600',  desc: '2 services' },
  { name: 'Skin',      icon: Sparkles, bg: 'bg-amber-100',     ic: 'text-amber-600', desc: '2 services' },
  { name: 'Packages',  icon: Package,  bg: 'bg-purple-100',    ic: 'text-purple-600',desc: '1 service'  },
];

const STATS = [
  { label: 'Services',     value: '10+', icon: Scissors,    color: 'from-primary to-primary-dk' },
  { label: 'Expert Artists',value: '5',  icon: Star,        color: 'from-amber-400 to-orange-500' },
  { label: 'Happy Clients', value: '1k+',icon: TrendingUp,  color: 'from-green-400 to-emerald-600' },
  { label: 'Avg Duration',  value: '60m',icon: Clock,       color: 'from-blue-400 to-indigo-600' },
];

export default function HomePage() {
  const { user } = useAuth();
  const { services, loadServices, selectService } = useApp();
  const navigate = useNavigate();

  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const catRef = useRef<HTMLDivElement>(null);
  const svcRef = useRef<HTMLDivElement>(null);

  useEffect(() => { loadServices(); }, [loadServices]);

  // Animate hero on mount
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo('.hero-badge', { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.5 })
      .fromTo('.hero-greeting', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.2')
      .fromTo('.hero-name', { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.6 }, '-=0.3')
      .fromTo('.hero-sub', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3')
      .fromTo('.hero-btn', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.5, stagger: 0.1 }, '-=0.2')
      .fromTo('.hero-deco', { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.8, stagger: 0.1, ease: 'back.out(1.5)' }, '-=0.4');
  }, []);

  // Scroll-triggered animations
  useEffect(() => {
    if (!statsRef.current) return;
    gsap.fromTo(statsRef.current.querySelectorAll('.stat-card'),
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: statsRef.current, start: 'top 85%' } }
    );
    gsap.fromTo(catRef.current?.querySelectorAll('.cat-card') ?? [],
      { opacity: 0, scale: 0.85 },
      { opacity: 1, scale: 1, duration: 0.5, stagger: 0.08, ease: 'back.out(1.4)',
        scrollTrigger: { trigger: catRef.current, start: 'top 88%' } }
    );
    gsap.fromTo(svcRef.current?.querySelectorAll('.svc-card') ?? [],
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: svcRef.current, start: 'top 88%' } }
    );
    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, [services.length]);

  const handleBook = (svc: (typeof services)[0]) => {
    selectService(svc);
    navigate('/client/book');
  };

  const timeOfDay = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="pb-10">
      {/* ── HERO ────────────────────────────────────────────── */}
      <div ref={heroRef} className="relative overflow-hidden bg-gradient-to-br from-primary via-[#b8805f] to-primary-dk px-6 pt-8 pb-16 mx-0">
        {/* Background blobs */}
        <div className="hero-deco absolute top-[-40px] right-[-40px] w-40 h-40 bg-white/10 rounded-full blur-sm" />
        <div className="hero-deco absolute bottom-[-20px] left-[-30px] w-28 h-28 bg-white/8 rounded-full" />
        <div className="hero-deco absolute top-20 right-10 w-4 h-4 bg-white/30 rounded-full" />
        <div className="hero-deco absolute top-8 left-1/2 w-2 h-2 bg-white/40 rounded-full" />

        {/* Content */}
        <div className="relative max-w-lg">
          <div className="hero-badge inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-4 border border-white/30">
            <Sparkles size={12} />  Premium Beauty Experience
          </div>
          <p className="hero-greeting text-white/70 text-sm font-medium mb-1">{timeOfDay()},</p>
          <h1 className="hero-name text-white text-3xl font-extrabold leading-tight mb-2">
            {user?.name?.split(' ')[0]} ✨
          </h1>
          <p className="hero-sub text-white/75 text-sm mb-7 max-w-xs leading-relaxed">
            Your next luxurious salon experience is just one tap away.
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => navigate('/client/services')}
              className="hero-btn inline-flex items-center gap-2 bg-white text-primary font-bold text-sm px-5 py-3 rounded-2xl shadow-glow hover:shadow-lg active:scale-95 transition-all duration-200"
            >
              <CalendarPlus size={16} /> Book Now
            </button>
            <button
              onClick={() => navigate('/client/bookings')}
              className="hero-btn inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/30 text-white font-semibold text-sm px-5 py-3 rounded-2xl hover:bg-white/25 active:scale-95 transition-all duration-200"
            >
              My Bookings <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Floating stats bar */}
      <div ref={statsRef} className="px-4 -mt-6 mb-8 relative z-10">
        <div className="bg-surface rounded-3xl shadow-card-hover p-4 grid grid-cols-4 gap-2 max-w-lg mx-auto">
          {STATS.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="stat-card flex flex-col items-center gap-1.5 py-1">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-soft`}>
                <Icon size={16} className="text-white" />
              </div>
              <p className="font-extrabold text-tx1 text-base leading-none">{value}</p>
              <p className="text-hint text-[9px] text-center leading-tight">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── CATEGORIES ─────────────────────────────────────── */}
      <section ref={catRef} className="px-6 mb-8 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="section-heading">Browse Categories</h2>
            <p className="section-subheading">Find exactly what you need</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {CATEGORIES.map(({ name, icon: Icon, bg, ic, desc }) => (
            <button
              key={name}
              onClick={() => navigate(`/client/services?cat=${name}`)}
              className={`cat-card relative overflow-hidden rounded-2xl p-4 text-left border border-border hover:border-primary hover:shadow-soft active:scale-95 transition-all duration-200 bg-surface group`}
            >
              <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200`}>
                <Icon size={20} className={ic} />
              </div>
              <p className="font-bold text-tx1 text-sm">{name}</p>
              <p className="text-hint text-[11px] mt-0.5">{desc}</p>
            </button>
          ))}
        </div>
      </section>

      {/* ── FEATURED SERVICES ──────────────────────────────── */}
      <section ref={svcRef} className="px-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="section-heading">Popular Services</h2>
            <p className="section-subheading">Most booked this month</p>
          </div>
          <button
            onClick={() => navigate('/client/services')}
            className="flex items-center gap-1 text-primary text-sm font-semibold hover:underline underline-offset-2"
          >
            See all <ArrowRight size={14} />
          </button>
        </div>

        {services.length === 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-3xl h-52 skeleton" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {services.slice(0, 4).map((svc, i) => (
              <div key={svc.id} className="svc-card">
                <ServiceCard service={svc} onBook={() => handleBook(svc)} compact index={i} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── PROMO BANNER ───────────────────────────────────── */}
      <section className="px-6 mt-8 max-w-2xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-dk to-primary p-6 text-white">
          <div className="absolute right-0 top-0 w-32 h-full opacity-10">
            <div className="w-full h-full bg-[radial-gradient(circle_at_center,white_0%,transparent_70%)]" />
          </div>
          <p className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-1">Limited Offer</p>
          <h3 className="text-xl font-extrabold mb-1">Bridal Package</h3>
          <p className="text-white/80 text-sm mb-4">Full glam for your special day — hair, makeup, nails & more.</p>
          <button
            onClick={() => { selectService(services.find(s => s.id === 's10')!); navigate('/client/book'); }}
            className="inline-flex items-center gap-2 bg-white text-primary-dk font-bold text-sm px-4 py-2.5 rounded-xl active:scale-95 transition-all duration-200"
          >
            Explore Package <ArrowRight size={14} />
          </button>
        </div>
      </section>
    </div>
  );
}
