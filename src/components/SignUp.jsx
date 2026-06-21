import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useHealth } from '../context/HealthContext.jsx';
import { useState, useEffect } from 'react';

export default function SignUp() {
  const navigate = useNavigate();
  const { login, registerWithEmail, user, isAuthReady } = useHealth();
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthReady && user) {
      navigate('/dashboard');
    }
  }, [user, isAuthReady, navigate]);

  const handleGoogleLogin = async () => {
    setError(null);
    setIsLoading(true);
    try {
      await login();
    } catch (err) {
      console.error("Login failed:", err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError("The sign-in window was closed before completion. Please try again.");
      } else if (err.code === 'auth/cancelled-by-user') {
        setError("Sign-in was cancelled. Please try again.");
      } else {
        setError("An unexpected error occurred during sign-in. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await registerWithEmail(email, password);
    } catch (err) {
      console.error("Signup failed:", err);
      if (err.code === 'auth/email-already-in-use') {
        setError("This email is already registered. Please sign in instead.");
      } else if (err.code === 'auth/weak-password') {
        setError("Password should be at least 6 characters.");
      } else if (err.code === 'auth/invalid-email') {
        setError("Please enter a valid email address.");
      } else {
        setError("An error occurred during account creation. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Link to="/" className="auth-back-btn">
        <ArrowLeft size={20} />
      </Link>

      {/* Left Side - Phone Mockup */}
      <div className="auth-left">
        <div className="auth-left-glow"></div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="auth-phone-wrap"
        >
          <svg viewBox="0 0 300 610" className="auth-phone-svg" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="screenGradSignUp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#e8f9f6" />
                <stop offset="100%" stopColor="#ffffff" />
              </linearGradient>
              <linearGradient id="cardGradSignUp" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#14b8a6" />
                <stop offset="100%" stopColor="#0a84ff" />
              </linearGradient>
            </defs>

            <rect x="2" y="2" width="296" height="606" rx="56" fill="#1c1c1e" />
            <rect x="6" y="6" width="288" height="598" rx="52" fill="#0f1b2d" />
            <rect x="12" y="12" width="276" height="586" rx="46" fill="url(#screenGradSignUp)" />

            <text x="34" y="44" fontFamily="Manrope, sans-serif" fontSize="14" fontWeight="700" fill="#0f1b2d">9:41</text>
            <rect x="232" y="34" width="24" height="12" rx="3" fill="#0f1b2d" opacity="0.85" />
            <rect x="260" y="34" width="6" height="12" rx="2" fill="#0f1b2d" opacity="0.6" />
            <rect x="108" y="28" width="84" height="26" rx="13" fill="#000000" />

            <text x="34" y="100" fontFamily="Manrope, sans-serif" fontSize="20" fontWeight="800" fill="#0f1b2d">Welcome to LifeCue</text>
            <text x="34" y="122" fontFamily="Manrope, sans-serif" fontSize="13" fontWeight="500" fill="#5b6b80">Set up takes under a minute</text>

            {/* Onboarding card */}
            <rect x="28" y="150" width="244" height="92" rx="20" fill="url(#cardGradSignUp)" />
            <text x="48" y="183" fontFamily="Manrope, sans-serif" fontSize="12" fontWeight="800" fill="#ffffff" opacity="0.85">STEP 1 OF 3</text>
            <text x="48" y="207" fontFamily="Manrope, sans-serif" fontSize="16" fontWeight="800" fill="#ffffff">Add your medications</text>
            <text x="48" y="226" fontFamily="Manrope, sans-serif" fontSize="12" fontWeight="500" fill="#ffffff" opacity="0.85">Takes about 30 seconds</text>

            {/* Feature rows */}
            <rect x="28" y="258" width="244" height="58" rx="16" fill="#ffffff" stroke="#e8ecf1" />
            <rect x="40" y="279" width="24" height="24" rx="6" fill="#d4f5f0" />
            <text x="72" y="283" fontFamily="Manrope, sans-serif" fontSize="13" fontWeight="700" fill="#0f1b2d">Smart reminders</text>
            <text x="72" y="298" fontFamily="Manrope, sans-serif" fontSize="11" fontWeight="500" fill="#8696ad">Never miss a dose again</text>

            <rect x="28" y="330" width="244" height="58" rx="16" fill="#ffffff" stroke="#e8ecf1" />
            <rect x="40" y="351" width="24" height="24" rx="6" fill="#d6ebff" />
            <text x="72" y="355" fontFamily="Manrope, sans-serif" fontSize="13" fontWeight="700" fill="#0f1b2d">Appointment tracking</text>
            <text x="72" y="370" fontFamily="Manrope, sans-serif" fontSize="11" fontWeight="500" fill="#8696ad">All your visits, one place</text>

            <rect x="28" y="402" width="244" height="58" rx="16" fill="#ffffff" stroke="#e8ecf1" />
            <rect x="40" y="423" width="24" height="24" rx="6" fill="#e3eaff" />
            <text x="72" y="427" fontFamily="Manrope, sans-serif" fontSize="13" fontWeight="700" fill="#0f1b2d">Weekly summaries</text>
            <text x="72" y="442" fontFamily="Manrope, sans-serif" fontSize="11" fontWeight="500" fill="#8696ad">See your progress at a glance</text>

            <circle cx="80" cy="556" r="4" fill="#c7d2dc" />
            <circle cx="150" cy="556" r="4" fill="#14b8a6" />
            <circle cx="220" cy="556" r="4" fill="#c7d2dc" />
          </svg>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="auth-left-text"
        >
          <h1 className="auth-quote-title">Your health, organized.</h1>
          <p className="auth-quote-text">
            Join thousands managing their wellness simply — meds, appointments, and daily health in one place.
          </p>
        </motion.div>
      </div>

      {/* Right Side - Form */}
      <div className="auth-right">
        <Link to="/" className="logo">
          <div className="logo-mark">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="9" width="20" height="8" rx="4" fill="#0a84ff"/>
              <path d="M12 9V17" stroke="white" strokeWidth="1.5" strokeOpacity="0.5"/>
              <path d="M14.7 11.7L15.8 12.8L17.8 10.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="logo-wordmark">LifeCue</span>
        </Link>

        <div className="auth-header">
          <h2>Get Started</h2>
          <p>Create your account in seconds.</p>
        </div>

        <div className="auth-form">
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="auth-error"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={handleGoogleLogin}
            className="auth-google-btn"
            disabled={isLoading}
          >
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C34.5 5.1 29.5 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.4-.1-2.4-.4-3.5z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 16 18.9 13 24 13c3.1 0 5.8 1.1 8 3l6-6C34.5 5.1 29.5 3 24 3 16.3 3 9.6 7.3 6.3 14.7z"/>
              <path fill="#4CAF50" d="M24 45c5.4 0 10.3-1.9 14-5.1l-6.5-5.5C29.5 36 26.9 37 24 37c-5.3 0-9.6-3.3-11.2-8l-6.6 5.1C9.5 40.6 16.2 45 24 45z"/>
              <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.3-4.1 5.7l6.5 5.5C41.5 36 45 30.6 45 24c0-1.4-.1-2.4-.4-3.5z"/>
            </svg>
            {isLoading ? "Signing up..." : "Sign up with Google"}
          </button>

          <div className="auth-divider">
            <span>or sign up with email</span>
          </div>

          <form onSubmit={handleEmailSignUp}>
            <div className="form-group">
              <label className="form-label">Full name</label>
              <input
                type="text"
                className="form-input"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email address</label>
              <input
                type="email"
                className="form-input"
                placeholder="name@wellness.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <button type="submit" className="auth-submit-secondary" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create account with email"}
            </button>
          </form>
        </div>

        <p className="auth-footer">
          Already have an account? <Link to="/signin">Sign in</Link>
        </p>

        <div className="auth-legal">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Support</a>
        </div>
        <p className="copyright-small">© 2026 LifeCue. Secure & Encrypted.</p>
      </div>
    </div>
  );
}
