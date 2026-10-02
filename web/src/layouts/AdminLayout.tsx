import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Users, User, LogOut, Sparkles } from 'lucide-react';
import { useAuth } from '../context/useAuth';

const NAV = [
  { to: '/admin',          label: 'Dashboard',    icon: LayoutDashboard, end: true  },
  { to: '/admin/bookings', label: 'Bookings',     icon: BookOpen,        end: false },
  { to: '/admin/team',     label: 'Team',         icon: Users,           end: false },
  { to: '/admin/profile',  label: 'Profile',      icon: User,            end: false },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="flex h-screen bg-bg overflow-hidden">
      <aside className="hidden md:flex flex-col w-60 bg-surface border-r border-border flex-shrink-0">
        <div className="p-5 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-soft">
              <Sparkles size={17} className="text-white" />
            </div>
            <div>
              <p className="font-extrabold text-tx1 text-sm">Nabila Salon</p>
              <p className="text-hint text-[11px]">Admin Panel</p>
            </div>
          </div>
        </div>
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-soft">
              {user?.name[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-tx1 text-sm font-bold truncate">{user?.name}</p>
              <p className="text-amber-600 text-[11px] font-semibold">Administrator</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
              <Icon size={17} /><span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-border">
          <button onClick={handleLogout} className="sidebar-link w-full text-tx2 hover:text-danger hover:bg-red-50">
            <LogOut size={17} /><span>Sign Out</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-surface border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center">
              <Sparkles size={13} className="text-white" />
            </div>
            <p className="font-extrabold text-tx1 text-sm">Nabila — Admin</p>
          </div>
          <button onClick={handleLogout} className="text-hint hover:text-danger transition-colors">
            <LogOut size={18} />
          </button>
        </header>
        <main className="flex-1 overflow-y-auto"><Outlet /></main>
        <nav className="md:hidden flex bg-surface border-t border-border">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) =>
              `flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-semibold transition-colors ${isActive ? 'text-amber-600' : 'text-hint'}`
            }>
              {({ isActive }) => (
                <>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isActive ? 'bg-amber-50' : ''}`}>
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
