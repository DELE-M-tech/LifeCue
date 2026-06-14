import { motion } from 'motion/react';
import { Pill, Calendar, Droplet, ArrowRight, Moon } from 'lucide-react';

export default function Features() {
  return (
    <section className="features">
      <div className="max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="section-header"
        >
          <span className="section-eyebrow">How it works</span>
          <h2 className="section-title">Everything you need, nothing you don't.</h2>
          <p className="section-description">
            Three simple tools that work together — so you spend less time
            managing your health and more time living your life.
          </p>
        </motion.div>

        <div className="features-grid">
          {/* Medication Management */}
          <motion.div
            id="medication"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="feature-card card-medication"
          >
            <div style={{ zIndex: 10 }}>
              <div className="feature-icon-wrap" style={{ backgroundColor: 'var(--primary-container)' }}>
                <Pill className="feature-icon" style={{ color: 'var(--primary)' }} />
              </div>
              <h3 className="feature-title">Medication reminders</h3>
              <p className="feature-description" style={{ maxWidth: '24rem' }}>
                Add your medications once and LifeCue handles the rest —
                clear daily reminders, dose tracking, and a simple log of
                what you've taken.
              </p>
            </div>
            <div style={{ marginTop: '2rem', zIndex: 10 }}>
              <a href="/#medication" className="feature-link">
                See how it works <ArrowRight style={{ width: '1.1rem', height: '1.1rem' }} />
              </a>
            </div>
            <svg className="feature-bg-image" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect width="400" height="400" fill="var(--surface-container-low)" />
              <circle cx="290" cy="150" r="90" fill="var(--primary-container)" />
              <rect x="220" y="200" width="160" height="60" rx="16" fill="#ffffff" stroke="var(--outline-variant)" />
              <circle cx="250" cy="230" r="10" fill="var(--primary)" />
              <rect x="270" y="220" width="90" height="8" rx="4" fill="var(--outline)" />
              <rect x="270" y="236" width="60" height="8" rx="4" fill="var(--outline-variant)" />
              <rect x="220" y="280" width="160" height="60" rx="16" fill="#ffffff" stroke="var(--outline-variant)" />
              <circle cx="250" cy="310" r="10" fill="var(--secondary)" />
              <rect x="270" y="300" width="90" height="8" rx="4" fill="var(--outline)" />
              <rect x="270" y="316" width="60" height="8" rx="4" fill="var(--outline-variant)" />
            </svg>
          </motion.div>

          {/* Appointment Calendar */}
          <motion.div
            id="appointments"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="feature-card card-calendar"
          >
            <div style={{ zIndex: 10 }}>
              <div className="feature-icon-wrap" style={{ backgroundColor: 'rgba(255,255,255,0.6)' }}>
                <Calendar className="feature-icon" style={{ color: 'var(--on-primary-container)' }} />
              </div>
              <h3 className="feature-title">Appointment tracking</h3>
              <p className="feature-description">
                Keep every appointment in one calendar, with reminders the
                day before so you're never caught off guard.
              </p>
            </div>
            <div className="calendar-preview">
              <div className="calendar-item">
                <p style={{ fontSize: '0.65rem', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Tomorrow</p>
                <p style={{ fontSize: '0.95rem', fontWeight: '700' }}>Dr. Adeyemi — 10:30 AM</p>
              </div>
            </div>
          </motion.div>

          {/* Wellness Logger */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="feature-card card-wellness"
          >
            <div className="feature-icon-wrap" style={{ backgroundColor: 'rgba(255,255,255,0.6)' }}>
              <Droplet className="feature-icon" style={{ color: 'var(--secondary)' }} />
            </div>
            <h3 className="feature-title">Daily wellness log</h3>
            <p className="feature-description" style={{ marginBottom: '1.5rem' }}>
              Track water, sleep, and movement in seconds. Small habits,
              tracked consistently, add up to better days.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span className="tag-pill">Sleep</span>
              <span className="tag-pill">Hydration</span>
              <span className="tag-pill">Steps</span>
            </div>
          </motion.div>

          {/* Insights Accent */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="feature-card card-accent"
          >
            <svg className="accent-image" viewBox="0 0 500 400" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
              <rect width="500" height="400" fill="var(--surface-container)" />
              <circle cx="380" cy="80" r="140" fill="var(--primary-container)" opacity="0.6" />
              <circle cx="450" cy="320" r="100" fill="var(--secondary-container)" opacity="0.7" />
            </svg>
            <div className="accent-overlay">
              <div>
                <Moon style={{ width: '2rem', height: '2rem', color: 'var(--primary)', marginBottom: '1rem' }} />
                <p className="accent-quote">
                  "A few minutes each evening is all it takes to stay on top of tomorrow."
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}