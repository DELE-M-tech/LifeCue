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
      {/* Left Side - Image & Quote */}
      <div className="auth-left">
        <img 
          src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
          alt="Mindfulness" 
          className="auth-left-image"
          referrerPolicy="no-referrer"
        />
        <div className="auth-left-overlay">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="auth-quote-card"
          >
            <h1 className="auth-quote-title">Take control of your health.</h1>
            <p className="auth-quote-text">
              Manage your medications, appointments, and wellness in one simple, secure place.
            </p>
            <div className="auth-stats">
              <div className="auth-stat-item">
                <h4>12k+</h4>
                <p>Users Trusted</p>
              </div>
              <div className="auth-stat-item">
                <h4>98%</h4>
                <p>On-Time Doses</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="auth-right">
        <Link to="/" style={{ display: 'inline-block', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--on-surface)' }}>LifeCue</h3>
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
                style={{ 
                  background: 'rgba(239, 68, 68, 0.1)', 
                  border: '1px solid rgba(239, 68, 68, 0.2)', 
                  color: '#ef4444', 
                  padding: '1rem', 
                  borderRadius: '0.75rem', 
                  marginBottom: '1.5rem',
                  fontSize: '0.875rem',
                  textAlign: 'center'
                }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleEmailLogin}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
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

            <button type="submit" className="auth-submit" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Log in"}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0', gap: '1rem' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
            <span style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
          </div>

          <button 
            onClick={handleGoogleLogin} 
            className="auth-submit"
            disabled={isLoading}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '1rem',
              background: 'white',
              color: 'black'
            }}
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '20px' }} />
            Continue with Google
          </button>
          
          <div style={{ textAlign: 'center', margin: '1.5rem 0 0 0', opacity: 0.5 }}>
            <p style={{ fontSize: '0.75rem' }}>Secure authentication via Google</p>
          </div>
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
