import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Pill, Droplets, Moon, Footprints, Calendar, X, Check } from 'lucide-react';
import { useHealth } from '../context/HealthContext.jsx';
import AppLayout from './AppLayout.jsx';
import { SkelBlock, SkelCard } from './Skeletons.jsx';

function DayDetailModal({ log, meds, onClose, fetchDayDetail, localDetail }) {
  const [detail, setDetail] = useState(localDetail ?? null);
  const [loading, setLoading] = useState(!localDetail);

  useEffect(() => {
    if (localDetail) { setDetail(localDetail); setLoading(false); return; }
    let active = true;
    setLoading(true);
    fetchDayDetail(log.log_date).then(d => {
      if (active) { setDetail(d); setLoading(false); }
    });
    return () => { active = false; };
  }, [log.log_date, localDetail]);

  const formatDate = (dateStr) => {
    if (dateStr === 'today') return "Today";
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (iso) => iso ? new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '';

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
            <h2 className="modal-title">{formatDate(log.log_date)}</h2>
            <p className="modal-subtitle">{log.completion_pct}% of daily goals completed</p>
          </div>

          <div className="detail-stat-grid">
            <div className="detail-stat-box">
              <Footprints size={18} style={{ color: 'var(--primary)' }} />
              <div>
                <span className="detail-stat-value">{Number(log.steps_taken).toLocaleString()}</span>
                <span className="detail-stat-goal">/ {Number(log.steps_goal).toLocaleString()} steps</span>
              </div>
            </div>
            <div className="detail-stat-box">
              <Droplets size={18} style={{ color: 'var(--tertiary)' }} />
              <div>
                <span className="detail-stat-value">{log.hydration_taken}L</span>
                <span className="detail-stat-goal">/ {log.hydration_goal}L</span>
              </div>
            </div>
            <div className="detail-stat-box">
              <Moon size={18} style={{ color: 'var(--secondary)' }} />
              <div>
                <span className="detail-stat-value">{log.sleep_taken}h</span>
                <span className="detail-stat-goal">/ {log.sleep_goal}h sleep</span>
              </div>
            </div>
          </div>

          <div className="detail-section-label">Medications taken</div>
          {loading ? (
            <p className="detail-loading">Loading…</p>
          ) : detail?.medsTakenDetail?.length > 0 ? (
            <div className="detail-med-list">
              {detail.medsTakenDetail.map((m, i) => (
                <div key={i} className="detail-med-row">
                  <div className="detail-med-check"><Check size={12} /></div>
                  <div className="detail-med-info">
                    <span className="detail-med-name">{m.name}</span>
                    <span className="detail-med-meta">{m.dose} · scheduled {m.time}</span>
                  </div>
                  <span className="detail-med-time">{formatTime(m.taken_at)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="detail-empty">No medications logged this day.</p>
          )}

          <div className="detail-section-label" style={{ marginTop: '1.75rem' }}>Appointments</div>
          {!detail?.apptsDetail || detail.apptsDetail.length === 0 ? (
            <p className="detail-empty">No appointment activity this day.</p>
          ) : (
            <div className="detail-med-list">
              {detail.apptsDetail.map((apt, i) => (
                <div key={i} className="detail-med-row">
                  <div
                    className="detail-med-check"
                    style={{
                      background: apt.completed ? 'var(--secondary-container)' : 'var(--surface-container-high)',
                      color: apt.completed ? 'var(--secondary)' : 'var(--on-surface-muted)'
                    }}
                  >
                    <Check size={12} />
                  </div>
                  <div className="detail-med-info">
                    <span className="detail-med-name">{apt.title}</span>
                    <span className="detail-med-meta">{apt.type || 'No details'} · {apt.month} {apt.date}, {apt.year}</span>
                  </div>
                  <span className="detail-med-time">{apt.completed ? 'Completed' : 'Pending'}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Logger() {
  const {
    historyLogs, historyLoading, fetchHistory, fetchDayDetail,
    meds, medLogsToday, appointments, stepsTaken, hydrationTaken, sleepTaken,
    stepsGoal, hydrationGoal, sleepGoal,
    calculateCompletion
  } = useHealth();

  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => { fetchHistory(30); }, []);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  const medsTakenToday = meds.filter(m => medLogsToday[m.id]).length;

  const todayLog = {
    log_date: 'today',
    completion_pct: calculateCompletion(),
    steps_taken: stepsTaken, steps_goal: stepsGoal,
    hydration_taken: hydrationTaken, hydration_goal: hydrationGoal,
    sleep_taken: sleepTaken, sleep_goal: sleepGoal,
  };

  const todayDetail = {
    medsTakenDetail: meds
      .filter(m => medLogsToday[m.id])
      .map(m => ({ ...m, taken_at: null })),
    apptsDetail: appointments.map(a => ({ ...a, completed_at: null }))
  };

  return (
    <AppLayout>
      <div className="dash-page">
        <div className="dash-topbar">
          <div>
            <h1 className="dash-greeting">Logger</h1>
            <p className="dash-date">Your day-by-day history</p>
          </div>
        </div>

        {/* ── Today (live, clickable — detail built from context state) ── */}
        <button
          className="logger-entry logger-entry-today logger-entry-clickable"
          onClick={() => setSelectedLog(todayLog)}
        >
          <div className="logger-entry-header">
            <span className="logger-entry-date">Today · in progress</span>
            <span className="logger-entry-pct">{calculateCompletion()}%</span>
          </div>
          <div className="logger-entry-stats">
            <div className="logger-stat">
              <Pill size={15} style={{ color: 'var(--primary)' }} />
              <span>{medsTakenToday}/{meds.length} meds</span>
            </div>
            <div className="logger-stat">
              <Footprints size={15} style={{ color: 'var(--primary)' }} />
              <span>{Number(stepsTaken).toLocaleString()} steps</span>
            </div>
            <div className="logger-stat">
              <Droplets size={15} style={{ color: 'var(--tertiary)' }} />
              <span>{hydrationTaken}L</span>
            </div>
            <div className="logger-stat">
              <Moon size={15} style={{ color: 'var(--secondary)' }} />
              <span>{sleepTaken}h sleep</span>
            </div>
          </div>
        </button>

        <div className="logger-history-label">History</div>

        {historyLoading ? (
          <div className="logger-list">
            <SkelCard><SkelBlock width="130px" height="1rem" style={{ marginBottom: '0.85rem' }} /><SkelBlock width="90%" height="0.8rem" /></SkelCard>
            <SkelCard><SkelBlock width="130px" height="1rem" style={{ marginBottom: '0.85rem' }} /><SkelBlock width="90%" height="0.8rem" /></SkelCard>
            <SkelCard><SkelBlock width="130px" height="1rem" style={{ marginBottom: '0.85rem' }} /><SkelBlock width="90%" height="0.8rem" /></SkelCard>
          </div>
        ) : historyLogs.length === 0 ? (
          <div className="dash-card">
            <div className="dash-empty-state">
              <Calendar size={28} style={{ opacity: 0.2 }} />
              <p>No past days yet — today will show up here tomorrow.</p>
            </div>
          </div>
        ) : (
          <div className="logger-list">
            {historyLogs.map(log => (
              <button
                key={log.log_date}
                className="logger-entry logger-entry-clickable"
                onClick={() => setSelectedLog(log)}
              >
                <div className="logger-entry-header">
                  <span className="logger-entry-date">{formatDate(log.log_date)}</span>
                  <span className="logger-entry-pct">{log.completion_pct}%</span>
                </div>
                <div className="logger-entry-stats">
                  <div className="logger-stat">
                    <Pill size={15} style={{ color: 'var(--primary)' }} />
                    <span>{log.meds_taken}/{meds.length || 0} meds</span>
                  </div>
                  <div className="logger-stat">
                    <Footprints size={15} style={{ color: 'var(--primary)' }} />
                    <span>{Number(log.steps_taken).toLocaleString()} steps</span>
                  </div>
                  <div className="logger-stat">
                    <Droplets size={15} style={{ color: 'var(--tertiary)' }} />
                    <span>{log.hydration_taken}L</span>
                  </div>
                  <div className="logger-stat">
                    <Moon size={15} style={{ color: 'var(--secondary)' }} />
                    <span>{log.sleep_taken}h sleep</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedLog && (
          <DayDetailModal
            log={selectedLog}
            meds={meds}
            onClose={() => setSelectedLog(null)}
            fetchDayDetail={fetchDayDetail}
            localDetail={selectedLog.log_date === 'today' ? todayDetail : null}
          />
        )}
      </AnimatePresence>
    </AppLayout>
  );
}
