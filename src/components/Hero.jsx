import { motion } from 'motion/react';
import { Moon } from 'lucide-react';
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
            <span className="badge-text">New: Personalized Nightly Insights</span>
          </div>
          
          <h1 className="hero-title">
            Digital Wellness,<br/>
            <span className="text-gradient cta-gradient">Reimagined</span> For Your Evening.
          </h1>
          
          <p className="hero-description">
            A sophisticated platform for medication scheduling, appointment management, and daily wellness tracking. Designed for peace of mind in the hours that matter most.
          </p>
          
          <div className="hero-btns">
            {user ? (
              <Link to="/dashboard" className="btn-cta btn-cta-primary cta-gradient" style={{ textDecoration: 'none', display: 'inline-block' }}>
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/signup" className="btn-cta btn-cta-primary cta-gradient" style={{ textDecoration: 'none', display: 'inline-block' }}>
                  Get Started
                </Link>
                <Link to="/signin" className="btn-cta btn-cta-secondary" style={{ textDecoration: 'none', display: 'inline-block' }}>
                  Sign In
                </Link>
              </>
            )}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="hero-image-container"
        >
          <div className="image-overlay"></div>
          <img 
            className="hero-image" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcZtSvPkDvqv2HdHWXUaChjJ1oGB0uIgq_gT_o70ewRQ5hQYt5bESEN2aHxQWsFTYEu6ndJ9HKEQCwMKOO4fBSvVRLY1VbUEr6zdv-Cp2vuqLqOakEoYucCblZ4c_I4fR-NQGrDdQE1p223t-bG0ezVuPc20cba9po2mbUyrP3o_koEWOcDJLinDd3lWgul_RZvV4Kel0MUnYsJab3XZ2GTtOouK2n9WovUU5xjGM1WQ7OIAh6cem3XaGaSgA9isqDGCXOPH-d88qG"
            alt="Modern clinical aesthetic"
            referrerPolicy="no-referrer"
          />
          
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="checklist-card"
          >
            <div className="icon-circle">
              <Moon className="icon-moon" style={{ color: 'var(--primary)', width: '1.5rem', height: '1.5rem' }} />
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>Evening Checklist</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>3 medications scheduled for 9:00 PM</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
