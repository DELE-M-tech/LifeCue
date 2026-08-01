import { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../supabase';

const HealthContext = createContext();

const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export function HealthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [meds, setMeds] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [medLogsToday, setMedLogsToday] = useState({}); // { med_id: true }

  const [stepsGoal, setStepsGoal] = useState(10000);
  const [stepsTaken, _setStepsTaken] = useState(0);
  const [hydrationGoal, setHydrationGoal] = useState(2.5);
  const [hydrationTaken, _setHydrationTaken] = useState(0);
  const [sleepGoal, setSleepGoal] = useState(8);
  const [sleepTaken, _setSleepTaken] = useState(0);
  const [timeLeft, setTimeLeft] = useState('');
  const [historyLogs, setHistoryLogs] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // ── Auth listener ──────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsAuthReady(true);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsAuthReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  const login = () =>
    supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/dashboard` } });
  const loginWithEmail = (email, password) => supabase.auth.signInWithPassword({ email, password });
  const registerWithEmail = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/dashboard` } });
    if (error) throw error;
    return data;
  };
  const logout = () => supabase.auth.signOut();

  // ── Compute today's completion % from current state ──────────
  const calculateCompletion = () => {
    const stepsScore = Math.min(1, stepsTaken / stepsGoal);
    const hydrationScore = Math.min(1, hydrationTaken / hydrationGoal);
    const sleepScore = Math.min(1, sleepTaken / sleepGoal);
    const medsScore = meds.length === 0 ? 1 : meds.filter(m => medLogsToday[m.id]).length / meds.length;
    const apptsScore = appointments.length === 0 ? 1 : appointments.filter(a => a.completed).length / appointments.length;
    const total = (stepsScore + hydrationScore + sleepScore + medsScore + apptsScore) / 5;
    return Math.round(total * 100);
  };

  // ── Upsert today's daily_logs row (partial merge) ────────────
  const persistDailyLog = async (partial) => {
    if (!user || !isSupabaseConfigured) return;
    try {
      const payload = {
        uid: user.id,
        log_date: todayStr(),
        steps_taken: stepsTaken, steps_goal: stepsGoal,
        hydration_taken: hydrationTaken, hydration_goal: hydrationGoal,
        sleep_taken: sleepTaken, sleep_goal: sleepGoal,
        completion_pct: calculateCompletion(),
        updated_at: new Date().toISOString(),
        ...partial
      };
      const { error } = await supabase.from('daily_logs').upsert(payload, { onConflict: 'uid,log_date' });
      if (error) throw error;
    } catch (err) { console.error('Error saving daily log:', err); }
  };

  // ── Tracker persistence ────────────────────────────
  const updateTracker = async (type, taken, goal) => {
    if (!user) return;
    const setGoal = { steps: setStepsGoal, hydration: setHydrationGoal, sleep: setSleepGoal }[type];
    const setTakenFn = { steps: _setStepsTaken, hydration: _setHydrationTaken, sleep: _setSleepTaken }[type];
    setGoal(goal);
    setTakenFn(taken);

    if (!isSupabaseConfigured) {
      localStorage.setItem(`lifecue_${type}_goal_${user.id}`, goal);
      localStorage.setItem(`lifecue_${type}_taken_${user.id}`, taken);
      return;
    }

    try {
      // goal is a persistent setting → update users table
      await supabase.from('users').update({ [`${type}_goal`]: goal }).eq('uid', user.id);
    } catch (err) { console.error(`Error updating ${type} goal:`, err); }

    // taken + goal snapshot → today's daily log
    const partial = { [`${type}_taken`]: taken, [`${type}_goal`]: goal };
    await persistDailyLog(partial);
  };

  // ── Initial data sync ─────────────────────────────────────────
  useEffect(() => {
    if (!user) {
      setMeds([]); setAppointments([]); setMedLogsToday({});
      return;
    }

    if (!isSupabaseConfigured) {
      try {
        const uid = user.id;
        const storedMeds = localStorage.getItem(`lifecue_meds_${uid}`);
        setMeds(storedMeds ? JSON.parse(storedMeds) : []);
        const storedAppts = localStorage.getItem(`lifecue_appts_${uid}`);
        setAppointments(storedAppts ? JSON.parse(storedAppts) : []);
        const sg = localStorage.getItem(`lifecue_steps_goal_${uid}`); if (sg) setStepsGoal(Number(sg));
        const st = localStorage.getItem(`lifecue_steps_taken_${uid}`); _setStepsTaken(st ? Number(st) : 0);
        const hg = localStorage.getItem(`lifecue_hydration_goal_${uid}`); if (hg) setHydrationGoal(Number(hg));
        const ht = localStorage.getItem(`lifecue_hydration_taken_${uid}`); _setHydrationTaken(ht ? Number(ht) : 0);
        const slg = localStorage.getItem(`lifecue_sleep_goal_${uid}`); if (slg) setSleepGoal(Number(slg));
        const slt = localStorage.getItem(`lifecue_sleep_taken_${uid}`); _setSleepTaken(slt ? Number(slt) : 0);
      } catch (err) { console.error('Error loading localStorage data:', err); }
      return;
    }

    const fetchData = async () => {
      try {
        const uid = user.id;
        const today = todayStr();

        await supabase.from('users').upsert({
          uid, email: user.email,
          display_name: user.user_metadata?.full_name ?? user.email,
          photo_url: user.user_metadata?.avatar_url ?? null
        }, { onConflict: 'uid' });

        const { data: userData } = await supabase.from('users').select('*').eq('uid', uid).single();
        if (userData) {
          if (userData.steps_goal) setStepsGoal(userData.steps_goal);
          if (userData.hydration_goal) setHydrationGoal(userData.hydration_goal);
          if (userData.sleep_goal) setSleepGoal(userData.sleep_goal);
        }

        const { data: medsData } = await supabase.from('meds').select('*').eq('uid', uid).order('created_at', { ascending: false });
        setMeds(medsData ?? []);

        const { data: apptsData } = await supabase.from('appointments').select('*').eq('uid', uid).order('created_at', { ascending: false });
        setAppointments(apptsData ?? []);

        // Today's daily_log row (create if missing)
        let { data: todayLog } = await supabase.from('daily_logs').select('*').eq('uid', uid).eq('log_date', today).maybeSingle();
        if (!todayLog) {
          const { data: created } = await supabase.from('daily_logs').insert({
            uid, log_date: today,
            steps_goal: userData?.steps_goal ?? 10000,
            hydration_goal: userData?.hydration_goal ?? 2.5,
            sleep_goal: userData?.sleep_goal ?? 8
          }).select().single();
          todayLog = created;
        }
        if (todayLog) {
          _setStepsTaken(todayLog.steps_taken ?? 0);
          _setHydrationTaken(todayLog.hydration_taken ?? 0);
          _setSleepTaken(todayLog.sleep_taken ?? 0);
        }

        // Today's med_logs
        const { data: medLogsData } = await supabase.from('med_logs').select('*').eq('uid', uid).eq('log_date', today);
        const map = {};
        (medLogsData ?? []).forEach(l => { if (l.taken) map[l.med_id] = true; });
        setMedLogsToday(map);

      } catch (err) { console.error('Error fetching data from Supabase:', err); }
    };

    fetchData();
  }, [user?.id]);

  // ── Midnight rollover: just resets local "today" view; history already saved per-day ──
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();

      if (diff <= 0) {
        _setStepsTaken(0); _setHydrationTaken(0); _setSleepTaken(0);
        setMedLogsToday({});
      }

      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
    };
    const timer = setInterval(updateTimer, 1000);
    updateTimer();
    return () => clearInterval(timer);
  }, []);

  // ── Meds CRUD (plan layer) ─────────────────────────────────────
  const handleAddMed = async (newMed) => {
    if (!user) return;
    const uid = user.id;
    if (!isSupabaseConfigured) {
      const mockMed = { ...newMed, id: 'local_' + Date.now(), uid, status: 'Scheduled', created_at: new Date().toISOString() };
      setMeds(prev => { const u = [mockMed, ...prev]; localStorage.setItem(`lifecue_meds_${uid}`, JSON.stringify(u)); return u; });
      return;
    }
    try {
      const { data, error } = await supabase.from('meds').insert([{ ...newMed, uid, status: 'Scheduled' }]).select().single();
      if (error) throw error;
      setMeds(prev => [data, ...prev]);
    } catch (err) { console.error('Error adding med:', err); }
  };

  // ── Mark taken → writes to med_logs (today), not the med itself ─
  const handleLogMed = async (id) => {
    if (!user) return;
    if (!isSupabaseConfigured) {
      setMedLogsToday(prev => ({ ...prev, [id]: true }));
      return;
    }
    try {
      const { error } = await supabase.from('med_logs').upsert({
        uid: user.id, med_id: id, log_date: todayStr(), taken: true, taken_at: new Date().toISOString()
      }, { onConflict: 'uid,med_id,log_date' });
      if (error) throw error;
      setMedLogsToday(prev => ({ ...prev, [id]: true }));
      persistDailyLog({});
    } catch (err) { console.error('Error logging med:', err); }
  };

  const handleDeleteMed = async (id) => {
    if (!user) return;
    if (!isSupabaseConfigured) {
      setMeds(prev => { const u = prev.filter(m => m.id !== id); localStorage.setItem(`lifecue_meds_${user.id}`, JSON.stringify(u)); return u; });
      return;
    }
    try {
      const { error } = await supabase.from('meds').delete().eq('id', id);
      if (error) throw error;
      setMeds(prev => prev.filter(m => m.id !== id));
    } catch (err) { console.error('Error deleting med:', err); }
  };

  const handleAddAppt = async (newAppt) => {
    if (!user) return;
    const uid = user.id;
    if (!isSupabaseConfigured) {
      const mockAppt = { ...newAppt, id: 'local_' + Date.now(), uid, completed: false, created_at: new Date().toISOString() };
      setAppointments(prev => { const u = [mockAppt, ...prev]; localStorage.setItem(`lifecue_appts_${uid}`, JSON.stringify(u)); return u; });
      return;
    }
    try {
      const { data, error } = await supabase.from('appointments').insert([{ ...newAppt, uid, completed: false }]).select().single();
      if (error) throw error;
      setAppointments(prev => [data, ...prev]);
    } catch (err) { console.error('Error adding appt:', err); }
  };

  const handleDeleteAppt = async (id) => {
    if (!user) return;
    if (!isSupabaseConfigured) {
      setAppointments(prev => { const u = prev.filter(a => a.id !== id); localStorage.setItem(`lifecue_appts_${user.id}`, JSON.stringify(u)); return u; });
      return;
    }
    try {
      const { error } = await supabase.from('appointments').delete().eq('id', id);
      if (error) throw error;
      setAppointments(prev => prev.filter(a => a.id !== id));
    } catch (err) { console.error('Error deleting appt:', err); }
  };

  const handleToggleAppt = async (id) => {
    if (!user) return;
    if (!isSupabaseConfigured) {
      setAppointments(prev => { const u = prev.map(a => a.id === id ? { ...a, completed: !a.completed } : a); localStorage.setItem(`lifecue_appts_${user.id}`, JSON.stringify(u)); return u; });
      return;
    }
    const appt = appointments.find(a => a.id === id);
    if (!appt) return;
    const newCompleted = !appt.completed;
    try {
      const { error } = await supabase.from('appointments').update({ completed: newCompleted }).eq('id', id);
      if (error) throw error;
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, completed: newCompleted } : a));

      // snapshot into today's appt_logs
      await supabase.from('appt_logs').upsert({
        uid: user.id, appt_id: id, log_date: todayStr(),
        completed: newCompleted, completed_at: newCompleted ? new Date().toISOString() : null
      }, { onConflict: 'uid,appt_id,log_date' });

      persistDailyLog({});
    } catch (err) { console.error('Error toggling appt:', err); }
  };

  // ── History for Logger page ─────────────────────────────────────
  const fetchHistory = async (limit = 30) => {
    if (!user || !isSupabaseConfigured) return;
    setHistoryLoading(true);
    try {
      const today = todayStr();
      const { data: logs, error } = await supabase
        .from('daily_logs').select('*').eq('uid', user.id).lt('log_date', today)
        .order('log_date', { ascending: false }).limit(limit);
      if (error) throw error;

      const { data: medLogs } = await supabase
        .from('med_logs').select('*').eq('uid', user.id).eq('taken', true).lt('log_date', today);

      const medCountByDate = {};
      (medLogs ?? []).forEach(l => { medCountByDate[l.log_date] = (medCountByDate[l.log_date] || 0) + 1; });

      const merged = (logs ?? []).map(l => ({ ...l, meds_taken: medCountByDate[l.log_date] || 0 }));
      setHistoryLogs(merged);
    } catch (err) { console.error('Error fetching history:', err); }
    setHistoryLoading(false);
  };

  const fetchDayDetail = async (logDate) => {
    if (!user || !isSupabaseConfigured) return null;
    try {
      const { data: medLogs } = await supabase
        .from('med_logs').select('med_id, taken, taken_at').eq('uid', user.id).eq('log_date', logDate);

      const medIds = (medLogs ?? []).map(l => l.med_id);
      let medsInfo = [];
      if (medIds.length > 0) {
        const { data: medsData } = await supabase
          .from('meds').select('id, name, dose, time').in('id', medIds);
        medsInfo = medsData ?? [];
      }

      const takenDetails = (medLogs ?? [])
        .filter(l => l.taken)
        .map(l => {
          const med = medsInfo.find(m => m.id === l.med_id);
          return med ? { ...med, taken_at: l.taken_at } : null;
        })
        .filter(Boolean);

      // appointment logs for this day
      const { data: apptLogs } = await supabase
        .from('appt_logs').select('appt_id, completed, completed_at').eq('uid', user.id).eq('log_date', logDate);

      const apptIds = (apptLogs ?? []).map(l => l.appt_id);
      let apptsInfo = [];
      if (apptIds.length > 0) {
        const { data: apptsData } = await supabase
          .from('appointments').select('id, title, type, month, date, year').in('id', apptIds);
        apptsInfo = apptsData ?? [];
      }

      const apptDetails = (apptLogs ?? [])
        .map(l => {
          const appt = apptsInfo.find(a => a.id === l.appt_id);
          return appt ? { ...appt, completed: l.completed, completed_at: l.completed_at } : null;
        })
        .filter(Boolean);

      return { medsTakenDetail: takenDetails, apptsDetail: apptDetails };
    } catch (err) {
      console.error('Error fetching day detail:', err);
      return null;
    }
  };

  const value = {
    user, isAuthReady, login, loginWithEmail, registerWithEmail, logout,
    meds, appointments, medLogsToday,
    stepsGoal, setStepsGoal, stepsTaken,
    hydrationGoal, setHydrationGoal, hydrationTaken,
    sleepGoal, setSleepGoal, sleepTaken,
    timeLeft,
    handleAddMed, handleLogMed, handleDeleteMed,
    handleAddAppt, handleDeleteAppt, handleToggleAppt,
    updateTracker, calculateCompletion,
    historyLogs, historyLoading, fetchHistory, fetchDayDetail,
    isSupabaseConfigured
  };

  return <HealthContext.Provider value={value}>{children}</HealthContext.Provider>;
}

export function useHealth() {
  const context = useContext(HealthContext);
  if (!context) throw new Error('useHealth must be used within a HealthProvider');
  return context;
}
