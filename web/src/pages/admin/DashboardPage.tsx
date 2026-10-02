import { useEffect, useRef, useState } from 'react';
import { BookOpen, Users, TrendingUp, Calendar, Clock, ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import * as mockApi from '../../services/mockApi';
import * as realApi from '../../services/api';
import { useApp } from '../../context/useApp';
import type { AdminStats } from '../../types';

const USE_BACKEND = import.meta.env.VITE_USE_BACKEND === 'true';
const api = USE_BACKEND ? realApi : mockApi;

const STAT_CARDS = (stats: AdminStats) => [
  { label: 'Total Bookings',    value: stats.totalBookings, suffix: '',    icon: BookOpen,    gradient: 'from-primary to-primary-dk',          change: '+12%' },
  { label: "Today's Bookings",  value: stats.todayBookings, suffix: '',    icon: Calendar,    gradient: 'from-blue-400 to-indigo-600',          change: '+3' },
  { label: 'Month Revenue',     value: `${(stats.monthRevenue/1000).toFixed(0)}k`, suffix:'PKR', icon:TrendingUp, gradient:'from-emerald-400 to-green-600', change:'+18%' },
  { label: 'Active Clients',    value: stats.activeClients, suffix: '',    icon: Users,       gradient: 'from-purple-400 to-violet-600',        change: '+5' },
  { label: 'Completion Rate',   value: stats.completionRate, suffix: '%',  icon: Clock,       gradient: 'from-amber-400 to-orange-500',         change: '+2%' },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const { bookings, loadAllBookings } = useApp();
  const statsRef = useRef<HTMLDivElement>(null);
  const recentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.getAdminStats().then(setStats);
    loadAllBookings();
  }, [loadAllBookings]);

  useEffect(() => {
    if (!stats || !statsRef.current) return;
    gsap.fromTo(statsRef.current.querySelectorAll('.stat-card'),
      { opacity: 0, y: 40, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.08, ease: 'back.out(1.3)' }
    );
    gsap.fromTo(recentRef.current?.querySelectorAll('.recent-row') ?? [],
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.4, stagger: 0.06, ease: 'power3.out', delay: 0.4 }
    );
  }, [stats]);

  const recent = [...bookings]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 6);

  const STATUS_COLORS: Record<string, string> = {
    confirmed: 'badge badge-primary',
    pending:   'badge badge-warning',
    completed: 'badge badge-success',
    cancelled: 'badge badge-danger',
  };

  return (
    <div className="min-h-screen bg-bg">
      {/* Page header */}
      <div className="px-6 pt-6 pb-4 max-w-5xl mx-auto">
        <h1 className="text-xl font-extrabold text-tx1">Dashboard</h1>
        <p className="text-tx2 text-sm mt-0.5">Welcome back. Here's what's happening at the salon.</p>
      </div>

      {/* Stats grid */}
      {!stats ? (
        <div className="px-6 max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[...Array(5)].map((_, i) => <div key={i} className="h-32 rounded-2xl skeleton" />)}
        </div>
      ) : (
        <div ref={statsRef} className="px-6 max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {STAT_CARDS(stats).map(({ label, value, suffix, icon: Icon, gradient, change }) => (
            <div key={label} className="stat-card card p-4 relative overflow-hidden group">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-3 shadow-soft group-hover:scale-110 transition-transform duration-200`}>
                <Icon size={18} className="text-white" />
              </div>
              <p className="text-2xl font-extrabold text-tx1 leading-none">
                {suffix === 'PKR' && <span className="text-sm text-hint font-medium">PKR </span>}
                {value}
                {suffix !== 'PKR' && suffix && <span className="text-sm text-hint font-medium">{suffix}</span>}
              </p>
              <p className="text-hint text-xs mt-1 leading-tight">{label}</p>
              <div className="flex items-center gap-0.5 mt-2">
                <ArrowUpRight size={11} className="text-success" />
                <span className="text-[10px] text-success font-bold">{change}</span>
                <span className="text-[10px] text-hint ml-0.5">vs last month</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Content grid */}
      <div className="px-6 pb-10 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent bookings */}
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-tx1">Recent Bookings</h2>
            <a href="/admin/bookings" className="text-primary text-xs font-semibold hover:underline underline-offset-2 flex items-center gap-1">
              View all <ArrowUpRight size={12} />
            </a>
          </div>
          <div ref={recentRef} className="divide-y divide-border">
            {recent.length === 0 ? (
              <div className="text-center py-8 text-tx2 text-sm">No bookings yet</div>
            ) : recent.map(b => (
              <div key={b.id} className="recent-row py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dk flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">{b.clientName?.[0] ?? '?'}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-tx1 text-sm truncate">{b.serviceName}</p>
                    <p className="text-hint text-xs truncate">{b.clientName} · {b.employeeName}</p>
                  </div>
                </div>
                <div className="flex-shrink-0 text-right">
                  <span className={STATUS_COLORS[b.status]}>{b.status}</span>
                  <p className="text-[10px] text-hint mt-1">{b.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick info */}
        <div className="space-y-4">
          {/* Salon info */}
          <div className="card p-5">
            <h3 className="font-bold text-tx1 mb-3">Salon Info</h3>
            <div className="space-y-2.5 text-sm text-tx2">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-rose flex items-center justify-center text-base">📍</div>
                <span>Karachi, Pakistan</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-rose flex items-center justify-center text-base">📞</div>
                <span>0300-3333333</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-rose flex items-center justify-center text-base">🕐</div>
                <span>Mon–Sat · 9am – 8pm</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-rose flex items-center justify-center text-base">⭐</div>
                <span>4.8 · 400+ reviews</span>
              </div>
            </div>
          </div>

          {/* Status summary */}
          <div className="card p-5">
            <h3 className="font-bold text-tx1 mb-3">Booking Status</h3>
            {(['confirmed','pending','completed','cancelled'] as const).map(s => {
              const count = bookings.filter(b => b.status === s).length;
              const pct = bookings.length ? Math.round(count / bookings.length * 100) : 0;
              const BAR: Record<string, string> = { confirmed:'bg-primary', pending:'bg-warning', completed:'bg-success', cancelled:'bg-danger' };
              return (
                <div key={s} className="mb-2.5">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="capitalize text-tx2 font-medium">{s}</span>
                    <span className="text-hint">{count} ({pct}%)</span>
                  </div>
                  <div className="h-1.5 bg-border rounded-full overflow-hidden">
                    <div className={`h-full ${BAR[s]} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
