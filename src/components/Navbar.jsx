import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useHealth } from '../context/HealthContext.jsx';

export default function Navbar() {
  const [activeLink, setActiveLink] = useState('home');
  const { user, isSupabaseConfigured } = useHealth();

  const navLinks = [
    { id: 'home', label: 'Home', href: '/#' },
    { id: 'features', label: 'What LifeCue Offers', href: '/#medication' },
    { id: 'getting-started', label: 'How to Get Started', href: '/#how-to-get-started' },
    { id: 'insights', label: 'Insights', href: '/#insights' }
  ];

  return (
    <>
      {!isSupabaseConfigured && (
        <div className="preview-banner">
          <span className="preview-banner-dot"></span>
          Preview mode — using local storage. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to connect Supabase.
        </div>
      )}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="navbar glass-header"
        style={!isSupabaseConfigured ? { top: '33px' } : {}}
      >
        <nav className="nav-container max-w-7xl">
          <Link to="/" className="logo" onClick={() => setActiveLink('home')}>
            <div className="logo-mark">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="9" width="20" height="8" rx="4" fill="#0a84ff"/>
                <path d="M12 9V17" stroke="white" strokeWidth="1.5" strokeOpacity="0.5"/>
                <path d="M14.7 11.7L15.8 12.8L17.8 10.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="logo-wordmark">LifeCue</span>
          </Link>

          <div className="nav-links">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                className={`nav-link ${activeLink === link.id ? 'active' : ''}`}
                onClick={() => setActiveLink(link.id)}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="nav-actions">
            {user ? (
              <Link to="/dashboard" className="btn-primary" style={{ textDecoration: 'none' }}>
                Dashboard
              </Link>
            ) : (
              <Link to="/signin" className="btn-primary" style={{ textDecoration: 'none' }}>
                Sign In
              </Link>
            )}
          </div>
        </nav>
      </motion.header>
    </>
  );
}
