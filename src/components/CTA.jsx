import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useHealth } from '../context/HealthContext.jsx';

export default function CTA() {
  const { user } = useHealth();

  return (
    <section className="cta-section">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="cta-card"
      >
        <div className="cta-glow"></div>
        <div className="cta-glow-secondary"></div>
        <span className="cta-eyebrow">No more sticky notes</span>
        <h2 className="cta-title">
          Start your <span className="cta-title-accent">wellness routine</span> today.
        </h2>
        <p className="cta-description">
          Never miss a medication or appointment again. It takes less than two minutes to set up.
        </p>

        <Link
          to={user ? '/dashboard' : '/signup'}
          className="cta-main-btn"
        >
          {user ? 'Go to Dashboard' : 'Start Tracking — Free'}
        </Link>

        <div className="cta-trust-row">
          <span>No credit card required</span>
          <span className="cta-trust-dot">•</span>
          <span>Free forever plan</span>
          <span className="cta-trust-dot">•</span>
          <span>Set up in 2 minutes</span>
        </div>
      </motion.div>
    </section>
  );
}
