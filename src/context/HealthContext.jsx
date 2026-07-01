import { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../supabase';

const HealthContext = createContext();

export function HealthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [meds, setMeds] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [stepsGoal, setStepsGoal] = useState(10000);
  const [stepsTaken, _setStepsTaken] = useState(0);
  const [hydrationGoal, setHydrationGoal] = useState(2.5);
  const [hydrationTaken, _setHydrationTaken] = useState(0);
  const [sleepGoal, setSleepGoal] = useState(8);
  const [sleepTaken, _setSleepTaken] = useState(0);
  const [timeLeft, setTimeLeft] = useState('');

  // ── Auth listener (Supabase) ──────────────────────────────────
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsAuthReady(true);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsAuthReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  // ── Auth actions ──────────────────────────────────────────────
  const login = () =>
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` }
    });

  const loginWithEmail = (email, password) =>
    supabase.auth.signInWithPassword({ email, password });

  const registerWithEmail = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/dashboard` }
    });
    if (error) throw error;
    return data;
  };

  const logout = () => supabase.auth.signOut();

  // ── Tracker persistence (atomic goal + taken) ────────────────
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

    const dbGoalCol = `${type}_goal`;
    const dbTakenCol = `${type}_taken`;

    try {
      const { error } = await supabase
        .from('users')
        .update({ [dbGoalCol]: goal, [dbTakenCol]: taken })
        .eq('uid', user.id);
      if (error) throw error;
    } catch (err) {
      console.error(`Error updating ${type} tracker:`, err);
    }
  };

  // ── Data sync ─────────────────────────────────────────────────
  useEffect(() => {
    if (!user) {
      setMeds([]);
      setAppointments([]);
      return;
    }

    if (!isSupabaseConfigured) {
      // localStorage fallback
      try {
        const uid = user.id;
        const storedMeds = localStorage.getItem(`lifecue_meds_${uid}`);
        setMeds(storedMeds ? JSON.parse(storedMeds) : []);

        const storedAppts = localStorage.getItem(`lifecue_appts_${uid}`);
        setAppointments(storedAppts ? JSON.parse(storedAppts) : []);

        const sg = localStorage.getItem(`lifecue_steps_goal_${uid}`);
        if (sg) setStepsGoal(Number(sg));
        const st = localStorage.getItem(`lifecue_steps_taken_${uid}`);
        _setStepsTaken(st ? Number(st) : 0);

        const hg = localStorage.getItem(`lifecue_hydration_goal_${uid}`);
        if (hg) setHydrationGoal(Number(hg));
        const ht = localStorage.getItem(`lifecue_hydration_taken_${uid}`);
        _setHydrationTaken(ht ? Number(ht) : 0);

        const slg = localStorage.getItem(`lifecue_sleep_goal_${uid}`);
        if (slg) setSleepGoal(Number(slg));
        const slt = localStorage.getItem(`lifecue_sleep_taken_${uid}`);
        _setSleepTaken(slt ? Number(slt) : 0);
      } catch (err) {
        console.error('Error loading localStorage data:', err);
      }
      return;
    }

    const fetchData = async () => {
      try {
        const uid = user.id;

        // Upsert user profile
        await supabase.from('users').upsert({
          uid,
          email: user.email,
          display_name: user.user_metadata?.full_name ?? user.email,
          photo_url: user.user_metadata?.avatar_url ?? null
        }, { onConflict: 'uid' });

        // Fetch profile goals
        const { data: userData } = await supabase
          .from('users').select('*').eq('uid', uid).single();

        if (userData) {
          if (userData.steps_goal) setStepsGoal(userData.steps_goal);
          if (userData.hydration_goal) setHydrationGoal(userData.hydration_goal);
          if (userData.sleep_goal) setSleepGoal(userData.sleep_goal);
          _setStepsTaken(userData.steps_taken ?? 0);
          _setHydrationTaken(userData.hydration_taken ?? 0);
          _setSleepTaken(userData.sleep_taken ?? 0);
        }

        // Fetch meds
        const { data: medsData, error: medsError } = await supabase
          .from('meds').select('*').eq('uid', uid).order('created_at', { ascending: false });
        if (medsError) throw medsError;
        setMeds(medsData ?? []);

        // Fetch appointments
        const { data: apptsData, error: apptsError } = await supabase
          .from('appointments').select('*').eq('uid', uid).order('created_at', { ascending: false });
        if (apptsError) throw apptsError;
        setAppointments(apptsData ?? []);

      } catch (err) {
        console.error('Error fetching data from Supabase:', err);
      }
    };

    fetchData();
  }, [user?.id]);

  // ── Daily reset timer ─────────────────────────────────────────
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();

      if (diff <= 0) {
        _setStepsTaken(0);
        _setHydrationTaken(0);
        _setSleepTaken(0);
      }

      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(
        `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
      );
    };

    const timer = setInterval(updateTimer, 1000);
    updateTimer();
    return () => clearInterval(timer);
  }, []);

  // ── CRUD ──────────────────────────────────────────────────────
  const handleAddMed = async (newMed) => {
    if (!user) return;
    const uid = user.id;

    if (!isSupabaseConfigured) {
      const mockMed = { ...newMed, id: 'local_' + Date.now(), uid, status: 'Scheduled', taken: false, created_at: new Date().toISOString() };
      setMeds(prev => { const u = [mockMed, ...prev]; localStorage.setItem(`lifecue_meds_${uid}`, JSON.stringify(u)); return u; });
      return;
    }
    try {
      const { data, error } = await supabase.from('meds')
        .insert([{ ...newMed, uid, status: 'Scheduled', taken: false }]).select().single();
      if (error) throw error;
      setMeds(prev => [data, ...prev]);
    } catch (err) { console.error('Error adding med:', err); }
  };

  const handleLogMed = async (id) => {
    if (!user) return;
    if (!isSupabaseConfigured) {
      setMeds(prev => { const u = prev.map(m => m.id === id ? { ...m, taken: true, status: 'Taken' } : m); localStorage.setItem(`lifecue_meds_${user.id}`, JSON.stringify(u)); return u; });
      return;
    }
    try {
      const { error } = await supabase.from('meds').update({ taken: true, status: 'Taken' }).eq('id', id);
      if (error) throw error;
      setMeds(prev => prev.map(m => m.id === id ? { ...m, taken: true, status: 'Taken' } : m));
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
      const { data, error } = await supabase.from('appointments')
        .insert([{ ...newAppt, uid, completed: false }]).select().single();
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
    try {
      const { error } = await supabase.from('appointments').update({ completed: !appt.completed }).eq('id', id);
      if (error) throw error;
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, completed: !a.completed } : a));
    } catch (err) { console.error('Error toggling appt:', err); }
  };

  const calculateCompletion = () => {
    const stepsScore = Math.min(1, stepsTaken / stepsGoal);
    const hydrationScore = Math.min(1, hydrationTaken / hydrationGoal);
    const sleepScore = Math.min(1, sleepTaken / sleepGoal);
    const medsScore = meds.length === 0 ? 1 : meds.filter(m => m.taken).length / meds.length;
    const apptsScore = appointments.length === 0 ? 1 : appointments.filter(a => a.completed).length / appointments.length;
    const total = (stepsScore + hydrationScore + sleepScore + medsScore + apptsScore) / 5;
    return Math.round(total * 100);
  };

  const value = {
    user, isAuthReady, login, loginWithEmail, registerWithEmail, logout,
    meds, appointments,
    stepsGoal, setStepsGoal,
    stepsTaken,
    hydrationGoal, setHydrationGoal,
    hydrationTaken,
    sleepGoal, setSleepGoal,
    sleepTaken,
    timeLeft,
    handleAddMed, handleLogMed, handleDeleteMed,
    handleAddAppt, handleDeleteAppt, handleToggleAppt,
    updateTracker, calculateCompletion,
    isSupabaseConfigured
  };

  return <HealthContext.Provider value={value}>{children}</HealthContext.Provider>;
}

export function useHealth() {
  const context = useContext(HealthContext);
  if (!context) throw new Error('useHealth must be used within a HealthProvider');
  return context;
}
