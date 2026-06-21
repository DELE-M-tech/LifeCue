import { motion } from 'motion/react';
import { UserPlus, ListPlus, BellRing } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useHealth } from '../context/HealthContext.jsx';

const steps = [
  {
    number: '01',
    icon: UserPlus,
    title: 'Create your account',
    description: 'Sign up in seconds with email or Google. No paperwork, no setup calls.',
    color: 'var(--primary)',
    bg: 'var(--primary-container)',
  },
  {
    number: '02',
    icon: ListPlus,
    title: 'Add your medications & appointments',
    description: 'Tell LifeCue what you take and when, plus any upcoming appointments. It only takes a couple of minutes.',
    color: 'var(--secondary)',
    bg: 'var(--secondary-container)',
  },
  {
    number: '03',
    icon: BellRing,
    title: 'Get reminded, automatically',
    description: 'From here on, LifeCue tracks everything and reminds you exactly when it matters — no extra effort required.',
    color: 'var(--tertiary)',
    bg: 'var(--tertiary-container)',
  },
];

export default function HowItWorks() {
  const { user } = useHealth();

  return (
    <section className="how-it-works">
      <div className="max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="section-header"
          style={{ margin: '0 auto 4rem', textAlign: 'center', maxWidth: '36rem' }}
        >
          <span className="section-eyebrow">Getting started</span>
          <h2 className="section-title">Up and running in three steps.</h2>
          <p className="section-description">
            No complicated setup. Just sign up, tell LifeCue about your routine,
            and let it take care of the rest.
          </p>
        </motion.div>

        <div className="steps-grid">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.12 }}
                className="step-card"
              >
                <div className="step-number">{step.number}</div>
                <div className="step-icon-wrap" style={{ backgroundColor: step.bg }}>
                  <Icon className="step-icon" style={{ color: step.color }} />
                </div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
                {index < steps.length - 1 && <div className="step-connector" />}
              </motion.div>
            );
          })}
        </div>

        {!user && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginTop: '3.5rem' }}
          >
            <Link to="/signup" className="btn-cta btn-cta-primary cta-gradient" style={{ textDecoration: 'none', display: 'inline-block' }}>
              Get Started Free
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
