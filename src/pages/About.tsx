import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import robotImage from '../images/robot-image.png';
import styles from './About.module.css';

function About() {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  const handleLearnMore = () => {
    // Navigate to How It Works page when Learn More is clicked
    navigate("/how-it-works");
  };

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
          <li><a href="/how-it-works" onClick={(e) => { e.preventDefault(); navigate("/how-it-works"); }}>How It Works</a></li>
          <li><a href="/contact" onClick={(e) => { e.preventDefault(); navigate("/contact"); }}>Contact</a></li>
        </ul>
        <div className={styles.navButtons}>
          <button className={styles.signupBtn} onClick={openSignupModal}>Sign Up</button>
          <button className={styles.loginBtn} onClick={openLoginModal}>Login</button>
        </div>
      </nav>

      <section className={styles.aboutSection}>
        <div className={styles.aboutText}>
          <h2>About Skill Bridge</h2>
          <p>
            Skill Bridge is an AI-powered platform designed to revolutionize the
            way consultants and businesses connect. Using intelligent algorithms,
            we match consultants with projects that suit their skills and
            expertise.
          </p>
          <p>
            Our goal is to streamline the consultant selection process, helping
            consultants find the best opportunities while providing companies with
            top-tier talent. Skill Bridge is committed to delivering seamless and
            secure matchmaking for a brighter future in consultancy.
          </p>
          <button className={styles.ctaButton} onClick={handleLearnMore}>
            Learn More
          </button>
        </div>

        <div className={styles.aboutImage}>
          <img src={robotImage} alt="AI Robot" />
        </div>
      </section>

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

export default About;
