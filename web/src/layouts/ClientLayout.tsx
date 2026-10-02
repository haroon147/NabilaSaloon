import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Home, Scissors, BookOpen, User, LogOut, Sparkles } from 'lucide-react';
import { useAuth } from '../context/useAuth';

const NAV = [
  { to: '/client',          label: 'Home',     icon: Home,     end: true },
  { to: '/client/services', label: 'Services', icon: Scissors, end: false },
  { to: '/client/bookings', label: 'Bookings', icon: BookOpen, end: false },
  { to: '/client/profile',  label: 'Profile',  icon: User,     end: false },
];

export default function ClientLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="flex h-screen bg-bg overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-60 bg-surface border-r border-border flex-shrink-0">
        {/* Brand */}
        <div className="p-5 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-dk flex items-center justify-center shadow-soft">
              <Sparkles size={17} className="text-white" />
            </div>
            <div>
              <p className="font-extrabold text-tx1 text-sm leading-tight">Nabila Salon</p>
              <p className="text-hint text-[11px]">Beauty & Wellness</p>
            </div>
          </div>
        </div>

        {/* User */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-dk flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-soft">
              {user?.name[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-tx1 text-sm font-bold truncate">{user?.name}</p>
              <p className="text-hint text-[11px] truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
              <Icon size={17} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-border">
          <button onClick={handleLogout}
            className="sidebar-link w-full text-tx2 hover:text-danger hover:bg-red-50">
            <LogOut size={17} /><span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-surface border-b border-border flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-primary-dk flex items-center justify-center shadow-soft">
              <Sparkles size={13} className="text-white" />
            </div>
            <p className="font-extrabold text-tx1 text-sm">Nabila Salon</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-dk flex items-center justify-center text-white font-bold text-xs shadow-soft">
            {user?.name[0].toUpperCase()}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>

        {/* Mobile bottom nav */}
        <nav className="md:hidden flex bg-surface border-t border-border flex-shrink-0">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) =>
              `flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-semibold transition-colors ${isActive ? 'text-primary' : 'text-hint'}`
            }>
              {({ isActive }) => (
                <>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 ${isActive ? 'bg-rose' : ''}`}>
                    <Icon size={18} />
                  </div>
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
