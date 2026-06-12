import { motion } from 'motion/react';
import { Bell, Settings, ChevronRight, Plus, ExternalLink, History, Calendar as CalendarIcon, ChevronLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useHealth } from '../context/HealthContext.jsx';
import { useState, useMemo, useEffect } from 'react';

export default function CalendarPage() {
  const navigate = useNavigate();
  const { user, isAuthReady, logout, appointments, handleToggleAppt } = useHealth();

  useEffect(() => {
    if (isAuthReady && !user) {
      navigate('/signin');
    }
  }, [user, isAuthReady, navigate]);
  const [view, setView] = useState('monthly');
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

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
      // Weekly view
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
    if (view === 'monthly') {
      setViewDate(new Date(calendarData.year, calendarData.month - 1, 1));
    } else {
      const newDate = new Date(viewDate);
      newDate.setDate(viewDate.getDate() - 7);
      setViewDate(newDate);
    }
  };

  const handleNext = () => {
    if (view === 'monthly') {
      setViewDate(new Date(calendarData.year, calendarData.month + 1, 1));
    } else {
      const newDate = new Date(viewDate);
      newDate.setDate(viewDate.getDate() + 7);
      setViewDate(newDate);
    }
  };

  const recentHistory = useMemo(() => {
    const now = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 7);

    return appointments
      .filter(appt => {
        if (!appt.completed) return false;
        
        const monthIdx = monthNames.findIndex(m => m.substring(0, 3).toUpperCase() === appt.month);
        const apptDate = new Date(
          Number(appt.year || now.getFullYear()),
          monthIdx,
          Number(appt.date)
        );
        
        return apptDate >= oneWeekAgo && apptDate <= now;
      })
      .map(appt => ({
        id: appt.id,
        name: appt.title,
        type: appt.type.includes('•') ? appt.type.split('•')[0].trim() : appt.type,
        date: `${appt.month} ${appt.date}`,
        img: `https://picsum.photos/seed/${appt.id}/150/150`
      }))
      .sort((a, b) => {
        const dateA = new Date(a.date + ' ' + (appointments.find(x => x.id === a.id).year || now.getFullYear()));
        const dateB = new Date(b.date + ' ' + (appointments.find(x => x.id === b.id).year || now.getFullYear()));
        return dateB - dateA;
      });
  }, [appointments]);

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
            <Link to="/">
              <img 
                alt="LifeCue" 
                className="footer-logo" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtxlaR4BRCJcikNm2ms-vpazR-tCbZQuqcmAoHMd9IooV2GJllRHFZpctTLT6kRIyvuEbkstqRKPQgErI7Q8-GZB5c9s3LsJATujPTZTmyhhq9Re-wtrRTYw5FyEJ4d2CwOXR9DNBjNhqq38Elx8V7_BK0ZJv1cchMIzlclLN9oBFecV4jg5dEQkA7PlDdSNNAL_y_ZYhN1s2ypHVMKqvhNbg-ubJOx9mOQlzXl2XzGcwQNnEjSrGZAlKxToZfVg0QoZ5iSTUCP7lh"
                referrerPolicy="no-referrer"
                style={{ height: '2rem' }}
              />
            </Link>
          </div>
          
          <div className="nav-links" style={{ display: 'flex', gap: '2rem' }}>
            <Link to="/dashboard" className="nav-link" style={{ color: 'var(--on-surface-variant)', textDecoration: 'none' }}>Dashboard</Link>
            <Link to="/medications" className="nav-link" style={{ color: 'var(--on-surface-variant)', textDecoration: 'none' }}>Medications</Link>
            <Link to="/calendar" className="nav-link active" style={{ color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none' }}>Calendar</Link>
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
        <div className="calendar-page-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
          
          {/* Left Column */}
          <div className="calendar-main-content">
            <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <p className="small-caps" style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>SCHEDULE OVERVIEW</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <h1 className="calendar-title" style={{ fontSize: '4rem', fontWeight: '400', margin: 0 }}>
                    {monthNames[calendarData.month]} <span style={{ opacity: 0.3 }}>{calendarData.year}</span>
                  </h1>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={handlePrev} style={{ background: 'rgba(255, 255, 255, 0.05)', border: 'none', color: 'white', padding: '0.5rem', borderRadius: '50%', cursor: 'pointer' }}><ChevronLeft size={20} /></button>
                    <button onClick={handleNext} style={{ background: 'rgba(255, 255, 255, 0.05)', border: 'none', color: 'white', padding: '0.5rem', borderRadius: '50%', cursor: 'pointer' }}><ChevronRight size={20} /></button>
                  </div>
                </div>
              </div>
              
              <div className="view-toggle" style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '2rem', padding: '0.25rem', display: 'flex' }}>
                <button 
                  onClick={() => setView('monthly')}
                  style={{ 
                    padding: '0.75rem 1.5rem', 
                    borderRadius: '1.75rem', 
                    border: 'none', 
                    background: view === 'monthly' ? 'var(--primary)' : 'transparent',
                    color: 'white',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Monthly
                </button>
                <button 
                  onClick={() => setView('weekly')}
                  style={{ 
                    padding: '0.75rem 1.5rem', 
                    borderRadius: '1.75rem', 
                    border: 'none', 
                    background: view === 'weekly' ? 'var(--primary)' : 'transparent',
                    color: 'white',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Weekly
                </button>
              </div>
            </header>

            {/* Calendar Grid */}
            <div className="calendar-grid-card" style={{ background: 'rgba(23, 31, 49, 0.4)', borderRadius: '2rem', padding: '3rem', marginBottom: '3rem', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div className="calendar-days-header" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                {weekDays.map(day => (
                  <span key={day} style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: '700', color: 'var(--on-surface-variant)', letterSpacing: '0.1em' }}>{day}</span>
                ))}
              </div>
              
              <div className="calendar-days-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1rem' }}>
                {view === 'monthly' ? (
                  <>
                    {calendarData.prevMonthDays.map(i => (
                      <div key={`prev-${i}`} style={{ aspectRatio: '1/1', opacity: 0.1 }}></div>
                    ))}
                    
                    {calendarData.days.map(day => {
                      const isSelected = selectedDate.getDate() === day && selectedDate.getMonth() === calendarData.month && selectedDate.getFullYear() === calendarData.year;
                      const isToday = new Date().getDate() === day && new Date().getMonth() === calendarData.month && new Date().getFullYear() === calendarData.year;
                      const monthStr = monthNames[calendarData.month].substring(0, 3).toUpperCase();
                      const key = `${monthStr}-${day}-${calendarData.year}`;
                      
                      return (
                        <motion.div 
                          key={day}
                          whileHover={{ scale: 1.05 }}
                          onClick={() => setSelectedDate(new Date(calendarData.year, calendarData.month, day))}
                          className={`calendar-day ${isSelected ? 'active' : ''}`}
                          style={{ 
                            aspectRatio: '1/1', 
                            background: isSelected ? 'var(--primary)' : isToday ? 'rgba(181, 26, 43, 0.2)' : 'rgba(255, 255, 255, 0.03)', 
                            borderRadius: '1.5rem',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            cursor: 'pointer',
                            border: isToday ? '1px solid var(--primary)' : '1px solid rgba(255, 255, 255, 0.05)'
                          }}
                        >
                          <span style={{ fontSize: '1.25rem', fontWeight: '600' }}>{day}</span>
                          {indicators[key] && (
                            <div style={{ display: 'flex', gap: '3px', position: 'absolute', bottom: '1rem' }}>
                              {Array.from({ length: Math.min(3, indicators[key]) }).map((_, i) => (
                                <div key={i} style={{ width: '4px', height: '4px', borderRadius: '50%', background: isSelected ? 'white' : 'var(--primary)' }}></div>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </>
                ) : (
                  calendarData.days.map((date, idx) => {
                    const day = date.getDate();
                    const month = date.getMonth();
                    const year = date.getFullYear();
                    const isSelected = selectedDate.getDate() === day && selectedDate.getMonth() === month && selectedDate.getFullYear() === year;
                    const isToday = new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year;
                    const monthStr = monthNames[month].substring(0, 3).toUpperCase();
                    const key = `${monthStr}-${day}-${year}`;
                    
                    return (
                      <motion.div 
                        key={idx}
                        whileHover={{ scale: 1.05 }}
                        onClick={() => setSelectedDate(new Date(year, month, day))}
                        className={`calendar-day ${isSelected ? 'active' : ''}`}
                        style={{ 
                          aspectRatio: '1/1', 
                          background: isSelected ? 'var(--primary)' : isToday ? 'rgba(181, 26, 43, 0.2)' : 'rgba(255, 255, 255, 0.03)', 
                          borderRadius: '1.5rem',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative',
                          cursor: 'pointer',
                          border: isToday ? '1px solid var(--primary)' : '1px solid rgba(255, 255, 255, 0.05)'
                        }}
                      >
                        <span style={{ fontSize: '1.25rem', fontWeight: '600' }}>{day}</span>
                        <span style={{ fontSize: '0.625rem', opacity: 0.5 }}>{monthNames[month].substring(0, 3)}</span>
                        {indicators[key] && (
                          <div style={{ display: 'flex', gap: '3px', position: 'absolute', bottom: '1rem' }}>
                            {Array.from({ length: Math.min(3, indicators[key]) }).map((_, i) => (
                              <div key={i} style={{ width: '4px', height: '4px', borderRadius: '50%', background: isSelected ? 'white' : 'var(--primary)' }}></div>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Recent History */}
            <div className="history-section">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <History size={20} style={{ color: 'var(--primary)' }} />
                <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Recent History</h3>
              </div>
              
              <div className="history-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {recentHistory.length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--on-surface-variant)', background: 'rgba(23, 31, 49, 0.2)', borderRadius: '1.5rem', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    No completed appointments in the past week.
                  </div>
                ) : (
                  recentHistory.map(item => (
                    <motion.div 
                      key={item.id}
                      whileHover={{ x: 10, background: 'rgba(255, 255, 255, 0.05)' }}
                      style={{ 
                        background: 'rgba(23, 31, 49, 0.4)', 
                        borderRadius: '1.5rem', 
                        padding: '1.5rem', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '1.5rem',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        cursor: 'pointer'
                      }}
                    >
                      <img src={item.img} alt={item.name} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} referrerPolicy="no-referrer" />
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{item.name}</h4>
                        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--on-surface-variant)' }}>{item.type} • {item.date}</p>
                      </div>
                      <ChevronRight size={20} style={{ opacity: 0.3 }} />
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column (Sidebar) */}
          <aside className="calendar-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Focus Card */}
            <div className="focus-card" style={{ background: 'rgba(23, 31, 49, 0.4)', borderRadius: '2rem', padding: '2.5rem', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '2.5rem' }}>
                {view === 'weekly' ? "Weekly Summary" : (selectedDate.toDateString() === new Date().toDateString() ? "Today's Focus" : `${monthNames[selectedDate.getMonth()]} ${selectedDate.getDate()} Focus`)}
              </h3>
              
              <div className="timeline" style={{ position: 'relative', paddingLeft: '2rem' }}>
                <div style={{ position: 'absolute', left: '4px', top: '0.5rem', bottom: '0.5rem', width: '2px', background: 'rgba(255, 255, 255, 0.1)' }}></div>
                
                {(view === 'weekly' ? weeklyAppointments : selectedDayFocus).length === 0 ? (
                  <div style={{ color: 'var(--on-surface-variant)', fontSize: '0.875rem', padding: '1rem 0' }}>
                    No appointments scheduled for this {view === 'weekly' ? 'week' : 'day'}.
                  </div>
                ) : (
                  (view === 'weekly' ? weeklyAppointments : selectedDayFocus).map((appt, idx) => (
                    <div key={appt.id} className="timeline-item" style={{ marginBottom: idx === (view === 'weekly' ? weeklyAppointments : selectedDayFocus).length - 1 ? 0 : '3rem', position: 'relative' }}>
                      <div style={{ 
                        position: 'absolute', 
                        left: '-22px', 
                        top: '0.25rem', 
                        width: '12px', 
                        height: '12px', 
                        borderRadius: '50%', 
                        background: appt.completed ? 'rgba(255, 255, 255, 0.2)' : 'var(--primary)', 
                        boxShadow: appt.completed ? 'none' : '0 0 10px var(--primary)' 
                      }}></div>
                      <p className="small-caps" style={{ color: appt.completed ? 'var(--on-surface-variant)' : 'var(--primary)', fontSize: '0.7rem', marginBottom: '0.5rem' }}>
                        {appt.month} {appt.date} • {appt.type.includes('•') ? appt.type.split('•')[1].trim() : "Scheduled"}
                      </p>
                      <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', textDecoration: appt.completed ? 'line-through' : 'none', opacity: appt.completed ? 0.5 : 1 }}>
                        {appt.title}
                      </h4>
                      <p style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)', marginBottom: '1rem' }}>
                        {appt.type.includes('•') ? appt.type.split('•')[0].trim() : appt.type}
                      </p>
                      {!appt.completed && (
                        <button 
                          onClick={() => handleToggleAppt(appt.id)}
                          style={{ 
                            width: '100%', 
                            padding: '1rem', 
                            borderRadius: '1rem', 
                            background: 'var(--primary)', 
                            border: 'none', 
                            color: 'white', 
                            fontWeight: 'bold', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            gap: '0.75rem',
                            cursor: 'pointer'
                          }}
                        >
                          <ExternalLink size={18} /> COMPLETE SESSION
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Schedule CTA */}
            <div className="schedule-cta-card" style={{ 
              background: 'linear-gradient(135deg, rgba(181, 26, 43, 0.2) 0%, rgba(23, 31, 49, 0.4) 100%)', 
              borderRadius: '2rem', 
              padding: '2.5rem', 
              border: '1px solid rgba(181, 26, 43, 0.1)' 
            }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>SCHEDULE New Visit</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)', marginBottom: '2rem', lineHeight: '1.6' }}>
                Need to see a specialist or renew your prescriptions for the month?
              </p>
              <Link to="/medications" style={{ textDecoration: 'none' }}>
                <button style={{ 
                  width: '100%', 
                  padding: '1.25rem', 
                  borderRadius: '1.5rem', 
                  background: 'var(--primary)', 
                  border: 'none', 
                  color: 'white', 
                  fontWeight: 'bold', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '0.75rem',
                  cursor: 'pointer',
                  boxShadow: '0 10px 20px rgba(181, 26, 43, 0.2)'
                }}>
                  QUICK SCHEDULE <Plus size={20} />
                </button>
              </Link>
            </div>

          </aside>
        </div>
      </main>
    </div>
  );
}
