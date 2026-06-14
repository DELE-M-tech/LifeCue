import { motion } from 'motion/react';

const stats = [
  { value: "98%", label: "Medications On Time", color: "var(--primary)" },
  { value: "12k+", label: "Active Users", color: "var(--secondary)" },
  { value: "24/7", label: "Always Available", color: "var(--tertiary)" },
  { value: "4.9", label: "User Rating", color: "var(--on-surface)" },
];

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
            <p className="stat-value" style={{ color: stat.color }}>{stat.value}</p>
            <p className="stat-label">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
