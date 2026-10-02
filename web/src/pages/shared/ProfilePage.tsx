import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, Shield, LogOut, ChevronRight, BookOpen, Scissors } from 'lucide-react';
import gsap from 'gsap';
import { useAuth } from '../../context/useAuth';

const AVATAR_GRADIENTS: Record<string, string> = {
  client:   'from-primary to-primary-dk',
  employee: 'from-purple-400 to-violet-600',
  admin:    'from-amber-400 to-orange-500',
};
const ROLE_LABELS: Record<string, { label: string; emoji: string; color: string }> = {
  client:   { label: 'Client',        emoji: '💅', color: 'text-primary   bg-primary/10' },
  employee: { label: 'Staff Member',  emoji: '✂️', color: 'text-purple-600 bg-purple-100' },
  admin:    { label: 'Administrator', emoji: '👑', color: 'text-amber-600  bg-amber-100' },
};

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pageRef.current) return;
    gsap.fromTo(pageRef.current.querySelectorAll('.profile-section'),
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out' }
    );
  }, []);

  const handleLogout = () => {
    gsap.to(pageRef.current, {
      opacity: 0, y: -20, duration: 0.3,
      onComplete: () => { logout(); navigate('/login'); },
    });
  };

  if (!user) return null;

  const roleConfig = ROLE_LABELS[user.role];
  const avatarGrad = AVATAR_GRADIENTS[user.role];
  const rolePath = `/${user.role}`;

  const quickLinks = user.role === 'client' ? [
    { label: 'My Bookings', icon: BookOpen, to: `${rolePath}/bookings` },
    { label: 'Browse Services', icon: Scissors, to: `${rolePath}/services` },
  ] : [];

  return (
    <div ref={pageRef} className="min-h-screen bg-bg">
      {/* Hero section */}
      <div className="profile-section relative overflow-hidden bg-gradient-to-br from-tx1 to-[#1a1a1a] px-6 pt-10 pb-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(201,150,127,0.15),transparent_60%)]" />
        <div className="relative flex flex-col items-center text-center max-w-sm mx-auto">
          {/* Avatar */}
          <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${avatarGrad} flex items-center justify-center mb-4 shadow-glow`}>
            <span className="text-white font-extrabold text-4xl">{user.name[0].toUpperCase()}</span>
          </div>
          <h2 className="text-white font-extrabold text-xl mb-1">{user.name}</h2>
          <div className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${roleConfig.color}`}>
            <Shield size={11} /> {roleConfig.label} {roleConfig.emoji}
          </div>
        </div>
      </div>

      <div className="px-6 -mt-6 pb-10 max-w-md mx-auto space-y-4">
        {/* Contact card */}
        <div className="profile-section card p-5 shadow-card-hover">
          <h3 className="font-bold text-tx1 text-sm mb-4">Contact Information</h3>
          <div className="space-y-3">
            {[
              { icon: Mail,  label: 'Email', value: user.email },
              { icon: Phone, label: 'Phone', value: user.phone || 'Not provided' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose flex items-center justify-center flex-shrink-0">
                  <Icon size={15} className="text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-hint text-[11px] font-medium">{label}</p>
                  <p className="text-tx1 font-semibold text-sm truncate">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick links */}
        {quickLinks.length > 0 && (
          <div className="profile-section card p-5 shadow-card-hover">
            <h3 className="font-bold text-tx1 text-sm mb-3">Quick Links</h3>
            <div className="space-y-1">
              {quickLinks.map(({ label, icon: Icon, to }) => (
                <button key={label} onClick={() => navigate(to)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-rose transition-colors group">
                  <div className="w-8 h-8 rounded-lg bg-rose group-hover:bg-primary/15 flex items-center justify-center flex-shrink-0 transition-colors">
                    <Icon size={14} className="text-primary" />
                  </div>
                  <span className="flex-1 text-sm font-semibold text-tx1 text-left">{label}</span>
                  <ChevronRight size={14} className="text-hint group-hover:text-primary transition-colors" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Account actions */}
        <div className="profile-section card p-5 shadow-card-hover">
          <h3 className="font-bold text-tx1 text-sm mb-3">Account</h3>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 transition-colors group border border-transparent hover:border-red-100">
            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
              <LogOut size={14} className="text-danger" />
            </div>
            <span className="text-sm font-semibold text-danger">Sign Out</span>
          </button>
        </div>

        <p className="profile-section text-center text-[11px] text-hint">
          Nabila Salon · Version 1.0 · Made with ❤️ in Karachi
        </p>
      </div>
    </div>
  );
}
