import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useHealth } from '../context/HealthContext.jsx';

export default function Navbar() {
  const [activeLink, setActiveLink] = useState('home');
  const { user, isSupabaseConfigured } = useHealth();

  const navLinks = [
    { id: 'home', label: 'Home', href: '/#' },
    { id: 'appointments', label: 'How it works', href: '/#appointments' },
    { id: 'insights', label: 'Insights', href: '/#insights' }
  ];

  return (
    <>
      {!isSupabaseConfigured && (
        <div style={{
          backgroundColor: '#141a23',
          color: '#4dd9c5',
          textAlign: 'center',
          padding: '8px 12px',
          fontSize: '11px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontWeight: '500',
          letterSpacing: '0.03em',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          borderBottom: '1px solid rgba(77, 217, 197, 0.2)'
        }}>
          <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#4dd9c5' }}></span>
          Preview Mode (Local storage database fallback). Please configure your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY variables to use Supabase Cloud.
        </div>
      )}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="navbar glass-header"
        style={!isSupabaseConfigured ? { top: '29px' } : {}}
      >
        <nav className="nav-container max-w-7xl">
        <div className="logo">
          <Link to="/" onClick={() => setActiveLink('home')} style={{ textDecoration: 'none' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--on-surface)' }}>LifeCue</h3>
          </Link>
        </div>
        
        <div className="nav-links">
          {navLinks.map((link) => (
            <a 
              key={link.id}
              href={link.href} 
              className={`nav-link ${activeLink === link.id ? 'active' : ''}`}
              onClick={() => setActiveLink(link.id)}
              style={{ position: 'relative', paddingBottom: '0.25rem' }}
            >
              {link.label}
              {activeLink === link.id && (
                <motion.div 
                  layoutId="active-underline"
                  className="active-underline"
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    backgroundColor: 'var(--primary)',
                  }}
                />
              )}
            </a>
          ))}
        </div>

        <div className="nav-actions">
          {user ? (
            <Link to="/dashboard" className="btn-primary" style={{ textDecoration: 'none' }}>
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/signin" className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', marginRight: '1rem', textDecoration: 'none' }}>Sign In</Link>
              <Link to="/signup" className="btn-primary" style={{ textDecoration: 'none' }}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>
    </motion.header>
    </>
  );
}
