import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useHealth } from '../context/HealthContext.jsx';

export default function Navbar() {
  const [activeLink, setActiveLink] = useState('home');
  const { user, isSupabaseConfigured } = useHealth();

  const navLinks = [
    { id: 'home', label: 'Home', href: '/#' },
    { id: 'appointments', label: 'Appointment-Tracking', href: '/#appointments' },
    { id: 'insights', label: 'Insights', href: '/#insights' }
  ];

  return (
    <>
      {!isSupabaseConfigured && (
        <div style={{
          backgroundColor: '#1e1c18',
          color: '#e4a853',
          textAlign: 'center',
          padding: '6px 12px',
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
          borderBottom: '1px solid #3c2e17'
        }}>
          <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#e4a853' }}></span>
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
          <Link to="/" onClick={() => setActiveLink('home')}>
            <img 
              alt="Nocturne Sanctuary Logo" 
              className="footer-logo" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtxlaR4BRCJcikNm2ms-vpazR-tCbZQuqcmAoHMd9IooV2GJllRHFZpctTLT6kRIyvuEbkstqRKPQgErI7Q8-GZB5c9s3LsJATujPTZTmyhhq9Re-wtrRTYw5FyEJ4d2CwOXR9DNBjNhqq38Elx8V7_BK0ZJv1cchMIzlclLN9oBFecV4jg5dEQkA7PlDdSNNAL_y_ZYhN1s2ypHVMKqvhNbg-ubJOx9mOQlzXl2XzGcwQNnEjSrGZAlKxToZfVg0QoZ5iSTUCP7lh"
              referrerPolicy="no-referrer"
            />
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
