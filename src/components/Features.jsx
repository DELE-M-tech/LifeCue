import { motion } from 'motion/react';
import { Pill, Calendar, LineChart, ArrowRight } from 'lucide-react';

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
          <h2 className="section-title">Precision tools for a balanced life.</h2>
          <p className="section-description">Every feature is designed to reduce cognitive load, allowing you to focus on restoration and recovery.</p>
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
              <Pill className="feature-icon" style={{ color: 'var(--primary)' }} />
              <h3 className="feature-title">Medication Management</h3>
              <p className="feature-description" style={{ maxWidth: '28rem' }}>
                Never miss a dose with intelligent reminders and secure tracking. Integrated with your healthcare provider for real-time updates.
              </p>
            </div>
            <div style={{ marginTop: '2rem', zIndex: 10 }}>
              <a href="#" className="feature-link">
                Explore Tracking <ArrowRight style={{ width: '1.25rem', height: '1.25rem' }} />
              </a>
            </div>
            <img 
              className="feature-bg-image" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAafcPkROJrSoDi8Zhnv3PqRH7ikRoE0O3_mJ0z8QV6JIG90EIM8ePobAXi8Vw_GAUYe_AV57pDxF7l22XU75BXjI535iBGedHipCU5uAlj_HXs_5DiC9qSBZzYJvn6KSSuii7eW2j4UR2aq4wmucKss7jYJVweV4XOPKcl4y6s4E6szutNGSe2D32OHDl5P5-lIr7QEuRTchgKE0NBjlhCihSk1871lemoREhIQEpbqLKRqYE9Bvrlm6rFZ0DhbgMEw1gExZ5o9E9W"
              alt="Medication interface"
              referrerPolicy="no-referrer"
            />
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
              <Calendar className="feature-icon" style={{ color: 'var(--secondary)' }} />
              <h3 className="feature-title">Appointment Calendar</h3>
              <p className="feature-description">
                Keep your healthcare schedule organized and accessible. Seamlessly sync with professional clinical systems.
              </p>
            </div>
            <div className="calendar-preview">
              <div className="calendar-item">
                <p style={{ fontSize: '0.625rem', fontWeight: 'bold', color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Tomorrow</p>
                <p style={{ fontSize: '0.875rem', fontWeight: '600' }}>Dr. Aris Thorne — 9:00 AM</p>
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
            <LineChart className="feature-icon" style={{ color: 'var(--tertiary)' }} />
            <h3 className="feature-title">Wellness Logger</h3>
            <p className="feature-description" style={{ marginBottom: '1.5rem' }}>
              Track hydration, sleep, and movement to achieve your nocturnal health goals.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span style={{ padding: '0.25rem 0.75rem', backgroundColor: 'rgba(139, 71, 91, 0.3)', color: 'var(--on-tertiary-container)', borderRadius: '9999px', fontSize: '0.625rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Sleep</span>
              <span style={{ padding: '0.25rem 0.75rem', backgroundColor: 'rgba(139, 71, 91, 0.3)', color: 'var(--on-tertiary-container)', borderRadius: '9999px', fontSize: '0.625rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Vitals</span>
            </div>
          </motion.div>

          {/* Visual Accents */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="feature-card card-accent"
          >
            <img 
              className="accent-image" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuChS5Aa2xWX0HEVGkXS03utcVy3tVn4s3iNwITRdKxuNV0uc5t_NqixVvbxdiOURPCDrOUyN7TmJPoj9F4ahy4HWPHMeRnKqVi1W3KrVXg2JB3jYu02jHqYqqkuE1kyRbhTLS98OnOLqxPfAx-KNH7cs5k_rph6pXhplSwb-tTxRcj-1kO9l-1oQlcl8tnKIvapNaKDEe-Kea3e-VMaweyU8oHtuvkOjNn14slbZcsciHyZLmiDZig2_brFEkdr524pu1uHhPwNJiDX"
              alt="Neural restoration"
              referrerPolicy="no-referrer"
            />
            <div className="accent-overlay">
              <p className="accent-quote">
                "The evening is the foundation of tomorrow's health."
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
