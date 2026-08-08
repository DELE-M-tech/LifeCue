import { motion } from 'motion/react';
import { ChevronLeft, Pill, Calendar, Flame, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import { useHealth } from '../context/HealthContext.jsx';
import AppLayout from './AppLayout.jsx';
import { SkelBlock } from './Skeletons.jsx';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, isAuthReady, meds, appointments, logout, historyLogs, fetchHistory } = useHealth();

  useEffect(() => {
    if (isAuthReady && !user) navigate('/signin');
  }, [user, isAuthReady, navigate]);

  useEffect(() => { fetchHistory(60); }, []);

  const streak = useMemo(() => {
    if (!historyLogs || historyLogs.length === 0) return 0;
    const sorted = [...historyLogs].sort((a, b) => new Date(b.log_date) - new Date(a.log_date));
    let count = 0;
    let cursor = new Date();
    cursor.setDate(cursor.getDate() - 1);

    const toLocalDateStr = (d) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    for (const log of sorted) {
      const cursorStr = toLocalDateStr(cursor);
      if (log.log_date === cursorStr && log.completion_pct >= 70) {
        count++;
        cursor.setDate(cursor.getDate() - 1);
      } else if (log.log_date === cursorStr) {
        break;
      }
    }
    return count;
  }, [historyLogs]);

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const avatarUrl = user?.user_metadata?.avatar_url;
  const initials = displayName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : '—';
  const memberSinceFull = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : '—';

  const onLogout = async () => {
    await logout();
    navigate('/signin');
  };

  if (!isAuthReady || !user) {
    return (
      <AppLayout>
        <div className="skel-page">
          <SkelBlock width="160px" height="0.85rem" style={{ marginBottom: '1.25rem' }} />
          <div className="profile-hero">
            <SkelBlock width="4.5rem" height="4.5rem" radius="50%" />
            <div style={{ flex: 1 }}>
              <SkelBlock width="180px" height="1.3rem" style={{ marginBottom: '0.6rem' }} />
              <SkelBlock width="220px" height="0.8rem" style={{ marginBottom: '0.4rem' }} />
              <SkelBlock width="160px" height="0.8rem" />
            </div>
          </div>
          <div className="profile-stats-grid">
            <SkelBlock height="110px" radius="var(--radius-xl)" />
            <SkelBlock height="110px" radius="var(--radius-xl)" />
            <SkelBlock height="110px" radius="var(--radius-xl)" />
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="dash-page" style={{ maxWidth: '820px' }}>
        <Link to="/dashboard" className="med-back-link">
          <ChevronLeft size={18} /> Back to Dashboard
        </Link>

        {/* ── Header ── */}
        <div className="profile-hero">
          {avatarUrl ? (
            <img src={avatarUrl} alt={displayName} className="profile-avatar" referrerPolicy="no-referrer" />
          ) : (
            <div className="profile-avatar profile-avatar-fallback">{initials}</div>
          )}
          <div className="profile-hero-info">
            <div className="profile-name-row">
              <h1 className="profile-hero-name">{displayName}</h1>
              <span className="profile-badge">Member</span>
            </div>
            <a className="profile-email-link" href={`mailto:${user.email}`}>{user.email}</a>
            <p className="profile-since-text">Member since {memberSince}</p>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="profile-stats-grid">
          <motion.div whileHover={{ y: -3 }} className="profile-stat-card">
            <div className="profile-stat-icon" style={{ background: 'var(--primary-container)' }}>
              <Pill size={18} style={{ color: 'var(--primary)' }} />
            </div>
            <span className="profile-stat-value">{meds.length}</span>
            <span className="profile-stat-label">Medications tracked</span>
          </motion.div>

          <motion.div whileHover={{ y: -3 }} className="profile-stat-card">
            <div className="profile-stat-icon" style={{ background: 'var(--tertiary-container)' }}>
              <Calendar size={18} style={{ color: 'var(--tertiary)' }} />
            </div>
            <span className="profile-stat-value">{appointments.length}</span>
            <span className="profile-stat-label">Appointments logged</span>
          </motion.div>

          <motion.div whileHover={{ y: -3 }} className="profile-stat-card">
            <div className="profile-stat-icon" style={{ background: 'var(--secondary-container)' }}>
              <Flame size={18} style={{ color: 'var(--secondary)' }} />
            </div>
            <span className="profile-stat-value">{streak}</span>
            <span className="profile-stat-label">Day streak</span>
          </motion.div>
        </div>

        {/* ── Account details ── */}
        <div className="dash-card profile-details-card">
          <div className="dash-card-header">
            <h2 className="dash-card-title">Account Details</h2>
          </div>
          <div className="dash-card-body" style={{ gap: 0 }}>
            <div className="profile-detail-row">
              <span className="profile-detail-label">Full Name</span>
              <span className="profile-detail-value">{displayName}</span>
            </div>
            <div className="profile-detail-row">
              <span className="profile-detail-label">Email</span>
              <span className="profile-detail-value">{user.email}</span>
            </div>
            <div className="profile-detail-row" style={{ borderBottom: 'none' }}>
              <span className="profile-detail-label">Member Since</span>
              <span className="profile-detail-value">{memberSinceFull}</span>
            </div>
          </div>
        </div>

        <button className="profile-logout-btn" onClick={onLogout}>
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </AppLayout>
  );
}
