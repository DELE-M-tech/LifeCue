import { motion, AnimatePresence } from 'motion/react';
import { Plus, Bell, Settings, Droplets, ChevronRight, X, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useHealth } from '../context/HealthContext.jsx';

export default function Dashboard() {
  const navigate = useNavigate();
  const {
    user, isAuthReady, logout,
    meds, handleAddMed, handleLogMed, handleDeleteMed,
    appointments, handleAddAppt, handleDeleteAppt, handleToggleAppt,
    stepsGoal, setStepsGoal, stepsTaken, setStepsTaken,
    hydrationGoal, setHydrationGoal, hydrationTaken, setHydrationTaken,
    sleepGoal, setSleepGoal, sleepTaken, setSleepTaken,
    timeLeft, calculateCompletion, handleUpdateGoals
  } = useHealth();

  useEffect(() => {
    if (isAuthReady && !user) {
      navigate('/signin');
    }
  }, [user, isAuthReady, navigate]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMed, setNewMed] = useState({ name: '', dose: '', instruction: '', time: '' });
  const [loggedId, setLoggedId] = useState(null);
  const [isApptModalOpen, setIsApptModalOpen] = useState(false);
  const [newAppt, setNewAppt] = useState({ 
    title: '', 
    type: '', 
    date: new Date().getDate().toString(), 
    month: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"][new Date().getMonth()],
    year: new Date().getFullYear().toString()
  });

  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const years = [new Date().getFullYear().toString(), (new Date().getFullYear() + 1).toString()];
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());

  const [isStepsModalOpen, setIsStepsModalOpen] = useState(false);
  const [tempSteps, setTempSteps] = useState({ goal: stepsGoal, taken: stepsTaken });

  const [isHydrationModalOpen, setIsHydrationModalOpen] = useState(false);
  const [tempHydration, setTempHydration] = useState({ goal: hydrationGoal, taken: hydrationTaken });

  const [isSleepModalOpen, setIsSleepModalOpen] = useState(false);
  const [tempSleep, setTempSleep] = useState({ goal: sleepGoal, taken: sleepTaken });

  const onAddMed = (e) => {
    e.preventDefault();
    if (!newMed.name || !newMed.dose) return;
    handleAddMed(newMed);
    setNewMed({ name: '', dose: '', instruction: '', time: '' });
    setIsModalOpen(false);
  };

  const onLogMed = (id) => {
    setLoggedId(id);
    setTimeout(() => {
      handleLogMed(id);
      setLoggedId(null);
    }, 2000);
  };

  const onAddAppt = (e) => {
    e.preventDefault();
    if (!newAppt.title || !newAppt.date) return;
    handleAddAppt(newAppt);
    setNewAppt({ 
      title: '', 
      type: '', 
      date: new Date().getDate().toString(), 
      month: months[new Date().getMonth()],
      year: new Date().getFullYear().toString()
    });
    setIsApptModalOpen(false);
  };

  const handleUpdateSteps = (e) => {
    e.preventDefault();
    handleUpdateGoals({ stepsGoal: Number(tempSteps.goal) });
    setStepsTaken(Number(tempSteps.taken));
    setIsStepsModalOpen(false);
  };

  const handleUpdateHydration = (e) => {
    e.preventDefault();
    handleUpdateGoals({ hydrationGoal: Number(tempHydration.goal) });
    setHydrationTaken(Number(tempHydration.taken));
    setIsHydrationModalOpen(false);
  };

  const handleUpdateSleep = (e) => {
    e.preventDefault();
    handleUpdateGoals({ sleepGoal: Number(tempSleep.goal) });
    setSleepTaken(Number(tempSleep.taken));
    setIsSleepModalOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!isAuthReady || !user) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)' }}>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} style={{ width: '40px', height: '40px', border: '4px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%' }} />
      </div>
    );
  }

  const completionPercentage = calculateCompletion();

  return (
    <div className="dashboard-container">
      {/* Dashboard Nav */}
      <nav className="navbar glass-header" style={{ position: 'fixed', top: 0, width: '100%', zIndex: 100 }}>
        <div className="nav-container max-w-7xl" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '5rem' }}>
          <div className="logo">
            <Link to="/" style={{ textDecoration: 'none' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--on-surface)', margin: 0 }}>LifeCue</h3>
            </Link>
          </div>
          
          <div className="nav-links" style={{ display: 'flex', gap: '2rem' }}>
            <Link to="/dashboard" className="nav-link active" style={{ color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none' }}>Dashboard</Link>
            <Link to="/medications" className="nav-link" style={{ color: 'var(--on-surface-variant)', textDecoration: 'none' }}>Medications</Link>
            <Link to="/calendar" className="nav-link" style={{ color: 'var(--on-surface-variant)', textDecoration: 'none' }}>Calendar</Link>
            <Link to="#" className="nav-link" style={{ color: 'var(--on-surface-variant)', textDecoration: 'none' }}>Logger</Link>
          </div>

          <div className="nav-actions" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <Bell size={20} className="nav-link" style={{ cursor: 'pointer' }} />
            <Settings size={20} className="nav-link" style={{ cursor: 'pointer' }} />
            <div 
              onClick={handleLogout}
              className="profile-circle" 
              style={{ width: '32px', height: '32px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--primary)', cursor: 'pointer' }}
              title="Logout"
            >
              <img src={user.photoURL || "https://i.pravatar.cc/150?u=favour"} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl">
        {/* Header Section */}
        <header className="dashboard-header">
          <div>
            <p className="daily-summary-label">Daily Summary</p>
            <h1 className="dashboard-title">Stay mindful.</h1>
            <p className="dashboard-subtitle">
              Your wellness journey is a narrative of small, intentional choices. Here is your progress today.
            </p>
          </div>
          <div className="goal-completion-card">
            <span className="goal-percentage">{completionPercentage}%</span>
            <span className="goal-label">Goal Completion</span>
          </div>
        </header>

        {/* Top Grid */}
        <div className="dashboard-grid">
          {/* Featured Next Dose Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {meds.filter(m => !m.taken).length > 0 ? (
              <motion.div 
                key={meds.find(m => !m.taken).id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="med-card"
              >
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                  <span className="med-badge">{meds.find(m => !m.taken).status}</span>
                  <span className="med-time">{meds.find(m => !m.taken).time}</span>
                </div>
                <h2 className="med-name">{meds.find(m => !m.taken).name}</h2>
                <p className="med-info">{meds.find(m => !m.taken).dose} • {meds.find(m => !m.taken).instruction}</p>
                <button 
                  className="med-log-btn"
                  onClick={() => onLogMed(meds.find(m => !m.taken).id)}
                  disabled={loggedId === meds.find(m => !m.taken).id}
                >
                  {loggedId === meds.find(m => !m.taken).id ? 'Logged ✓' : 'Log Medication'}
                </button>
                
                {/* Decorative pill image */}
                <img 
                  src="https://picsum.photos/seed/pills/400/300" 
                  alt="" 
                  className="med-pill-img"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            ) : (
              <div className="med-card" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                <p style={{ color: 'var(--on-surface-variant)' }}>
                  {meds.length > 0 ? 'All medications taken for today!' : 'No medications scheduled.'}
                </p>
              </div>
            )}
          </div>

          {/* Goals & Hydration Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="weekly-goals-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h3 className="goals-header" style={{ marginBottom: 0 }}>Daily Goals</h3>
                <button 
                  onClick={() => {
                    setTempSteps({ goal: stepsGoal, taken: stepsTaken });
                    setIsStepsModalOpen(true);
                  }}
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}
                >
                  Update
                </button>
              </div>
              <div className="goal-item">
                <div className="goal-info">
                  <span>Daily Steps</span>
                  <span>{stepsTaken.toLocaleString()} / {stepsGoal.toLocaleString()}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${Math.min(100, (stepsTaken / stepsGoal) * 100)}%` }}></div>
                </div>
              </div>
              <div className="goal-item">
                <div className="goal-info">
                  <span>Reset Timer</span>
                  <span>{timeLeft}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ 
                    width: `${( (new Date().getHours() * 3600 + new Date().getMinutes() * 60 + new Date().getSeconds()) / 86400 ) * 100}%`,
                    transition: 'none'
                  }}></div>
                </div>
              </div>
            </div>

            <div className="hydration-card" style={{ position: 'relative' }}>
              <div className="hydration-icon">
                <Droplets size={24} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p className="hydration-label" style={{ marginBottom: 0 }}>Hydration</p>
                  <button 
                    onClick={() => {
                      setTempHydration({ goal: hydrationGoal, taken: hydrationTaken });
                      setIsHydrationModalOpen(true);
                    }}
                    style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}
                  >
                    Update
                  </button>
                </div>
                <p className="hydration-value">{hydrationTaken} / {hydrationGoal} Liters</p>
                <div className="progress-bar" style={{ marginTop: '0.5rem', height: '4px' }}>
                  <div className="progress-fill" style={{ width: `${Math.min(100, (hydrationTaken / hydrationGoal) * 100)}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="bottom-grid">
          {/* Sleep Card */}
          <div className="sleep-card">
            <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginBottom: '-1rem' }}>
              <button 
                onClick={() => {
                  setTempSleep({ goal: sleepGoal, taken: sleepTaken });
                  setIsSleepModalOpen(true);
                }}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: 'var(--primary)', 
                  cursor: 'pointer', 
                  fontSize: '0.75rem', 
                  fontWeight: 'bold',
                  padding: '0.5rem'
                }}
              >
                Update
              </button>
            </div>
            
            <div className="sleep-ring-container">
              <svg className="sleep-ring-svg" width="180" height="180" viewBox="0 0 180 180">
                <circle 
                  className="sleep-ring-bg" 
                  cx="90" cy="90" r="75" 
                />
                <motion.circle 
                  className="sleep-ring-progress" 
                  cx="90" cy="90" r="75"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: Math.min(1, sleepTaken / sleepGoal) }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </svg>
              <div className="sleep-ring-inner">
                <motion.span 
                  className="sleep-value"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {sleepTaken}h
                </motion.span>
                <span className="sleep-label">of {sleepGoal}h Goal</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Medication Schedule Card */}
            <div className="appointments-card">
              <div className="appointments-header">
                <h3>Medication Schedule</h3>
                <span className="view-calendar" style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>
                  {meds.length} Total
                </span>
              </div>
              <div className="appointments-list">
                {meds.length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--on-surface-variant)', fontSize: '0.875rem' }}>
                    No medications scheduled.
                  </div>
                ) : (
                  meds.map((med) => (
                    <div key={med.id} className="appointment-item">
                      <div className="date-box" style={{ background: 'rgba(181, 26, 43, 0.1)', color: 'var(--primary)' }}>
                        <Droplets size={20} />
                      </div>
                      <div className="appointment-details" style={{ opacity: med.taken ? 0.5 : 1 }}>
                        <h4 style={{ textDecoration: med.taken ? 'line-through' : 'none' }}>{med.name}</h4>
                        <p>{med.dose} • {med.time} {med.taken && '✓'}</p>
                      </div>
                      <button 
                        onClick={() => handleDeleteMed(med.id)}
                        style={{ 
                          marginLeft: 'auto', 
                          background: 'none', 
                          border: 'none', 
                          color: 'var(--on-surface-variant)', 
                          cursor: 'pointer',
                          padding: '0.5rem',
                          opacity: 0.6
                        }}
                        title="Remove Medication"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Appointments Card */}
            <div className="appointments-card">
              <div className="appointments-header">
                <h3>Upcoming Appointments</h3>
                <button 
                  onClick={() => setIsApptModalOpen(true)}
                  className="view-calendar"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white' }}
                >
                  + Add New
                </button>
              </div>
              <div className="appointments-list">
                {appointments.length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--on-surface-variant)', fontSize: '0.875rem' }}>
                    No upcoming appointments.
                  </div>
                ) : (
                  appointments.map((apt) => (
                    <div key={apt.id} className="appointment-item" style={{ opacity: apt.completed ? 0.5 : 1 }}>
                      <div 
                        className="date-box" 
                        onClick={() => handleToggleAppt(apt.id)}
                        style={{ cursor: 'pointer', background: apt.completed ? 'rgba(255, 255, 255, 0.05)' : 'rgba(181, 26, 43, 0.1)', height: 'auto', minHeight: '60px', padding: '0.5rem' }}
                      >
                        <span className="date-month" style={{ fontSize: '0.65rem' }}>{apt.month} {apt.year}</span>
                        <span className="date-day">{apt.date}</span>
                      </div>
                      <div className="appointment-details" onClick={() => handleToggleAppt(apt.id)} style={{ cursor: 'pointer' }}>
                        <h4 style={{ textDecoration: apt.completed ? 'line-through' : 'none' }}>{apt.title}</h4>
                        <p>{apt.type} {apt.completed && '✓'}</p>
                      </div>
                      <button 
                        onClick={() => handleDeleteAppt(apt.id)}
                        style={{ 
                          marginLeft: 'auto', 
                          background: 'none', 
                          border: 'none', 
                          color: 'var(--primary)', 
                          cursor: 'pointer',
                          padding: '0.5rem',
                          opacity: 0.6
                        }}
                        title="Remove Appointment"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FAB */}
      <button className="fab-add" onClick={() => setIsModalOpen(true)}>
        <Plus size={28} />
      </button>

      {/* Add Medication Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
              
              <div className="modal-header">
                <h2 className="modal-title">New Medication</h2>
                <p className="modal-subtitle">Add a new drug to your daily tracking sanctuary.</p>
              </div>

              <form onSubmit={onAddMed}>
                <div className="form-grid">
                  <div className="form-group form-group-full">
                    <label className="form-label">Drug Name</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Lisinopril"
                      value={newMed.name}
                      onChange={(e) => setNewMed({...newMed, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Dosage</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. 10mg"
                      value={newMed.dose}
                      onChange={(e) => setNewMed({...newMed, dose: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Time</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. 08:00 AM"
                      value={newMed.time}
                      onChange={(e) => setNewMed({...newMed, time: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group form-group-full">
                    <label className="form-label">Instructions</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Take with water"
                      value={newMed.instruction}
                      onChange={(e) => setNewMed({...newMed, instruction: e.target.value})}
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn-primary-modal">Add Medication</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Add Appointment Modal */}
      <AnimatePresence>
        {isApptModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={() => setIsApptModalOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={() => setIsApptModalOpen(false)}>
                <X size={20} />
              </button>
              
              <div className="modal-header">
                <h2 className="modal-title">New Appointment</h2>
                <p className="modal-subtitle">Schedule a new session in your wellness calendar.</p>
              </div>

              <form onSubmit={onAddAppt}>
                <div className="form-grid">
                  <div className="form-group form-group-full">
                    <label className="form-label">Title / Doctor</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Dr. Rodriguez"
                      value={newAppt.title}
                      onChange={(e) => setNewAppt({...newAppt, title: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Day</label>
                    <select 
                      className="form-input" 
                      value={newAppt.date}
                      onChange={(e) => setNewAppt({...newAppt, date: e.target.value})}
                      required
                    >
                      {days.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Month</label>
                    <select 
                      className="form-input" 
                      value={newAppt.month}
                      onChange={(e) => setNewAppt({...newAppt, month: e.target.value})}
                      required
                    >
                      {months.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Year</label>
                    <select 
                      className="form-input" 
                      value={newAppt.year}
                      onChange={(e) => setNewAppt({...newAppt, year: e.target.value})}
                      required
                    >
                      {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                  <div className="form-group form-group-full">
                    <label className="form-label">Details (Type & Time)</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Physical Therapy • 02:30 PM"
                      value={newAppt.type}
                      onChange={(e) => setNewAppt({...newAppt, type: e.target.value})}
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn-secondary" onClick={() => setIsApptModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn-primary-modal">Schedule Appointment</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Update Steps Modal */}
      <AnimatePresence>
        {isStepsModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={() => setIsStepsModalOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={() => setIsStepsModalOpen(false)}>
                <X size={20} />
              </button>
              
              <div className="modal-header">
                <h2 className="modal-title">Daily Steps</h2>
                <p className="modal-subtitle">Track your movement and set your daily ambition.</p>
              </div>

              <form onSubmit={handleUpdateSteps}>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Steps Taken</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      value={tempSteps.taken}
                      onChange={(e) => setTempSteps({...tempSteps, taken: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Daily Goal</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      value={tempSteps.goal}
                      onChange={(e) => setTempSteps({...tempSteps, goal: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn-secondary" onClick={() => setIsStepsModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn-primary-modal">Update Progress</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Update Hydration Modal */}
      <AnimatePresence>
        {isHydrationModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={() => setIsHydrationModalOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={() => setIsHydrationModalOpen(false)}>
                <X size={20} />
              </button>
              
              <div className="modal-header">
                <h2 className="modal-title">Hydration Tracker</h2>
                <p className="modal-subtitle">Log your water intake and set your daily hydration goal.</p>
              </div>

              <form onSubmit={handleUpdateHydration}>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Liters Drunk</label>
                    <input 
                      type="number" 
                      step="0.1"
                      className="form-input" 
                      value={tempHydration.taken}
                      onChange={(e) => setTempHydration({...tempHydration, taken: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Daily Goal (Liters)</label>
                    <input 
                      type="number" 
                      step="0.1"
                      className="form-input" 
                      value={tempHydration.goal}
                      onChange={(e) => setTempHydration({...tempHydration, goal: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn-secondary" onClick={() => setIsHydrationModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn-primary-modal">Update Hydration</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Update Sleep Modal */}
      <AnimatePresence>
        {isSleepModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={() => setIsSleepModalOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={() => setIsSleepModalOpen(false)}>
                <X size={20} />
              </button>
              
              <div className="modal-header">
                <h2 className="modal-title">Sleep Tracker</h2>
                <p className="modal-subtitle">Log your rest and set your ideal sleep duration.</p>
              </div>

              <form onSubmit={handleUpdateSleep}>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Hours Slept</label>
                    <input 
                      type="number" 
                      step="0.1"
                      className="form-input" 
                      value={tempSleep.taken}
                      onChange={(e) => setTempSleep({...tempSleep, taken: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Daily Goal (Hours)</label>
                    <input 
                      type="number" 
                      step="0.1"
                      className="form-input" 
                      value={tempSleep.goal}
                      onChange={(e) => setTempSleep({...tempSleep, goal: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn-secondary" onClick={() => setIsSleepModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn-primary-modal">Update Sleep</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
