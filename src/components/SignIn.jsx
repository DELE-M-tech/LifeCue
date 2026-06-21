import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useHealth } from '../context/HealthContext.jsx';
import { useState, useEffect } from 'react';

export default function SignIn() {
  const navigate = useNavigate();
  const { login, loginWithEmail, user, isAuthReady } = useHealth();

  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await loginWithEmail(email, password);
    } catch (err) {
      console.error("Login failed:", err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError("Invalid email or password. Please try again.");
      } else if (err.code === 'auth/invalid-email') {
        setError("Please enter a valid email address.");
      } else {
        setError("An error occurred during sign-in. Please try again.");
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
              <linearGradient id="screenGradSignIn" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#eaf4ff" />
                <stop offset="100%" stopColor="#ffffff" />
              </linearGradient>
              <linearGradient id="cardGradSignIn" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#0a84ff" />
                <stop offset="100%" stopColor="#14b8a6" />
              </linearGradient>
            </defs>

            {/* Titanium frame */}
            <rect x="2" y="2" width="296" height="606" rx="56" fill="#1c1c1e" />
            <rect x="6" y="6" width="288" height="598" rx="52" fill="#0f1b2d" />
            {/* Screen */}
            <rect x="12" y="12" width="276" height="586" rx="46" fill="url(#screenGradSignIn)" />

            {/* Status bar */}
            <text x="34" y="44" fontFamily="Manrope, sans-serif" fontSize="14" fontWeight="700" fill="#0f1b2d">9:41</text>
            <rect x="232" y="34" width="24" height="12" rx="3" fill="#0f1b2d" opacity="0.85" />
            <rect x="260" y="34" width="6" height="12" rx="2" fill="#0f1b2d" opacity="0.6" />

            {/* Dynamic Island */}
            <rect x="108" y="28" width="84" height="26" rx="13" fill="#000000" />

            {/* App header */}
            <text x="34" y="100" fontFamily="Manrope, sans-serif" fontSize="20" fontWeight="800" fill="#0f1b2d">Good evening</text>
            <text x="34" y="122" fontFamily="Manrope, sans-serif" fontSize="13" fontWeight="500" fill="#5b6b80">You're all caught up today</text>

            {/* Reminder card */}
            <rect x="28" y="150" width="244" height="92" rx="20" fill="url(#cardGradSignIn)" />
            <text x="48" y="183" fontFamily="Manrope, sans-serif" fontSize="12" fontWeight="800" fill="#ffffff" opacity="0.85">UPCOMING</text>
            <text x="48" y="207" fontFamily="Manrope, sans-serif" fontSize="16" fontWeight="800" fill="#ffffff">Lisinopril · 8:00 PM</text>
            <text x="48" y="226" fontFamily="Manrope, sans-serif" fontSize="12" fontWeight="500" fill="#ffffff" opacity="0.85">1 tablet, with water</text>

            {/* Completed item */}
            <rect x="28" y="258" width="244" height="58" rx="16" fill="#ffffff" stroke="#e8ecf1" />
            <circle cx="52" cy="287" r="12" fill="#d4f5f0" />
            <path d="M46 287l4 4 8-8" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <text x="72" y="283" fontFamily="Manrope, sans-serif" fontSize="13" fontWeight="700" fill="#0f1b2d">Morning vitamins</text>
            <text x="72" y="298" fontFamily="Manrope, sans-serif" fontSize="11" fontWeight="500" fill="#8696ad">Taken at 8:02 AM</text>

            {/* Upcoming appointment */}
            <rect x="28" y="330" width="244" height="58" rx="16" fill="#ffffff" stroke="#e8ecf1" />
            <rect x="40" y="351" width="24" height="24" rx="6" fill="#d6ebff" />
            <text x="72" y="355" fontFamily="Manrope, sans-serif" fontSize="13" fontWeight="700" fill="#0f1b2d">Dr. Adeyemi</text>
            <text x="72" y="370" fontFamily="Manrope, sans-serif" fontSize="11" fontWeight="500" fill="#8696ad">Tomorrow, 10:30 AM</text>

            {/* Weekly summary */}
            <text x="34" y="426" fontFamily="Manrope, sans-serif" fontSize="13" fontWeight="800" fill="#0f1b2d">This week</text>
            <rect x="28" y="440" width="244" height="6" rx="3" fill="#e8ecf1" />
            <rect x="28" y="440" width="210" height="6" rx="3" fill="#0a84ff" />
            <text x="34" y="468" fontFamily="Manrope, sans-serif" fontSize="11" fontWeight="600" fill="#5b6b80">21 of 24 doses on time</text>

            {/* Bottom tab bar */}
            <rect x="12" y="528" width="276" height="70" rx="0" fill="#ffffff" opacity="0" />
            <circle cx="80" cy="556" r="4" fill="#0a84ff" />
            <circle cx="150" cy="556" r="4" fill="#c7d2dc" />
            <circle cx="220" cy="556" r="4" fill="#c7d2dc" />
          </svg>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="auth-left-text"
        >
          <h1 className="auth-quote-title">Your routine, right on time.</h1>
          <p className="auth-quote-text">
            Sign back in to pick up where you left off — every dose and appointment tracked automatically.
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
          <h2>Sign In</h2>
          <p>Welcome back. Your health is waiting.</p>
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
            {isLoading ? "Signing in..." : "Continue with Google"}
          </button>

          <div className="auth-divider">
            <span>or sign in with email</span>
          </div>

          <form onSubmit={handleEmailLogin}>
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
              <label className="form-label">
                Password
                <a href="#" className="forgot-password">Forgot?</a>
              </label>
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
              {isLoading ? "Signing in..." : "Log in with email"}
            </button>
          </form>
        </div>

        <p className="auth-footer">
          New to the experience? <Link to="/signup">Create an account</Link>
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
