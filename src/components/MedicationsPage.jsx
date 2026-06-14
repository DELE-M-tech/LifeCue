import { motion, AnimatePresence } from 'motion/react';
import { Plus, Bell, Settings, Droplets, X, Calendar, Pill, ChevronLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useHealth } from '../context/HealthContext.jsx';

export default function MedicationsPage() {
  const navigate = useNavigate();
  const { 
    user, isAuthReady, logout,
    meds, handleAddMed, handleLogMed, handleDeleteMed,
    appointments, handleAddAppt, handleDeleteAppt, handleToggleAppt
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
  return (
    <div className="dashboard-container">
      {/* Navigation */}
      <nav className="navbar glass-header" style={{ position: 'fixed', top: 0, width: '100%', zIndex: 100 }}>
        <div className="nav-container max-w-7xl" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '5rem' }}>
          <div className="logo">
            <Link to="/" style={{ textDecoration: 'none' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--on-surface)', margin: 0 }}>LifeCue</h3>
            </Link>
          </div>
          
          <div className="nav-links" style={{ display: 'flex', gap: '2rem' }}>
            <Link to="/dashboard" className="nav-link" style={{ color: 'var(--on-surface-variant)', textDecoration: 'none' }}>Dashboard</Link>
            <Link to="/medications" className="nav-link active" style={{ color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none' }}>Medications</Link>
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

      <main className="max-w-7xl" style={{ paddingTop: '7rem', paddingBottom: '2rem' }}>
        <header style={{ marginBottom: '3rem' }}>
          <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', textDecoration: 'none', marginBottom: '1rem', fontWeight: 'bold' }}>
            <ChevronLeft size={20} /> Back to Dashboard
          </Link>
          <h1 className="dashboard-title">Medications & Appointments</h1>
          <p className="dashboard-subtitle">Manage your health schedule and track your wellness progress.</p>
        </header>

        <div className="dashboard-grid" style={{ gridTemplateColumns: '2fr 1fr', gap: '4rem' }}>
          {/* Medications Section */}
          <section>
            <div className="appointments-card">
              <div className="appointments-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Pill className="text-primary" />
                  <h3 style={{ margin: 0 }}>Medication List</h3>
                </div>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="view-calendar"
                  style={{ background: 'var(--primary)', border: 'none', cursor: 'pointer', color: 'white', padding: '0.5rem 1rem', borderRadius: '1rem' }}
                >
                  + Add New
                </button>
              </div>
              
              <div className="appointments-list">
                {meds.length === 0 ? (
                  <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--on-surface-variant)' }}>
                    No medications added yet.
                  </div>
                ) : (
                  meds.map((med) => (
                    <div key={med.id} className="appointment-item" style={{ opacity: med.taken ? 0.6 : 1 }}>
                      <div className="date-box" style={{ background: 'rgba(181, 26, 43, 0.1)', color: 'var(--primary)' }}>
                        <Pill size={20} />
                      </div>
                      <div className="appointment-details">
                        <h4 style={{ textDecoration: med.taken ? 'line-through' : 'none' }}>{med.name}</h4>
                        <p>{med.dose} • {med.time}</p>
                        <p style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>{med.instruction}</p>
                      </div>
                      <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        {!med.taken && (
                          <button 
                            className="med-log-btn"
                            style={{ margin: 0, padding: '0.5rem 1rem', fontSize: '0.75rem' }}
                            onClick={() => onLogMed(med.id)}
                            disabled={loggedId === med.id}
                          >
                            {loggedId === med.id ? 'Logging...' : 'Log'}
                          </button>
                        )}
                        <button 
                          onClick={() => handleDeleteMed(med.id)}
                          style={{ background: 'none', border: 'none', color: 'var(--on-surface-variant)', cursor: 'pointer', padding: '0.5rem' }}
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>

          {/* Appointments Section */}
          <section>
            <div className="appointments-card">
              <div className="appointments-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Calendar className="text-primary" />
                  <h3 style={{ margin: 0 }}>Upcoming Sessions</h3>
                </div>
                <button 
                  onClick={() => setIsApptModalOpen(true)}
                  className="view-calendar"
                  style={{ background: 'var(--primary)', border: 'none', cursor: 'pointer', color: 'white', padding: '0.5rem 1rem', borderRadius: '1rem' }}
                >
                  + Add New
                </button>
              </div>
              
              <div className="appointments-list">
                {appointments.length === 0 ? (
                  <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--on-surface-variant)' }}>
                    No appointments scheduled.
                  </div>
                ) : (
                  appointments.map((apt) => (
                    <div key={apt.id} className="appointment-item" style={{ opacity: apt.completed ? 0.6 : 1 }}>
                      <div 
                        className="date-box" 
                        onClick={() => handleToggleAppt(apt.id)}
                        style={{ cursor: 'pointer', background: apt.completed ? 'rgba(255, 255, 255, 0.05)' : 'rgba(181, 26, 43, 0.1)', height: 'auto', minHeight: '60px', padding: '0.5rem' }}
                      >
                        <span className="date-month" style={{ fontSize: '0.65rem' }}>{apt.month} {apt.year}</span>
                        <span className="date-day">{apt.date}</span>
                      </div>
                      <div className="appointment-details" onClick={() => handleToggleAppt(apt.id)} style={{ cursor: 'pointer', flex: 1 }}>
                        <h4 style={{ textDecoration: apt.completed ? 'line-through' : 'none' }}>{apt.title}</h4>
                        <p>{apt.type} {apt.completed && '✓'}</p>
                      </div>
                      <button 
                        onClick={() => handleDeleteAppt(apt.id)}
                        style={{ background: 'none', border: 'none', color: 'var(--on-surface-variant)', cursor: 'pointer', padding: '0.5rem' }}
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </div>
      </main>

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
                <p className="modal-subtitle">Add a new drug to your tracking list.</p>
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
                <p className="modal-subtitle">Schedule a new session in your calendar.</p>
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
    </div>
  );
}
