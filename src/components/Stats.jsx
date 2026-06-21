import { motion, useInView, useMotionValue, useTransform, animate } from 'motion/react';
import { useEffect, useRef } from 'react';

const stats = [
  { value: 98, suffix: '%', label: 'On-time reminders', color: 'var(--primary)' },
  { value: 12, suffix: 'k+', label: 'People using LifeCue', color: 'var(--secondary)' },
  { value: 24, suffix: '/7', label: 'Always tracking', color: 'var(--tertiary)', noCount: true },
  { value: 4.9, suffix: '', label: 'Average rating', color: 'var(--on-surface)', decimals: 1 },
];

function CountUpValue({ value, suffix, decimals = 0, noCount = false }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) =>
    decimals > 0 ? latest.toFixed(decimals) : Math.floor(latest)
  );

  useEffect(() => {
    if (isInView && !noCount) {
      const controls = animate(motionValue, value, {
        duration: 1.4,
        ease: 'easeOut',
      });
      return controls.stop;
    }
  }, [isInView, value, motionValue, noCount]);

  if (noCount) {
    return <span ref={ref}>{value}{suffix}</span>;
  }

  return (
    <span ref={ref}>
      <motion.span>{rounded}</motion.span>{suffix}
    </span>
  );
}

export default function Stats() {
  return (
    <section id="insights" className="stats">
      <div className="max-w-7xl stats-grid">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="stat-item"
          >
            <p className="stat-value" style={{ color: stat.color }}>
              <CountUpValue
                value={stat.value}
                suffix={stat.suffix}
                decimals={stat.decimals}
                noCount={stat.noCount}
              />
            </p>
            <p className="stat-label">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
