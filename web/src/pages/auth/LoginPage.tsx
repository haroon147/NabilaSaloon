import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { useAuth } from '../../context/useAuth';
import type { UserRole } from '../../types';

const ROLES: { value: UserRole; label: string; emoji: string }[] = [
  { value: 'client',   label: 'Client',   emoji: '💅' },
  { value: 'employee', label: 'Staff',    emoji: '✂️' },
  { value: 'admin',    label: 'Admin',    emoji: '👑' },
];

const DEMO: Record<UserRole, { email: string; password: string }> = {
  client:   { email: 'sara@demo.com',           password: 'client123' },
  employee: { email: 'zara@nabilasalon.com',    password: 'employee123' },
  admin:    { email: 'admin@nabilasalon.com',   password: 'admin123' },
};

export default function LoginPage() {
  const [role, setRole] = useState<UserRole>('client');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const pageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo('.login-logo', { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.5)' })
      .fromTo('.login-title', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.2')
      .fromTo(cardRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.2');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await login(email, password, role);
    if (ok) {
      gsap.to(cardRef.current, {
        opacity: 0, scale: 0.95, y: -20, duration: 0.3,
        onComplete: () => navigate(`/${role}`),
      });
    } else {
      gsap.fromTo(cardRef.current, { x: -8 }, { x: 0, duration: 0.4, ease: 'elastic.out(1,0.3)' });
    }
  };

  const fillDemo = () => { setEmail(DEMO[role].email); setPassword(DEMO[role].password); };

  return (
    <div ref={pageRef} className="min-h-screen bg-bg bg-mesh flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-gradient-radial from-primary/10 to-transparent rounded-full -translate-y-32 translate-x-32 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-64 h-64 bg-gradient-radial from-primary/8 to-transparent rounded-full translate-y-16 -translate-x-16 pointer-events-none" />

      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="login-logo inline-flex w-18 h-18 w-[72px] h-[72px] rounded-3xl bg-gradient-to-br from-primary to-primary-dk items-center justify-center mb-4 shadow-glow">
            <Sparkles size={30} className="text-white" />
          </div>
          <h1 className="login-title text-2xl font-extrabold text-tx1">Welcome Back</h1>
          <p className="text-tx2 text-sm mt-1">Sign in to <span className="font-semibold text-primary">Nabila Salon</span></p>
        </div>

        <div ref={cardRef} className="card p-6 shadow-card-hover">
          {/* Role selector */}
          <div className="flex rounded-2xl bg-rose p-1 mb-6 gap-1">
            {ROLES.map(r => (
              <button key={r.value} onClick={() => setRole(r.value)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-bold rounded-xl transition-all duration-250 ${
                  role === r.value
                    ? 'bg-white text-primary shadow-soft'
                    : 'text-tx2 hover:text-tx1'
                }`}>
                <span className="text-base">{r.emoji}</span>
                <span className="hidden sm:inline">{r.label}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-tx1 mb-1.5">Email</label>
              <input className="input-lg" type="email" placeholder="your@email.com"
                value={email} onChange={e => setEmail(e.target.value)} required />
            </div>

            <div>
              <label className="block text-sm font-semibold text-tx1 mb-1.5">Password</label>
              <div className="relative">
                <input className="input-lg pr-12" type={showPw ? 'text' : 'password'}
                  placeholder="••••••••" value={password}
                  onChange={e => setPassword(e.target.value)} required />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-hint hover:text-tx2 transition-colors">
                  {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-danger text-sm font-medium">
                {error}
              </div>
            )}

            <button type="submit" className="btn-primary w-full py-3.5 text-base" disabled={loading}>
              {loading
                ? <span className="flex items-center gap-2 justify-center"><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Signing in…</span>
                : <><span>Sign In</span><ArrowRight size={18} /></>
              }
            </button>
          </form>

          {/* Demo shortcut */}
          <div className="mt-4 p-3 bg-rose rounded-xl">
            <p className="text-[11px] text-hint text-center mb-2 font-medium">Quick demo access</p>
            <button onClick={fillDemo}
              className="w-full text-center text-xs text-primary font-bold py-1 hover:underline underline-offset-2 transition-colors">
              Fill demo credentials for {ROLES.find(r => r.value === role)?.label} {ROLES.find(r => r.value === role)?.emoji}
            </button>
          </div>

          <p className="text-center text-sm text-tx2 mt-5">
            New here?{' '}
            <Link to="/register" className="text-primary font-bold hover:underline underline-offset-2">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
