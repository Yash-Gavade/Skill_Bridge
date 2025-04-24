import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import styles from './About.module.css'; // Reusing About module CSS for styling

function HowItWorks() {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  const openLoginModal = () => {
    setShowLoginModal(true);
    setShowSignupModal(false);
  };

  const openSignupModal = () => {
    setShowSignupModal(true);
    setShowLoginModal(false);
  };

  const closeModals = () => {
    setShowLoginModal(false);
    setShowSignupModal(false);
  };

  const switchToSignup = () => {
    setShowLoginModal(false);
    setShowSignupModal(true);
  };

  const switchToLogin = () => {
    setShowSignupModal(false);
    setShowLoginModal(true);
  };

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <div className={styles.logo}>Skill Bridge</div>
        <ul className={styles.navLinks}>
          <li><a href="/" onClick={(e) => { e.preventDefault(); navigate("/"); }}>Home</a></li>
          <li><a href="/about" onClick={(e) => { e.preventDefault(); navigate("/about"); }}>About Us</a></li>
          <li><a href="/contact" onClick={(e) => { e.preventDefault(); navigate("/contact"); }}>Contact</a></li>
        </ul>
        <div className={styles.navButtons}>
          <button className={styles.signupBtn} onClick={openSignupModal}>Sign Up</button>
          <button className={styles.loginBtn} onClick={openLoginModal}>Login</button>
        </div>
      </nav>

      <div className={styles.aboutSection}>
        <div className={styles.aboutText}>
          <h1>How It Works</h1>
          <p>
            Our AI-powered platform connects consultants with the right projects
            through a streamlined, intelligent process.
          </p>

          <section className={styles.featureSection}>
            <h2>Step 1: Upload Your Document</h2>
            <p>
              Begin by uploading your project document or CV to our secure platform.
              Our system accepts various formats and keeps your data private and secure.
            </p>
          </section>

          <section className={styles.featureSection}>
            <h2>Step 2: AI Analysis</h2>
            <p>
              Our advanced AI analyzes your documents to understand requirements or
              skills. The intelligent system extracts key information and creates a
              comprehensive profile.
            </p>
          </section>

          <section className={styles.featureSection}>
            <h2>Step 3: Smart Matching</h2>
            <p>
              We intelligently match consultants with projects based on skills,
              experience, and project needs. Our algorithm ensures the best fit
              for both parties.
            </p>
          </section>

          <section className={styles.featureSection}>
            <h2>Step 4: Secure Collaboration</h2>
            <p>
              Connect and collaborate securely through our platform. All communications
              and document sharing happens in our encrypted environment.
            </p>
          </section>
        </div>
      </div>

      {/* Modals */}
      {(showLoginModal || showSignupModal) && (
        <div className={styles.overlay} onClick={closeModals}></div>
      )}

      {showLoginModal && (
        <div className={styles.modal}>
          <h2>Welcome Back</h2>
          <form>
            <input type="email" placeholder="Email" required />
            <input type="password" placeholder="Password" required />
            <button type="submit">Login</button>
            <p>Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); switchToSignup(); }}>Sign Up</a></p>
          </form>
        </div>
      )}

      {showSignupModal && (
        <div className={styles.modal}>
          <h2>Create Account</h2>
          <form>
            <input type="text" placeholder="Full Name" required />
            <input type="email" placeholder="Email" required />
            <input type="password" placeholder="Password" required />
            <button type="submit">Sign Up</button>
            <p>Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); switchToLogin(); }}>Login</a></p>
          </form>
        </div>
      )}
    </div>
  );
}

export default HowItWorks;
