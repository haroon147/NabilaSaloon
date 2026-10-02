import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import type { UserRole } from '../../types';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [role, setRole] = useState<UserRole>('client');
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await register({ name, email, phone, password, role });
    if (ok) navigate(`/${role}`);
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-dk items-center justify-center mb-4 shadow-card">
            <Sparkles size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-tx1">Create Account</h1>
          <p className="text-tx2 mt-1">Join Nabila Salon</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-tx1 mb-1.5">Full Name</label>
              <input className="input" type="text" placeholder="Sara Khan"
                value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-tx1 mb-1.5">Email</label>
              <input className="input" type="email" placeholder="your@email.com"
                value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-tx1 mb-1.5">Phone</label>
              <input className="input" type="tel" placeholder="0300-0000000"
                value={phone} onChange={e => setPhone(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-tx1 mb-1.5">Password</label>
              <div className="relative">
                <input className="input pr-12" type={showPw ? 'text' : 'password'}
                  placeholder="At least 6 characters" minLength={6}
                  value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-hint hover:text-tx2 transition-colors">
                  {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-tx1 mb-1.5">Account Type</label>
              <div className="flex rounded-xl bg-rose p-1">
                {(['client', 'employee'] as UserRole[]).map(r => (
                  <button key={r} type="button" onClick={() => setRole(r)}
                    className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all capitalize ${role === r ? 'bg-white text-primary shadow-soft' : 'text-tx2'}`}>
                    {r === 'client' ? 'Client' : 'Staff'}
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="text-danger text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-tx2 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
