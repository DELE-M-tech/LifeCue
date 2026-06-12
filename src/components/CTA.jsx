import { motion } from 'motion/react';

export default function CTA() {
  return (
    <section className="cta-section">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="cta-card"
      >
        <h2 className="cta-title">Join the Evening Sanctuary.</h2>
        <p className="cta-description">Experience health management that respects your time and peace.</p>
        
        <div className="cta-form">
          <input 
            className="cta-input" 
            placeholder="Enter your email" 
            type="email"
          />
          <button className="btn-cta btn-cta-primary cta-gradient">
            Subscribe
          </button>
        </div>
      </motion.div>
    </section>
  );
}
