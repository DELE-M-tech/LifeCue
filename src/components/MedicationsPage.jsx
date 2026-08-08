import { motion, AnimatePresence } from 'motion/react';
import { Plus, X, Calendar, Pill, ChevronLeft, ChevronRight as ChevronRightIcon, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useHealth } from '../context/HealthContext.jsx';
import AppLayout from './AppLayout.jsx';
import DatePicker from './DatePicker.jsx';
import { SkelBlock, SkelCard, SkelRow, SkelTopbar } from './Skeletons.jsx';

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

export default function MedicationsPage() {
  const navigate = useNavigate();
  const {
    user, isAuthReady,
    meds, handleAddMed, handleLogMed, handleDeleteMed, medLogsToday,
    appointments, handleAddAppt, handleDeleteAppt, handleToggleAppt
  } = useHealth();

  useEffect(() => {
    if (isAuthReady && !user) navigate('/signin');
  }, [user, isAuthReady, navigate]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isApptModalOpen, setIsApptModalOpen] = useState(false);
  const [loggedId, setLoggedId] = useState(null);
  const [newMed, setNewMed] = useState({ name: '', dose: '', instruction: '', time: '' });
  const [newAppt, setNewAppt] = useState({
    title: '', type: '',
    dateValue: new Date().toISOString().slice(0, 10)
  });

  const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

  const onAddMed = (e) => {
    e.preventDefault();
    if (!newMed.name || !newMed.dose) return;
    handleAddMed(newMed);
    setNewMed({ name: '', dose: '', instruction: '', time: '' });
    setIsModalOpen(false);
  };

  const onLogMed = (id) => {
    setLoggedId(id);
    setTimeout(() => { handleLogMed(id); setLoggedId(null); }, 900);
  };

  const onAddAppt = (e) => {
    e.preventDefault();
    if (!newAppt.title) return;
    const d = new Date(newAppt.dateValue + 'T00:00:00');
    handleAddAppt({
      title: newAppt.title,
      type: newAppt.type,
      date: d.getDate().toString(),
      month: months[d.getMonth()],
      year: d.getFullYear().toString()
    });
    setNewAppt({ title: '', type: '', dateValue: new Date().toISOString().slice(0, 10) });
    setIsApptModalOpen(false);
  };

  if (!isAuthReady || !user) {
    return (
      <AppLayout>
        <div className="skel-page">
          <SkelBlock width="160px" height="0.85rem" style={{ marginBottom: '1.25rem' }} />
          <SkelTopbar />
          <div className="med-page-grid">
            <SkelCard>
              <SkelBlock width="140px" height="1.2rem" style={{ marginBottom: '1rem' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <SkelRow /><SkelRow /><SkelRow />
              </div>
            </SkelCard>
            <SkelCard>
              <SkelBlock width="140px" height="1.2rem" style={{ marginBottom: '1rem' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <SkelRow /><SkelRow />
              </div>
            </SkelCard>
          </div>
        </div>
      </AppLayout>
    );
  }

  const upcomingAppts = appointments.filter(a => !a.completed);

  return (
    <AppLayout>
      <div className="dash-page" style={{ maxWidth: '1080px' }}>

        <Link to="/dashboard" className="med-back-link">
          <ChevronLeft size={18} /> Back to Dashboard
        </Link>

        <div className="dash-topbar">
          <div>
            <h1 className="dash-greeting">Medications &amp; Appointments</h1>
            <p className="dash-date">Manage your health schedule and track your wellness progress.</p>
          </div>
        </div>

        <div className="med-page-grid">

          {/* ── Medications ── */}
          <div className="dash-card">
            <div className="dash-card-header">
              <div className="dash-card-title-row">
                <div className="dash-card-icon-wrap" style={{ background: 'var(--primary-container)' }}>
                  <Pill size={16} style={{ color: 'var(--primary)' }} />
                </div>
                <h2 className="dash-card-title">Medication List</h2>
                <span className="dash-count-chip">{meds.length} total</span>
              </div>
              <button className="dash-add-btn" onClick={() => setIsModalOpen(true)}>
                <Plus size={14} /> Add New
              </button>
            </div>

            <div className="dash-card-body">
              {meds.length === 0 ? (
                <div className="dash-empty-state">
                  <Pill size={28} style={{ opacity: 0.2 }} />
                  <p>No medications added yet.</p>
                  <button className="dash-empty-cta" onClick={() => setIsModalOpen(true)}>Add your first medication</button>
                </div>
              ) : (
                <div className="dash-med-row-list">
                  {meds.map(med => (
                    <div key={med.id} className={`dash-med-row ${medLogsToday[med.id] ? 'taken' : ''}`}>
                      <div className="dash-med-row-dot" style={{ background: medLogsToday[med.id] ? 'var(--secondary)' : 'var(--primary)' }} />
                      <div className="dash-med-row-info" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.1rem' }}>
                        <span className="dash-med-row-name">{med.name}</span>
                        <span className="dash-med-row-meta">
                          {med.dose} · {med.time}{med.instruction ? ` · ${med.instruction}` : ''}
                        </span>
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
          </div>

          {/* ── Appointments ── */}
          <div className="dash-card">
            <div className="dash-card-header">
              <div className="dash-card-title-row">
                <div className="dash-card-icon-wrap" style={{ background: 'var(--tertiary-container)' }}>
                  <Calendar size={16} style={{ color: 'var(--tertiary)' }} />
                </div>
                <h2 className="dash-card-title">Sessions</h2>
                <span className="dash-count-chip">{upcomingAppts.length} upcoming</span>
              </div>
              <button className="dash-add-btn" onClick={() => setIsApptModalOpen(true)}>
                <Plus size={14} /> Add New
              </button>
            </div>

            <div className="dash-card-body">
              {appointments.length === 0 ? (
                <div className="dash-empty-state">
                  <Calendar size={28} style={{ opacity: 0.2 }} />
                  <p>No appointments scheduled.</p>
                  <button className="dash-empty-cta" onClick={() => setIsApptModalOpen(true)}>Schedule your first appointment</button>
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
          </div>

        </div>
      </div>

      {/* ── Add Medication Modal ── */}
      <AnimatePresence>
        {isModalOpen && (
          <Modal title="New Medication" subtitle="Add a new drug to your tracking list." onClose={() => setIsModalOpen(false)}>
            <form onSubmit={onAddMed}>
              <div className="form-grid">
                <div className="form-group form-group-full">
                  <label className="form-label">Drug Name</label>
                  <input className="form-input" placeholder="e.g. Lisinopril" value={newMed.name} onChange={e => setNewMed({...newMed, name: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Dosage</label>
                  <input className="form-input" placeholder="e.g. 10mg" value={newMed.dose} onChange={e => setNewMed({...newMed, dose: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Time</label>
                  <input className="form-input" placeholder="e.g. 8:00 AM" value={newMed.time} onChange={e => setNewMed({...newMed, time: e.target.value})} required />
                </div>
                <div className="form-group form-group-full">
                  <label className="form-label">Instructions</label>
                  <input className="form-input" placeholder="e.g. Take with water" value={newMed.instruction} onChange={e => setNewMed({...newMed, instruction: e.target.value})} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary-modal">Add Medication</button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>

      {/* ── Add Appointment Modal ── */}
      <AnimatePresence>
        {isApptModalOpen && (
          <Modal title="New Appointment" subtitle="Schedule a new session in your calendar." onClose={() => setIsApptModalOpen(false)}>
            <form onSubmit={onAddAppt}>
              <div className="form-grid">
                <div className="form-group form-group-full">
                  <label className="form-label">Title / Doctor</label>
                  <input className="form-input" placeholder="e.g. Dr. Rodriguez" value={newAppt.title} onChange={e => setNewAppt({...newAppt, title: e.target.value})} required />
                </div>
                <div className="form-group form-group-full">
                  <label className="form-label">Date</label>
                  <DatePicker value={newAppt.dateValue} onChange={(iso) => setNewAppt({...newAppt, dateValue: iso})} />
                </div>
                <div className="form-group form-group-full">
                  <label className="form-label">Details (Type &amp; Time)</label>
                  <input className="form-input" placeholder="e.g. Physical Therapy · 2:30 PM" value={newAppt.type} onChange={e => setNewAppt({...newAppt, type: e.target.value})} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsApptModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary-modal">Schedule Appointment</button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}
