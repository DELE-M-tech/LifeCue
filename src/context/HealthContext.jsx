import { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
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

  const setStepsTaken = (val) => {
    _setStepsTaken(val);
    if (user) {
      localStorage.setItem(`lifecue_steps_taken_${user.uid}`, val);
      if (isSupabaseConfigured) {
        supabase
          .from('users')
          .update({ steps_taken: val })
          .eq('uid', user.uid)
          .catch(err => console.warn('Supabase steps_taken update failed:', err));
      }
    }
  };

  const setHydrationTaken = (val) => {
    _setHydrationTaken(val);
    if (user) {
      localStorage.setItem(`lifecue_hydration_taken_${user.uid}`, val);
      if (isSupabaseConfigured) {
        supabase
          .from('users')
          .update({ hydration_taken: val })
          .eq('uid', user.uid)
          .catch(err => console.warn('Supabase hydration_taken update failed:', err));
      }
    }
  };

  const setSleepTaken = (val) => {
    _setSleepTaken(val);
    if (user) {
      localStorage.setItem(`lifecue_sleep_taken_${user.uid}`, val);
      if (isSupabaseConfigured) {
        supabase
          .from('users')
          .update({ sleep_taken: val })
          .eq('uid', user.uid)
          .catch(err => console.warn('Supabase sleep_taken update failed:', err));
      }
    }
  };

  // Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // Sync user profile and data from Supabase / localStorage fallback
  useEffect(() => {
    if (!user) {
      setMeds([]);
      setAppointments([]);
      return;
    }

    if (!isSupabaseConfigured) {
      // Load fallback data from localStorage
      try {
        const storedMeds = localStorage.getItem(`lifecue_meds_${user.uid}`);
        if (storedMeds) {
          setMeds(JSON.parse(storedMeds));
        } else {
          setMeds([]);
        }

        const storedAppts = localStorage.getItem(`lifecue_appts_${user.uid}`);
        if (storedAppts) {
          setAppointments(JSON.parse(storedAppts));
        } else {
          setAppointments([]);
        }

        const storedSteps = localStorage.getItem(`lifecue_steps_goal_${user.uid}`);
        if (storedSteps) setStepsGoal(Number(storedSteps));

        const storedStepsTaken = localStorage.getItem(`lifecue_steps_taken_${user.uid}`);
        _setStepsTaken(storedStepsTaken ? Number(storedStepsTaken) : 0);

        const storedHydration = localStorage.getItem(`lifecue_hydration_goal_${user.uid}`);
        if (storedHydration) setHydrationGoal(Number(storedHydration));

        const storedHydrationTaken = localStorage.getItem(`lifecue_hydration_taken_${user.uid}`);
        _setHydrationTaken(storedHydrationTaken ? Number(storedHydrationTaken) : 0);

        const storedSleep = localStorage.getItem(`lifecue_sleep_goal_${user.uid}`);
        if (storedSleep) setSleepGoal(Number(storedSleep));

        const storedSleepTaken = localStorage.getItem(`lifecue_sleep_taken_${user.uid}`);
        _setSleepTaken(storedSleepTaken ? Number(storedSleepTaken) : 0);
      } catch (err) {
        console.error('Error loading fallback storage data:', err);
      }
      return;
    }

    const fetchData = async () => {
      try {
        // Ensure user exists in Supabase
        const { error: upsertError } = await supabase
          .from('users')
          .upsert({
            uid: user.uid,
            email: user.email,
            display_name: user.displayName,
            photo_url: user.photoURL
          }, { onConflict: 'uid' });

        if (upsertError) throw upsertError;

        // Fetch profile
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('uid', user.uid)
          .single();

        if (userError && userError.code !== 'PGRST116') throw userError;
        if (userData) {
          if (userData.steps_goal) setStepsGoal(userData.steps_goal);
          if (userData.hydration_goal) setHydrationGoal(userData.hydration_goal);
          if (userData.sleep_goal) setSleepGoal(userData.sleep_goal);

          _setStepsTaken(userData.steps_taken !== undefined && userData.steps_taken !== null ? userData.steps_taken : 0);
          _setHydrationTaken(userData.hydration_taken !== undefined && userData.hydration_taken !== null ? userData.hydration_taken : 0);
          _setSleepTaken(userData.sleep_taken !== undefined && userData.sleep_taken !== null ? userData.sleep_taken : 0);
        }

        // Fetch meds
        const { data: medsData, error: medsError } = await supabase
          .from('meds')
          .select('*')
          .eq('uid', user.uid)
          .order('created_at', { ascending: false });

        if (medsError) throw medsError;
        setMeds(medsData.map(m => ({ ...m, id: m.id })));

        // Fetch appointments
        const { data: apptsData, error: apptsError } = await supabase
          .from('appointments')
          .select('*')
          .eq('uid', user.uid)
          .order('created_at', { ascending: false });

        if (apptsError) throw apptsError;
        setAppointments(apptsData.map(a => ({ ...a, id: a.id })));
      } catch (err) {
        console.error('Error fetching data from Supabase:', err);
      }
    };

    fetchData();
  }, [user]);

  // Timer logic for daily reset
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      
      const diff = midnight.getTime() - now.getTime();
      
      if (diff <= 0) {
        setStepsTaken(0);
        setHydrationTaken(0);
        setSleepTaken(0);
        midnight.setHours(24, 0, 0, 0);
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    };

    const timer = setInterval(updateTimer, 1000);
    updateTimer();
    return () => clearInterval(timer);
  }, []);

  const login = () => signInWithPopup(auth, googleProvider);
  const loginWithEmail = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const registerWithEmail = (email, password) => createUserWithEmailAndPassword(auth, email, password);
  const logout = () => signOut(auth);

  const handleAddMed = async (newMed) => {
    if (!user) return;

    if (!isSupabaseConfigured) {
      const mockMed = {
        ...newMed,
        id: 'local_' + Date.now(),
        uid: user.uid,
        status: 'Scheduled',
        taken: false,
        created_at: new Date().toISOString()
      };
      setMeds(prev => {
        const updated = [mockMed, ...prev];
        localStorage.setItem(`lifecue_meds_${user.uid}`, JSON.stringify(updated));
        return updated;
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('meds')
        .insert([{ ...newMed, uid: user.uid, status: 'Scheduled', taken: false }])
        .select()
        .single();

      if (error) throw error;
      setMeds(prev => [{ ...data, id: data.id }, ...prev]);
    } catch (err) {
      console.error('Error adding med:', err);
    }
  };

  const handleLogMed = async (id) => {
    if (!user) return;

    if (!isSupabaseConfigured) {
      setMeds(prev => {
        const updated = prev.map(m => m.id === id ? { ...m, taken: true, status: 'Taken' } : m);
        localStorage.setItem(`lifecue_meds_${user.uid}`, JSON.stringify(updated));
        return updated;
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('meds')
        .update({ taken: true, status: 'Taken' })
        .eq('id', id);

      if (error) throw error;
      setMeds(prev => prev.map(m => m.id === id ? { ...m, taken: true, status: 'Taken' } : m));
    } catch (err) {
      console.error('Error logging med:', err);
    }
  };

  const handleDeleteMed = async (id) => {
    if (!user) return;

    if (!isSupabaseConfigured) {
      setMeds(prev => {
        const updated = prev.filter(m => m.id !== id);
        localStorage.setItem(`lifecue_meds_${user.uid}`, JSON.stringify(updated));
        return updated;
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('meds')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setMeds(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      console.error('Error deleting med:', err);
    }
  };

  const handleAddAppt = async (newAppt) => {
    if (!user) return;

    if (!isSupabaseConfigured) {
      const mockAppt = {
        ...newAppt,
        id: 'local_' + Date.now(),
        uid: user.uid,
        completed: false,
        created_at: new Date().toISOString()
      };
      setAppointments(prev => {
        const updated = [mockAppt, ...prev];
        localStorage.setItem(`lifecue_appts_${user.uid}`, JSON.stringify(updated));
        return updated;
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert([{ ...newAppt, uid: user.uid, completed: false }])
        .select()
        .single();

      if (error) throw error;
      setAppointments(prev => [{ ...data, id: data.id }, ...prev]);
    } catch (err) {
      console.error('Error adding appt:', err);
    }
  };

  const handleDeleteAppt = async (id) => {
    if (!user) return;

    if (!isSupabaseConfigured) {
      setAppointments(prev => {
        const updated = prev.filter(a => a.id !== id);
        localStorage.setItem(`lifecue_appts_${user.uid}`, JSON.stringify(updated));
        return updated;
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setAppointments(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error('Error deleting appt:', err);
    }
  };

  const handleToggleAppt = async (id) => {
    if (!user) return;

    if (!isSupabaseConfigured) {
      setAppointments(prev => {
        const updated = prev.map(a => a.id === id ? { ...a, completed: !a.completed } : a);
        localStorage.setItem(`lifecue_appts_${user.uid}`, JSON.stringify(updated));
        return updated;
      });
      return;
    }

    const appt = appointments.find(a => a.id === id);
    if (!appt) return;
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ completed: !appt.completed })
        .eq('id', id);

      if (error) throw error;
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, completed: !a.completed } : a));
    } catch (err) {
      console.error('Error toggling appt:', err);
    }
  };

  const handleUpdateGoals = async (goals) => {
    if (!user) return;

    if (!isSupabaseConfigured) {
      if (goals.stepsGoal !== undefined) {
        setStepsGoal(goals.stepsGoal);
        localStorage.setItem(`lifecue_steps_goal_${user.uid}`, goals.stepsGoal);
      }
      if (goals.hydrationGoal !== undefined) {
        setHydrationGoal(goals.hydrationGoal);
        localStorage.setItem(`lifecue_hydration_goal_${user.uid}`, goals.hydrationGoal);
      }
      if (goals.sleepGoal !== undefined) {
        setSleepGoal(goals.sleepGoal);
        localStorage.setItem(`lifecue_sleep_goal_${user.uid}`, goals.sleepGoal);
      }
      return;
    }

    try {
      // Map frontend goal names to snake_case for Supabase
      const mappedGoals = {};
      if (goals.stepsGoal !== undefined) mappedGoals.steps_goal = goals.stepsGoal;
      if (goals.hydrationGoal !== undefined) mappedGoals.hydration_goal = goals.hydrationGoal;
      if (goals.sleepGoal !== undefined) mappedGoals.sleep_goal = goals.sleepGoal;

      const { error } = await supabase
        .from('users')
        .update(mappedGoals)
        .eq('uid', user.uid);

      if (error) throw error;
      
      if (goals.stepsGoal) setStepsGoal(goals.stepsGoal);
      if (goals.hydrationGoal) setHydrationGoal(goals.hydrationGoal);
      if (goals.sleepGoal) setSleepGoal(goals.sleepGoal);
    } catch (err) {
      console.error('Error updating goals:', err);
    }
  };

  const calculateCompletion = () => {
    const totalProgress = stepsTaken + hydrationTaken + sleepTaken + 
      meds.filter(m => m.taken).length + 
      appointments.filter(a => a.completed).length;

    if (totalProgress === 0) {
      return 0;
    }

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
    stepsTaken, setStepsTaken,
    hydrationGoal, setHydrationGoal,
    hydrationTaken, setHydrationTaken,
    sleepGoal, setSleepGoal,
    sleepTaken, setSleepTaken,
    timeLeft,
    handleAddMed,
    handleLogMed,
    handleDeleteMed,
    handleAddAppt,
    handleDeleteAppt,
    handleToggleAppt,
    handleUpdateGoals,
    calculateCompletion,
    isSupabaseConfigured
  };

  return (
    <HealthContext.Provider value={value}>
      {children}
    </HealthContext.Provider>
  );
}

export function useHealth() {
  const context = useContext(HealthContext);
  if (!context) {
    throw new Error('useHealth must be used within a HealthProvider');
  }
  return context;
}
