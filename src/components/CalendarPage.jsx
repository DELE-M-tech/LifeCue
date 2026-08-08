import { motion } from 'motion/react';
import { ChevronRight, Plus, ExternalLink, History, ChevronLeft, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useHealth } from '../context/HealthContext.jsx';
import AppLayout from './AppLayout.jsx';
import { useState, useMemo, useEffect } from 'react';
import { SkelBlock, SkelCard, SkelTopbar } from './Skeletons.jsx';

export default function CalendarPage() {
  const navigate = useNavigate();
  const { user, isAuthReady, appointments, handleToggleAppt } = useHealth();

  useEffect(() => {
    if (isAuthReady && !user) navigate('/signin');
  }, [user, isAuthReady, navigate]);

  const [view, setView] = useState('monthly');
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  const calendarData = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    if (view === 'monthly') {
      const firstDay = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
      const prevMonthDays = Array.from({ length: firstDay }, (_, i) => i);
      return { year, month, days, prevMonthDays };
    } else {
      const dayOfWeek = viewDate.getDay();
      const startOfWeek = new Date(viewDate);
      startOfWeek.setDate(viewDate.getDate() - dayOfWeek);
      const days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(startOfWeek);
        d.setDate(startOfWeek.getDate() + i);
        return d;
      });
      return { year, month, days };
    }
  }, [viewDate, view]);

  const indicators = useMemo(() => {
    const map = {};
    appointments.forEach(appt => {
      const year = appt.year || new Date().getFullYear().toString();
      const key = `${appt.month}-${appt.date}-${year}`;
      map[key] = (map[key] || 0) + 1;
    });
    return map;
  }, [appointments]);

  const selectedDayFocus = useMemo(() => {
    const monthStr = monthNames[selectedDate.getMonth()].substring(0, 3).toUpperCase();
    const day = selectedDate.getDate();
    const year = selectedDate.getFullYear().toString();
    return appointments.filter(appt => {
      const apptYear = appt.year || new Date().getFullYear().toString();
      return appt.month === monthStr && Number(appt.date) === day && apptYear === year;
    });
  }, [appointments, selectedDate]);

  const weeklyAppointments = useMemo(() => {
    if (view !== 'weekly') return [];
    return appointments.filter(appt => {
      return calendarData.days.some(date => {
        const monthStr = monthNames[date.getMonth()].substring(0, 3).toUpperCase();
        const year = date.getFullYear().toString();
        const apptYear = appt.year || new Date().getFullYear().toString();
        return appt.month === monthStr && Number(appt.date) === date.getDate() && apptYear === year;
      });
    });
  }, [appointments, calendarData, view]);

  const handlePrev = () => {
    if (view === 'monthly') setViewDate(new Date(calendarData.year, calendarData.month - 1, 1));
    else { const d = new Date(viewDate); d.setDate(viewDate.getDate() - 7); setViewDate(d); }
  };
  const handleNext = () => {
    if (view === 'monthly') setViewDate(new Date(calendarData.year, calendarData.month + 1, 1));
    else { const d = new Date(viewDate); d.setDate(viewDate.getDate() + 7); setViewDate(d); }
  };

  const recentHistory = useMemo(() => {
    const now = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 7);
    return appointments
      .filter(appt => {
        if (!appt.completed) return false;
        const monthIdx = monthNames.findIndex(m => m.substring(0, 3).toUpperCase() === appt.month);
        const apptDate = new Date(Number(appt.year || now.getFullYear()), monthIdx, Number(appt.date));
        return apptDate >= oneWeekAgo && apptDate <= now;
      })
      .map(appt => ({
        id: appt.id,
        name: appt.title,
        type: appt.type?.includes('•') ? appt.type.split('•')[0].trim() : appt.type,
        date: `${appt.month} ${appt.date}`,
        year: appt.year || now.getFullYear()
      }))
      .sort((a, b) => new Date(a.date + ' ' + a.year) - new Date(b.date + ' ' + b.year))
      .reverse();
  }, [appointments]);

  if (!isAuthReady || !user) {
    return (
      <AppLayout>
        <div className="skel-page">
          <SkelTopbar />
          <div className="cal-page-grid">
            <SkelCard padding="1.75rem">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem' }}>
                {Array.from({ length: 35 }).map((_, i) => (
                  <SkelBlock key={i} height="auto" style={{ aspectRatio: '1/1', borderRadius: 'var(--radius-md)' }} />
                ))}
              </div>
            </SkelCard>
            <SkelCard padding="1.75rem">
              <SkelBlock width="60%" height="1.1rem" style={{ marginBottom: '1.5rem' }} />
              <SkelBlock width="90%" height="0.8rem" style={{ marginBottom: '0.5rem' }} />
              <SkelBlock width="70%" height="0.8rem" />
            </SkelCard>
          </div>
        </div>
      </AppLayout>
    );
  }

  const activeList = view === 'weekly' ? weeklyAppointments : selectedDayFocus;

  return (
    <AppLayout>
      <div className="dash-page" style={{ maxWidth: '1080px' }}>
        <div className="dash-topbar">
          <div>
            <p className="cal-eyebrow">Schedule overview</p>
            <div className="cal-title-row">
              <h1 className="dash-greeting cal-month-title">
                {monthNames[calendarData.month]} <span className="cal-year-dim">{calendarData.year}</span>
              </h1>
              <div className="cal-nav-btns">
                <button className="cdp-nav-btn" onClick={handlePrev}><ChevronLeft size={18} /></button>
                <button className="cdp-nav-btn" onClick={handleNext}><ChevronRight size={18} /></button>
              </div>
            </div>
          </div>
          <div className="cal-view-toggle">
            <button className={view === 'monthly' ? 'active' : ''} onClick={() => setView('monthly')}>Monthly</button>
            <button className={view === 'weekly' ? 'active' : ''} onClick={() => setView('weekly')}>Weekly</button>
          </div>
        </div>

        <div className="cal-page-grid">
          {/* ── Left: calendar + history ── */}
          <div>
            <div className="dash-card cal-grid-card">
              <div className="cal-weekday-header">
                {weekDays.map(day => <span key={day}>{day}</span>)}
              </div>
              <div className="cal-days-grid">
                {view === 'monthly' ? (
                  <>
                    {calendarData.prevMonthDays.map(i => <div key={`prev-${i}`} className="cal-day-empty" />)}
                    {calendarData.days.map(day => {
                      const isSelected = selectedDate.getDate() === day && selectedDate.getMonth() === calendarData.month && selectedDate.getFullYear() === calendarData.year;
                      const isToday = new Date().getDate() === day && new Date().getMonth() === calendarData.month && new Date().getFullYear() === calendarData.year;
                      const monthStr = monthNames[calendarData.month].substring(0, 3).toUpperCase();
                      const key = `${monthStr}-${day}-${calendarData.year}`;
                      return (
                        <motion.div
                          key={day} whileHover={{ scale: 1.05 }}
                          onClick={() => setSelectedDate(new Date(calendarData.year, calendarData.month, day))}
                          className={`cal-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                        >
                          <span className="cal-day-num">{day}</span>
                          {indicators[key] && (
                            <div className="cal-day-dots">
                              {Array.from({ length: Math.min(3, indicators[key]) }).map((_, i) => <div key={i} />)}
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </>
                ) : (
                  calendarData.days.map((date, idx) => {
                    const day = date.getDate(), month = date.getMonth(), year = date.getFullYear();
                    const isSelected = selectedDate.getDate() === day && selectedDate.getMonth() === month && selectedDate.getFullYear() === year;
                    const isToday = new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year;
                    const monthStr = monthNames[month].substring(0, 3).toUpperCase();
                    const key = `${monthStr}-${day}-${year}`;
                    return (
                      <motion.div
                        key={idx} whileHover={{ scale: 1.05 }}
                        onClick={() => setSelectedDate(new Date(year, month, day))}
                        className={`cal-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                      >
                        <span className="cal-day-num">{day}</span>
                        <span className="cal-day-month">{monthNames[month].substring(0, 3)}</span>
                        {indicators[key] && (
                          <div className="cal-day-dots">
                            {Array.from({ length: Math.min(3, indicators[key]) }).map((_, i) => <div key={i} />)}
                          </div>
                        )}
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="cal-history-section">
              <div className="dash-card-title-row" style={{ marginBottom: '1rem' }}>
                <div className="dash-card-icon-wrap" style={{ background: 'var(--primary-container)' }}>
                  <History size={16} style={{ color: 'var(--primary)' }} />
                </div>
                <h2 className="dash-card-title">Recent History</h2>
              </div>

              {recentHistory.length === 0 ? (
                <div className="dash-card">
                  <div className="dash-empty-state">
                    <p>No completed appointments in the past week.</p>
                  </div>
                </div>
              ) : (
                <div className="logger-list">
                  {recentHistory.map(item => (
                    <div key={item.id} className="logger-entry cal-history-row">
                      <div className="cal-history-icon"><Check size={14} /></div>
                      <div style={{ flex: 1 }}>
                        <span className="logger-entry-date" style={{ display: 'block' }}>{item.name}</span>
                        <span className="dash-med-row-meta">{item.type} · {item.date}</span>
                      </div>
                      <ChevronRight size={18} style={{ opacity: 0.3 }} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Right: focus + CTA ── */}
          <aside className="cal-sidebar">
            <div className="dash-card cal-focus-card">
              <h3 className="dash-card-title" style={{ marginBottom: '1.5rem' }}>
                {view === 'weekly' ? 'Weekly Summary' : (selectedDate.toDateString() === new Date().toDateString() ? "Today's Focus" : `${monthNames[selectedDate.getMonth()]} ${selectedDate.getDate()} Focus`)}
              </h3>

              <div className="cal-timeline">
                {activeList.length === 0 ? (
                  <p className="detail-empty">No appointments scheduled for this {view === 'weekly' ? 'week' : 'day'}.</p>
                ) : (
                  activeList.map((appt) => (
                    <div key={appt.id} className="cal-timeline-item">
                      <div className={`cal-timeline-dot ${appt.completed ? 'done' : ''}`} />
                      <p className="cal-timeline-meta">
                        {appt.month} {appt.date}{appt.type?.includes('•') ? ` · ${appt.type.split('•')[1].trim()}` : ''}
                      </p>
                      <h4 className={`cal-timeline-title ${appt.completed ? 'done' : ''}`}>{appt.title}</h4>
                      {appt.type && <p className="cal-timeline-type">{appt.type.includes('•') ? appt.type.split('•')[0].trim() : appt.type}</p>}
                      {!appt.completed && (
                        <button className="btn-primary-modal cal-complete-btn" onClick={() => handleToggleAppt(appt.id)}>
                          <ExternalLink size={16} /> Complete Session
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="cal-cta-card">
              <h3>Schedule New Visit</h3>
              <p>Need to see a specialist or renew your prescriptions for the month?</p>
              <Link to="/medications" style={{ textDecoration: 'none' }}>
                <button className="btn-primary-modal cal-cta-btn">
                  Quick Schedule <Plus size={18} />
                </button>
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </AppLayout>
  );
}
