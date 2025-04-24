import { useState } from 'react';
import styles from './Contact.module.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(formData);
    // Reset form or show success message
  };

  return (
    <section className={styles.contactSection}>
      <div className={styles.contactText}>
        <h2>Contact Us</h2>
        <p>
          We would love to hear from you! Whether you have a question or want to share feedback, 
          feel free to reach out. Our team is here to help you.
        </p>
      </div>

      <div className={styles.contactForm}>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputBlock}>
            <label htmlFor="name">Full Name:</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              placeholder="Your Name" 
              required 
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className={styles.inputBlock}>
            <label htmlFor="email">Email Address:</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              placeholder="Your Email" 
              required 
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className={styles.inputBlock}>
            <label htmlFor="subject">Subject:</label>
            <input 
              type="text" 
              id="subject" 
              name="subject" 
              placeholder="Subject" 
              required 
              value={formData.subject}
              onChange={handleChange}
            />
          </div>

          <div className={`${styles.inputBlock} ${styles.fullWidth}`}>
            <label htmlFor="message">Message:</label>
            <textarea 
              id="message" 
              name="message" 
              rows={5} 
              placeholder="Your Message" 
              required
              value={formData.message}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className={styles.buttonWrapper}>
            <button type="submit" className={styles.ctaButton}>Send Message</button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Contact;
