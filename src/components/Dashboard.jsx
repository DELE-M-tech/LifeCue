import { motion, AnimatePresence } from 'motion/react';
import { Plus, X, Pill, Droplets, Moon, Footprints, ChevronRight, Check, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useHealth } from '../context/HealthContext.jsx';
import AppLayout from './AppLayout.jsx';
import DatePicker from './DatePicker.jsx';

const Spinner = () => (
  <div className="app-loading">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
      className="app-spinner"
    />
  </div>
);

function Modal({ title, subtitle, onClose, children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="modal-overlay" onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 16 }}
        className="modal-content" onClick={e => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}><X size={18} /></button>
        <div className="modal-scroll">
          <div className="modal-header">
            <h2 className="modal-title">{title}</h2>
            <p className="modal-subtitle">{subtitle}</p>
          </div>
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const {
    user, isAuthReady,
    meds, handleAddMed, handleLogMed, handleDeleteMed, medLogsToday,
    appointments, handleAddAppt, handleDeleteAppt, handleToggleAppt,
    stepsGoal, stepsTaken,
    hydrationGoal, hydrationTaken,
    sleepGoal, sleepTaken,
    timeLeft, calculateCompletion, updateTracker
  } = useHealth();

  useEffect(() => {
    if (isAuthReady && !user) navigate('/signin');
  }, [user, isAuthReady, navigate]);

  const [medModal, setMedModal] = useState(false);
  const [apptModal, setApptModal] = useState(false);
  const [trackerModal, setTrackerModal] = useState(null);
  const [loggedId, setLoggedId] = useState(null);
  const [newMed, setNewMed] = useState({ name: '', dose: '', instruction: '', time: '' });
  const [newAppt, setNewAppt] = useState({
    title: '', type: '',
    dateValue: new Date().toISOString().slice(0, 10)
  });
  const [tempTracker, setTempTracker] = useState({ goal: 0, taken: 0 });

  const onAddMed = (e) => {
    e.preventDefault();
    handleAddMed(newMed);
    setNewMed({ name: '', dose: '', instruction: '', time: '' });
    setMedModal(false);
  };

  const onLogMed = (id) => {
    setLoggedId(id);
    setTimeout(() => { handleLogMed(id); setLoggedId(null); }, 1200);
  };

  const onAddAppt = (e) => {
    e.preventDefault();
    const d = new Date(newAppt.dateValue + 'T00:00:00');
    const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
    handleAddAppt({
      title: newAppt.title,
      type: newAppt.type,
      date: d.getDate().toString(),
      month: months[d.getMonth()],
      year: d.getFullYear().toString()
    });
    setNewAppt({ title: '', type: '', dateValue: new Date().toISOString().slice(0, 10) });
    setApptModal(false);
  };

  const openTracker = (type) => {
    const map = {
      steps: { goal: stepsGoal, taken: stepsTaken },
      hydration: { goal: hydrationGoal, taken: hydrationTaken },
      sleep: { goal: sleepGoal, taken: sleepTaken },
    };
    setTempTracker(map[type]);
    setTrackerModal(type);
  };

  const onUpdateTracker = (e) => {
    e.preventDefault();
    updateTracker(trackerModal, Number(tempTracker.taken), Number(tempTracker.goal));
    setTrackerModal(null);
  };

  if (!isAuthReady || !user) return <Spinner />;

  const completion = calculateCompletion();
  const nextMed = meds.find(m => !medLogsToday[m.id]);
  const upcomingAppts = appointments.filter(a => !a.completed);
  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'there';

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric'
  });

  const trackers = [
    {
      key: 'steps', label: 'Steps', icon: Footprints,
      value: stepsTaken.toLocaleString(), goal: stepsGoal.toLocaleString(),
      pct: Math.min(100, (stepsTaken / stepsGoal) * 100),
      iconBg: 'var(--primary-container)', iconColor: 'var(--primary)', barColor: 'var(--primary)'
    },
    {
      key: 'hydration', label: 'Hydration', icon: Droplets,
      value: `${hydrationTaken}L`, goal: `${hydrationGoal}L`,
      pct: Math.min(100, (hydrationTaken / hydrationGoal) * 100),
      iconBg: 'var(--tertiary-container)', iconColor: 'var(--tertiary)', barColor: 'var(--tertiary)'
    },
    {
      key: 'sleep', label: 'Sleep', icon: Moon,
      value: `${sleepTaken}h`, goal: `${sleepGoal}h`,
      pct: Math.min(100, (sleepTaken / sleepGoal) * 100),
      iconBg: 'var(--secondary-container)', iconColor: 'var(--secondary)', barColor: 'var(--secondary)'
    },
  ];

  return (
    <AppLayout>
      <div className="dash-page">

        {/* ── Top bar ── */}
        <div className="dash-topbar">
          <div>
            <h1 className="dash-greeting">{greeting()}, {firstName} 👋</h1>
            <p className="dash-date">{today}</p>
          </div>
          <div className="dash-completion-badge">
            <span className="dash-completion-pct">{completion}%</span>
            <span className="dash-completion-label">Today's completion</span>
          </div>
        </div>

        {/* ── Stacked cards ── */}
        <div className="dash-stack">

          {/* ── Card 1: Medications ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="dash-card"
          >
            <div className="dash-card-header">
              <div className="dash-card-title-row">
                <div className="dash-card-icon-wrap" style={{ background: 'var(--primary-container)' }}>
                  <Pill size={16} style={{ color: 'var(--primary)' }} />
                </div>
                <h2 className="dash-card-title">Medications</h2>
                <span className="dash-count-chip">{meds.length} total</span>
              </div>
              <button className="dash-add-btn" onClick={() => setMedModal(true)}>
                <Plus size={14} /> Add medication
              </button>
            </div>

            <div className="dash-card-body">
              {/* Next dose highlight */}
              {nextMed && (
                <div className="dash-next-dose">
                  <div className="dash-next-dose-left">
                    <span className="dash-next-dose-badge">Next dose</span>
                    <p className="dash-next-dose-name">{nextMed.name}</p>
                    <p className="dash-next-dose-meta">{nextMed.dose} · {nextMed.instruction} · {nextMed.time}</p>
                  </div>
                  <button
                    className="dash-log-btn"
                    onClick={() => onLogMed(nextMed.id)}
                    disabled={loggedId === nextMed.id}
                  >
                    {loggedId === nextMed.id ? <><Check size={15} /> Logged</> : 'Mark taken'}
                  </button>
                </div>
              )}

              {/* Med list */}
              {meds.length === 0 ? (
                <div className="dash-empty-state">
                  <Pill size={28} style={{ opacity: 0.2 }} />
                  <p>No medications added yet.</p>
                  <button className="dash-empty-cta" onClick={() => setMedModal(true)}>Add your first medication</button>
                </div>
              ) : (
                <div className="dash-med-row-list">
                  {meds.map(med => (
                    <div key={med.id} className={`dash-med-row ${medLogsToday[med.id] ? 'taken' : ''}`}>
                      <div className="dash-med-row-dot" style={{ background: medLogsToday[med.id] ? 'var(--secondary)' : 'var(--primary)' }} />
                      <div className="dash-med-row-info">
                        <span className="dash-med-row-name">{med.name}</span>
                        <span className="dash-med-row-meta">{med.dose} · {med.time}</span>
                      </div>
                      {medLogsToday[med.id]
                        ? <span className="dash-taken-chip">✓ Taken</span>
                        : <button className="dash-med-row-log" onClick={() => onLogMed(med.id)} disabled={loggedId === med.id}>
                            {loggedId === med.id ? '...' : 'Log'}
                          </button>
                      }
                      <button className="dash-delete-btn" onClick={() => handleDeleteMed(med.id)}><X size={13} /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* ── Card 2: Appointments ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="dash-card"
          >
            <div className="dash-card-header">
              <div className="dash-card-title-row">
                <div className="dash-card-icon-wrap" style={{ background: 'var(--tertiary-container)' }}>
                  <Calendar size={16} style={{ color: 'var(--tertiary)' }} />
                </div>
                <h2 className="dash-card-title">Appointments</h2>
                <span className="dash-count-chip">{upcomingAppts.length} upcoming</span>
              </div>
              <button className="dash-add-btn" onClick={() => setApptModal(true)}>
                <Plus size={14} /> Add appointment
              </button>
            </div>

            <div className="dash-card-body">
              {appointments.length === 0 ? (
                <div className="dash-empty-state">
                  <Calendar size={28} style={{ opacity: 0.2 }} />
                  <p>No appointments scheduled yet.</p>
                  <button className="dash-empty-cta" onClick={() => setApptModal(true)}>Schedule your first appointment</button>
                </div>
              ) : (
                <div className="dash-appt-row-list">
                  {appointments.map(apt => (
                    <div key={apt.id} className={`dash-appt-row ${apt.completed ? 'completed' : ''}`}>
                      <div className="dash-appt-row-date">
                        <span className="dash-appt-row-month">{apt.month}</span>
                        <span className="dash-appt-row-day">{apt.date}</span>
                        <span className="dash-appt-row-year">{apt.year}</span>
                      </div>
                      <div className="dash-appt-row-info" onClick={() => handleToggleAppt(apt.id)}>
                        <span className="dash-appt-row-title">{apt.title}</span>
                        {apt.type && <span className="dash-appt-row-type">{apt.type}</span>}
                      </div>
                      <div className="dash-appt-row-actions">
                        <button
                          className={`dash-appt-toggle ${apt.completed ? 'done' : ''}`}
                          onClick={() => handleToggleAppt(apt.id)}
                          title={apt.completed ? 'Mark incomplete' : 'Mark complete'}
                        >
                          <Check size={13} />
                        </button>
                        <button className="dash-delete-btn" onClick={() => handleDeleteAppt(apt.id)}><X size={13} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* ── Card 3: Today's Goals ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="dash-card"
          >
            <div className="dash-card-header">
              <div className="dash-card-title-row">
                <div className="dash-card-icon-wrap" style={{ background: 'var(--secondary-container)' }}>
                  <Footprints size={16} style={{ color: 'var(--secondary)' }} />
                </div>
                <h2 className="dash-card-title">Today's Goals</h2>
                <span className="dash-count-chip">Resets in {timeLeft}</span>
              </div>
              <div className="dash-completion-mini">
                <span style={{ color: 'var(--primary)', fontWeight: 800 }}>{completion}%</span>
                <span style={{ color: 'var(--on-surface-muted)', fontSize: '0.75rem', fontWeight: 600 }}>complete</span>
              </div>
            </div>

            <div className="dash-card-body">
              <div className="dash-tracker-row-list">
                {trackers.map(({ key, label, icon: Icon, value, goal, pct, iconBg, iconColor, barColor }) => (
                  <button key={key} className="dash-tracker-row" onClick={() => openTracker(key)}>
                    <div className="dash-tracker-row-icon" style={{ background: iconBg }}>
                      <Icon size={17} style={{ color: iconColor }} />
                    </div>
                    <div className="dash-tracker-row-info">
                      <div className="dash-tracker-row-top">
                        <span className="dash-tracker-row-label">{label}</span>
                        <span className="dash-tracker-row-value">{value} <span className="dash-tracker-row-goal">/ {goal}</span></span>
                      </div>
                      <div className="dash-tracker-row-bar">
                        <motion.div
                          className="dash-tracker-row-fill"
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          style={{ background: barColor }}
                        />
                      </div>
                    </div>
                    <ChevronRight size={15} style={{ color: 'var(--on-surface-muted)', flexShrink: 0 }} />
                  </button>
                ))}
              </div>

              {/* Completion ring */}
              <div className="dash-ring-row">
                <svg width="72" height="72" viewBox="0 0 72 72">
                  <circle cx="36" cy="36" r="28" fill="none" stroke="var(--surface-container)" strokeWidth="7" />
                  <motion.circle
                    cx="36" cy="36" r="28"
                    fill="none"
                    stroke="url(#ringGrad)"
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 28}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 28 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 28 * (1 - completion / 100) }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    transform="rotate(-90 36 36)"
                  />
                  <defs>
                    <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#0a84ff" />
                      <stop offset="100%" stopColor="#14b8a6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div>
                  <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.02em', lineHeight: 1 }}>{completion}%</p>
                  <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--on-surface)', marginTop: '0.2rem' }}>Daily completion</p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--on-surface-muted)' }}>Resets at midnight</p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* ── Modals ── */}
      <AnimatePresence>
        {medModal && (
          <Modal title="Add Medication" subtitle="Track a new medication in your daily schedule." onClose={() => setMedModal(false)}>
            <form onSubmit={onAddMed}>
              <div className="form-grid">
                <div className="form-group form-group-full">
                  <label className="form-label">Medication name</label>
                  <input className="form-input" placeholder="e.g. Paracetamol" value={newMed.name} onChange={e => setNewMed({...newMed, name: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Dosage</label>
                  <input className="form-input" placeholder="e.g. 500mg" value={newMed.dose} onChange={e => setNewMed({...newMed, dose: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Time</label>
                  <input className="form-input" placeholder="e.g. 8:00 PM" value={newMed.time} onChange={e => setNewMed({...newMed, time: e.target.value})} required />
                </div>
                <div className="form-group form-group-full">
                  <label className="form-label">Instructions</label>
                  <input className="form-input" placeholder="e.g. Take with food" value={newMed.instruction} onChange={e => setNewMed({...newMed, instruction: e.target.value})} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setMedModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary-modal">Add Medication</button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {apptModal && (
          <Modal title="Add Appointment" subtitle="Schedule a health visit or consultation." onClose={() => setApptModal(false)}>
            <form onSubmit={onAddAppt}>
              <div className="form-grid">
                <div className="form-group form-group-full">
                  <label className="form-label">Title / Doctor</label>
                  <input className="form-input" placeholder="e.g. Dr. Adeyemi" value={newAppt.title} onChange={e => setNewAppt({...newAppt, title: e.target.value})} required />
                </div>
                <div className="form-group form-group-full">
                  <label className="form-label">Date</label>
                  <DatePicker
                    value={newAppt.dateValue}
                    onChange={(iso) => setNewAppt({...newAppt, dateValue: iso})}
                  />
                </div>
                <div className="form-group form-group-full">
                  <label className="form-label">Details</label>
                  <input className="form-input" placeholder="e.g. Cardiology · 2:30 PM" value={newAppt.type} onChange={e => setNewAppt({...newAppt, type: e.target.value})} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setApptModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary-modal">Schedule</button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {trackerModal && (
          <Modal
            title={`Update ${trackerModal.charAt(0).toUpperCase() + trackerModal.slice(1)}`}
            subtitle="Log your progress and adjust your daily goal."
            onClose={() => setTrackerModal(null)}
          >
            <form onSubmit={onUpdateTracker}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    {trackerModal === 'steps' ? 'Steps taken' : trackerModal === 'hydration' ? 'Litres drunk' : 'Hours slept'}
                  </label>
                  <input type="number" step={trackerModal === 'steps' ? '1' : '0.1'} className="form-input"
                    value={tempTracker.taken} onChange={e => setTempTracker({...tempTracker, taken: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Daily goal</label>
                  <input type="number" step={trackerModal === 'steps' ? '100' : '0.1'} className="form-input"
                    value={tempTracker.goal} onChange={e => setTempTracker({...tempTracker, goal: e.target.value})} required />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setTrackerModal(null)}>Cancel</button>
                <button type="submit" className="btn-primary-modal">Save</button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}
