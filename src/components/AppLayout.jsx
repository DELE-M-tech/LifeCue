import { NavLink, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard, Pill, CalendarDays, Activity,
  LogOut, ChevronRight
} from 'lucide-react';
import { useHealth } from '../context/HealthContext.jsx';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/medications', icon: Pill, label: 'Medications' },
  { to: '/calendar', icon: CalendarDays, label: 'Calendar' },
  { to: '/logger', icon: Activity, label: 'Logger' },
];

export default function AppLayout({ children }) {
  const { user, logout } = useHealth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const avatarSrc = user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${user?.email}&background=0a84ff&color=fff`;

  return (
    <div className="app-shell">
      {/* ── Desktop sidebar ── */}
      <aside className="sidebar">
        <Link to="/" className="sidebar-logo">
          <div className="sidebar-logo-mark">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="9" width="20" height="8" rx="4" fill="#0a84ff"/>
              <path d="M12 9V17" stroke="white" strokeWidth="1.5" strokeOpacity="0.5"/>
              <path d="M14.7 11.7L15.8 12.8L17.8 10.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="sidebar-logo-text">LifeCue</span>
        </Link>

        <nav className="sidebar-nav">
          <p className="sidebar-nav-label">Main</p>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <button onClick={handleLogout} className="sidebar-logout-btn">
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>

          <NavLink to="/profile" className={({ isActive }) => `sidebar-user ${isActive ? 'active' : ''}`}>
            <div className="sidebar-user-avatar">
              <img src={avatarSrc} alt="Profile" />
            </div>
            <div className="sidebar-user-info">
              <p className="sidebar-user-name">{user?.user_metadata?.full_name?.split(' ')[0] || 'You'}</p>
              <p className="sidebar-user-email">{user?.email}</p>
            </div>
            <ChevronRight size={15} className="sidebar-user-chevron" />
          </NavLink>
        </div>
      </aside>

      {/* ── Mobile top bar ── */}
      <header className="mobile-topbar">
        <Link to="/dashboard" className="mobile-topbar-logo">
          <div className="sidebar-logo-mark">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="9" width="20" height="8" rx="4" fill="#0a84ff"/>
              <path d="M12 9V17" stroke="white" strokeWidth="1.5" strokeOpacity="0.5"/>
              <path d="M14.7 11.7L15.8 12.8L17.8 10.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="sidebar-logo-text">LifeCue</span>
        </Link>
        <NavLink to="/profile" className="mobile-topbar-avatar">
          <img src={avatarSrc} alt="Profile" />
        </NavLink>
      </header>

      {/* ── Main content ── */}
      <main className="app-main">
        {children}
      </main>

      {/* ── Mobile bottom tab bar ── */}
      <nav className="mobile-tabbar">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `mobile-tab-item ${isActive ? 'active' : ''}`}>
            <Icon size={22} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
