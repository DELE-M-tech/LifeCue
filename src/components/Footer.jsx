export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container max-w-7xl">
        <div className="footer-brand">
          <div className="footer-logo-container" style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--on-surface)' }}>LifeCue</h3>
          </div>
          <p className="footer-tagline">Your health, organized. Simple wellness management you can trust.</p>
        </div>
        
        <div className="footer-links">
          <a className="footer-link" href="#">Privacy Policy</a>
          <a className="footer-link" href="#">Terms of Service</a>
          <a className="footer-link" href="#">Contact Us</a>
          <a className="footer-link" href="#">Help Center</a>
          <a className="footer-link" href="#">Career</a>
        </div>
        
        <div className="footer-copyright">
          © 2024 LifeCue. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
