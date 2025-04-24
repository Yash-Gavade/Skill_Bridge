import { ChangeEvent, DragEvent, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";
import robotImage from "/images/robot-image.png";

function Home() {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showGetStartedModal, setShowGetStartedModal] = useState(false);
  const [showUploadDocModal, setShowUploadDocModal] = useState(false);
  const [showUploadCvModal, setShowUploadCvModal] = useState(false);
  const [showSpinnerModal, setShowSpinnerModal] = useState(false);
  const [isContentBlurred, setIsContentBlurred] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);

  const openLoginModal = () => {
    setShowLoginModal(true);
    setShowSignupModal(false);
    setIsContentBlurred(true);
  };

  const openSignupModal = () => {
    setShowSignupModal(true);
    setShowLoginModal(false);
    setIsContentBlurred(true);
  };

  const openGetStartedModal = () => {
    setShowGetStartedModal(true);
    setIsContentBlurred(true);
  };

  const openUploadDocModal = () => {
    setShowGetStartedModal(false);
    setShowUploadDocModal(true);
  };

  const openUploadCvModal = () => {
    setShowGetStartedModal(false);
    setShowUploadCvModal(true);
  };

  const closeAllModals = () => {
    setShowLoginModal(false);
    setShowSignupModal(false);
    setShowGetStartedModal(false);
    setShowUploadDocModal(false);
    setShowUploadCvModal(false);
    setShowSpinnerModal(false);
    setIsContentBlurred(false);
  };

  const switchToSignup = () => {
    setShowLoginModal(false);
    setShowSignupModal(true);
  };

  const switchToLogin = () => {
    setShowSignupModal(false);
    setShowLoginModal(true);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile();
  };

  const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    processFile();
  };

  const processFile = () => {
    if (fileInputRef.current) {
      const uploadBtn = document.querySelector(`.${styles.btnPurple}`) as HTMLButtonElement;
      if (uploadBtn) {
        uploadBtn.textContent = 'Uploading...';
        uploadBtn.disabled = true;
      }

      setTimeout(() => {
        setShowUploadDocModal(false);
        setShowSpinnerModal(true);

        setTimeout(() => {
          setShowSpinnerModal(false);
          closeAllModals();
          navigate("/upload-project");
        }, 2000);
      }, 1000);
    }
  };

  const processCV = () => {
    if (cvInputRef.current) {
      const uploadBtn = document.querySelector(`#${styles.uploadCvModal} .${styles.btnPurple}`) as HTMLButtonElement;
      if (uploadBtn) {
        uploadBtn.textContent = 'Uploading...';
        uploadBtn.disabled = true;
      }

      setTimeout(() => {
        setShowUploadCvModal(false);
        setShowSpinnerModal(true);

        setTimeout(() => {
          setShowSpinnerModal(false);
          closeAllModals();
          navigate("/profiles");
        }, 2000);
      }, 1000);
    }
  };

  // Add the function to go directly to dashboard
  const goToDashboard = () => {
    closeAllModals();
    navigate("/dashboard");
  };

  return (
    <>
      <div className={`${styles.pageContent} ${isContentBlurred ? styles.blurred : ""}`}>
        <div className={styles.container}>
          <nav className={`${styles.navbar} ${isContentBlurred ? styles.blurred : ""}`}>
            <div className={styles.logo}>Skill Bridge</div>
            <ul className={styles.navLinks}>
              <li><a href="/about" onClick={(e) => { e.preventDefault(); navigate("/about"); }}>About Us</a></li>
              <li><a href="/how-it-works" onClick={(e) => { e.preventDefault(); navigate("/how-it-works"); }}>How It Works</a></li>
              <li><a href="/contact" onClick={(e) => { e.preventDefault(); navigate("/contact"); }}>Contact</a></li>
            </ul>
            <div className={styles.navButtons}>
              <button className={styles.signupBtn} onClick={openSignupModal}>Sign Up</button>
              <button className={styles.loginBtn} onClick={openLoginModal}>Login</button>
            </div>
          </nav>

          <main className={styles.hero}>
            <div className={styles.heroContent}>
              <h1>Revolutionize your<br />consultant matching</h1>
              <p>AI-powered platform that intelligently connects consultants with the right projects, offline and securely.</p>
              <div className={styles.inputGroup}>
                <button className={styles.getStarted} onClick={goToDashboard}>Get Started</button>
              </div>
            </div>

            <div className={styles.heroImage}>
              <div className={styles.ellipse1250}></div>
              <img src={robotImage} alt="AI Robot" />
              <div className={styles.ellipse1249}></div>
            </div>
          </main>
        </div>
      </div>

      {isContentBlurred && (
        <div className={styles.overlay} onClick={closeAllModals}></div>
      )}

      {showLoginModal && (
        <div className={styles.modal}>
          <h2>Welcome Back</h2>
          <form onSubmit={(e) => { e.preventDefault(); goToDashboard(); }}>
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
          <form onSubmit={(e) => { e.preventDefault(); goToDashboard(); }}>
            <input type="text" placeholder="Full Name" required />
            <input type="email" placeholder="Email" required />
            <input type="password" placeholder="Password" required />
            <button type="submit">Sign Up</button>
            <p>Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); switchToLogin(); }}>Login</a></p>
          </form>
        </div>
      )}

      {showGetStartedModal && (
        <div className={styles.modal}>
          <h2>Choose an Option</h2>
          <div className={styles.optionContainer}>
            <div className={styles.optionBox} onClick={openUploadDocModal}>
              📄 Upload Document
            </div>
            <div className={styles.optionBox} onClick={openUploadCvModal}>
              📑 Upload CV
            </div>
            <div className={styles.optionBox} onClick={goToDashboard}>
              🚀 Go to Dashboard
            </div>
          </div>
        </div>
      )}

      {showUploadDocModal && (
        <div className={styles.modal} id={styles.uploadDocModal}>
          <section className={styles.uploadCard}>
            <h2>📄 Upload Project Document</h2>
            <label
              htmlFor="fileInput"
              className={`${styles.uploadArea} ${isDragging ? styles.dragging : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <span>+ Drop or Click to Upload (PDF/DOCX)</span>
              <input
                type="file"
                id="fileInput"
                accept=".pdf,.doc,.docx"
                hidden
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </label>
            <button className={styles.btnPurple} onClick={processFile}>
              Upload Document
            </button>
          </section>
        </div>
      )}

      {showUploadCvModal && (
        <div className={styles.modal} id={styles.uploadCvModal}>
          <section className={styles.uploadCard}>
            <h2>📑 Upload Your CV</h2>
            <label 
              htmlFor="cvInput" 
              className={styles.uploadArea}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <span>+ Drop or Click to Upload (PDF/DOCX)</span>
              <input
                type="file"
                id="cvInput"
                accept=".pdf,.doc,.docx"
                hidden
                ref={cvInputRef}
                onChange={handleFileChange}
              />
            </label>
            <button className={styles.btnPurple} onClick={processCV}>
              Upload CV
            </button>
          </section>
        </div>
      )}

      {showSpinnerModal && (
        <div className={styles.spinnerBackdrop}>
          <div className={styles.spinnerContainer}>
            <div className={styles.spinner}></div>
            <p>Please wait while we process your document...</p>
          </div>
        </div>
      )}
    </>
  );
}

export default Home;
