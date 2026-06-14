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
        <h2 className="cta-title">Start your wellness journey today.</h2>
        <p className="cta-description">Never miss a medication or appointment. Stay organized, stay well.</p>
        
        <div className="cta-form">
          <input 
            className="cta-input" 
            placeholder="Your email address" 
            type="email"
          />
          <button className="btn-cta btn-cta-primary cta-gradient">
            Get Started
          </button>
        </div>
      </motion.div>
    </section>
  );
}
