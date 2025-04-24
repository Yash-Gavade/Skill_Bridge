import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Signup.module.css';

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // For demo purposes, always succeed
      setIsLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authHeader}>
        <h1>Skill Bridge</h1>
        <p>Create your account to get started</p>
      </div>
      
      {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
      
      <form onSubmit={handleSubmit} className={styles.authForm}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Full Name</label>
          <input 
            type="text" 
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Yash Gavade" 
            required 
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="email">Email Address</label>
          <input 
            type="email" 
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com" 
            required 
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="password">Password</label>
          <input 
            type="password" 
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••" 
            required 
          />
        </div>
        
        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? "Creating Account..." : "Sign Up"}
        </button>
        
        <p className={styles.toggleLink}>
          Already have an account? 
          <span onClick={handleLoginRedirect} className={styles.linkText}>
            Login
          </span>
        </p>
      </form>
    </div>
  );
}

export default Signup; 