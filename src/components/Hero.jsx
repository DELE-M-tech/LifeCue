import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useHealth } from '../context/HealthContext.jsx';

export default function Hero() {
  const { user } = useHealth();

  return (
    <section className="hero hero-gradient">
      <div className="max-w-7xl hero-grid">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="badge">
            <span className="dot"></span>
            <span className="badge-text">12,000+ people use LifeCue daily</span>
          </div>

          <h1 className="hero-title">
            Never miss a dose.<br />
            <span className="text-gradient cta-gradient">Never miss</span> an appointment.
          </h1>

          <p className="hero-description">
            LifeCue tracks your medications, appointments, and daily health
            habits in one place — with reminders that actually work.
          </p>

          <div className="hero-btns">
            {user ? (
              <Link to="/dashboard" className="btn-cta btn-cta-primary cta-gradient" style={{ textDecoration: 'none', display: 'inline-block' }}>
                Go to Dashboard
              </Link>
            ) : (
              <Link to="/signup" className="btn-cta btn-cta-primary cta-gradient hero-btn-large" style={{ textDecoration: 'none', display: 'inline-block' }}>
                Start Tracking My Appointments
              </Link>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="hero-phone-container"
        >
          <svg viewBox="0 0 360 640" xmlns="http://www.w3.org/2000/svg" className="hero-phone-svg" role="img" aria-label="Phone showing LifeCue reminders">
            <defs>
              <clipPath id="screenClip">
                <rect x="14" y="14" width="332" height="612" rx="36" />
              </clipPath>
            </defs>

            <rect x="2" y="2" width="356" height="636" rx="48" fill="#0f1b2d" />
            <rect x="14" y="14" width="332" height="612" rx="36" fill="#ffffff" />

            <g clipPath="url(#screenClip)">
              <rect x="14" y="14" width="332" height="612" fill="#f5f9ff" />

              <rect x="14" y="14" width="332" height="64" fill="#ffffff" />
              <text x="36" y="52" fontFamily="Manrope, sans-serif" fontSize="20" fontWeight="800" fill="#0f1b2d">Today</text>
              <text x="324" y="52" fontFamily="Manrope, sans-serif" fontSize="13" fontWeight="700" fill="#5b6b80" textAnchor="end">9:41 PM</text>

              <rect x="32" y="100" width="296" height="92" rx="20" fill="#0a84ff" />
              <text x="56" y="138" fontFamily="Manrope, sans-serif" fontSize="14" fontWeight="800" fill="#ffffff">Evening medication</text>
              <text x="56" y="162" fontFamily="Manrope, sans-serif" fontSize="13" fill="#d6ebff">Metformin · 500mg · Take now</text>
              <circle cx="296" cy="146" r="18" fill="#ffffff" opacity="0.18" />
              <path d="M289 146 l5 5 l10 -10" stroke="#ffffff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />

              <rect x="32" y="208" width="296" height="76" rx="20" fill="#ffffff" stroke="#e8ecf1" strokeWidth="1" />
              <circle cx="64" cy="246" r="16" fill="#d4f5f0" />
              <path d="M58 246 l6 6 l8 -12" stroke="#0a3d38" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <text x="92" y="242" fontFamily="Manrope, sans-serif" fontSize="14" fontWeight="800" fill="#0f1b2d">Morning vitamins</text>
              <text x="92" y="262" fontFamily="Manrope, sans-serif" fontSize="12" fill="#8696ad">Taken at 8:02 AM</text>

              <text x="32" y="324" fontFamily="Manrope, sans-serif" fontSize="13" fontWeight="800" fill="#5b6b80" letterSpacing="1">UPCOMING</text>

              <rect x="32" y="340" width="296" height="84" rx="20" fill="#ffffff" stroke="#e8ecf1" strokeWidth="1" />
              <rect x="48" y="356" width="52" height="52" rx="14" fill="#e3eaff" />
              <text x="74" y="378" fontFamily="Manrope, sans-serif" fontSize="11" fontWeight="800" fill="#1b2e6b" textAnchor="middle">JUN</text>
              <text x="74" y="398" fontFamily="Manrope, sans-serif" fontSize="18" fontWeight="800" fill="#1b2e6b" textAnchor="middle">16</text>
              <text x="116" y="378" fontFamily="Manrope, sans-serif" fontSize="14" fontWeight="800" fill="#0f1b2d">Dr. Adeyemi</text>
              <text x="116" y="398" fontFamily="Manrope, sans-serif" fontSize="12" fill="#8696ad">Cardiology · 10:30 AM</text>

              <rect x="32" y="436" width="296" height="84" rx="20" fill="#ffffff" stroke="#e8ecf1" strokeWidth="1" />
              <rect x="48" y="452" width="52" height="52" rx="14" fill="#d4f5f0" />
              <text x="74" y="474" fontFamily="Manrope, sans-serif" fontSize="11" fontWeight="800" fill="#0a3d38" textAnchor="middle">JUN</text>
              <text x="74" y="494" fontFamily="Manrope, sans-serif" fontSize="18" fontWeight="800" fill="#0a3d38" textAnchor="middle">19</text>
              <text x="116" y="474" fontFamily="Manrope, sans-serif" fontSize="14" fontWeight="800" fill="#0f1b2d">Lab work</text>
              <text x="116" y="494" fontFamily="Manrope, sans-serif" fontSize="12" fill="#8696ad">Fasting required · 8:00 AM</text>

              <rect x="32" y="544" width="296" height="58" rx="18" fill="#f0f3f7" />
              <circle cx="58" cy="573" r="14" fill="#0a84ff" opacity="0.12" />
              <path d="M50 573 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0 M58 565 v8 l5 5" stroke="#0a84ff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <text x="84" y="578" fontFamily="Manrope, sans-serif" fontSize="13" fontWeight="700" fill="#0f1b2d">3 reminders set for tomorrow</text>
            </g>

            <rect x="14" y="14" width="332" height="612" rx="36" fill="none" stroke="#0f1b2d" strokeWidth="2" opacity="0.06" />
          </svg>

          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="hero-floating-card glass-panel"
          >
            <div className="icon-circle">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12l2 2 4-4" />
                <circle cx="12" cy="12" r="10" />
              </svg>
            </div>
            <div>
              <p style={{ fontSize: '0.95rem', fontWeight: '700' }}>On track today</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--on-surface-variant)' }}>2 of 3 doses logged</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}