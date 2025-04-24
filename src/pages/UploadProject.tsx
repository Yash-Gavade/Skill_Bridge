import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './UploadProject.module.css';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

function UploadProject() {
  const navigate = useNavigate();

  // State for form data
  const [projectName, setProjectName] = useState('');
  const [projectDuration, setProjectDuration] = useState('');
  const [totalConsultants, setTotalConsultants] = useState('');
  
  // State for team composition inputs
  const [teamComposition, setTeamComposition] = useState({
    ba: '',
    dev: '',
    qa: '',
    pm: '',
    ux: ''
  });

  // State for consultants inputs
  const [consultants, setConsultants] = useState({
    ba: '',
    dev: '',
    qa: '',
    pm: '',
    ux: ''
  });

  // State for chatbot
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([
    { sender: 'bot', text: 'Hi there! How can I assist you today?' }
  ]);
  const [userInput, setUserInput] = useState('');
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const userInputRef = useRef<HTMLInputElement>(null);

  // State for spinner modal
  const [showSpinner, setShowSpinner] = useState(false);

  // Update team composition
  const handleTeamChange = (role: keyof typeof teamComposition, value: string) => {
    setTeamComposition(prev => ({
      ...prev,
      [role]: value
    }));
  };

  // Update consultants
  const handleConsultantChange = (role: keyof typeof consultants, value: string) => {
    setConsultants(prev => ({
      ...prev,
      [role]: value
    }));
  };

  // Clear form data
  const clearForm = () => {
    setProjectName('');
    setProjectDuration('');
    setTotalConsultants('');
    setTeamComposition({
      ba: '',
      dev: '',
      qa: '',
      pm: '',
      ux: ''
    });
    setConsultants({
      ba: '',
      dev: '',
      qa: '',
      pm: '',
      ux: ''
    });
  };

  // Go to match page
  const goToNext = () => {
    setShowSpinner(true);
    
    setTimeout(() => {
      setShowSpinner(false);
      navigate('/match');
    }, 2000);
  };

  // Toggle chatbot visibility
  const toggleChatbot = () => {
    setShowChatbot(!showChatbot);
    if (!showChatbot && userInputRef.current) {
      setTimeout(() => {
        userInputRef.current?.focus();
      }, 100);
    }
  };

  // Send message in chatbot
  const sendMessage = () => {
    if (userInput.trim()) {
      const newMessage: Message = { sender: 'user', text: userInput };
      setChatMessages(prev => [...prev, newMessage]);
      setUserInput('');
      
      // Simulate bot response after a short delay
      setTimeout(() => {
        respondToMessage(userInput);
      }, 800);
    }
  };

  // Handle Enter key in chatbot input
  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  // Process and respond to user messages
  const respondToMessage = (message: string) => {
    let response = '';
    
    // Simple greeting response
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      response = 'Hello! I am DreamBot, your virtual assistant. How can I help you today?';
      
      // Add response to chat
      setChatMessages(prev => [...prev, { sender: 'bot', text: response }]);
      
      // Add suggested pages after a delay
      setTimeout(() => {
        setChatMessages(prev => [
          ...prev, 
          { sender: 'bot', text: 'Here are some pages you can visit:' },
          { sender: 'bot', text: '<a href="/" onClick="event.preventDefault(); window.location.href=\'/\'">1. Home</a>' },
          { sender: 'bot', text: '<a href="/about" onClick="event.preventDefault(); window.location.href=\'/about\'">2. About</a>' },
          { sender: 'bot', text: '<a href="/contact" onClick="event.preventDefault(); window.location.href=\'/contact\'">3. Contact</a>' },
          { sender: 'bot', text: '<a href="/profiles" onClick="event.preventDefault(); window.location.href=\'/profiles\'">4. Profiles</a>' },
          { sender: 'bot', text: '<a href="/profiles-details" onClick="event.preventDefault(); window.location.href=\'/profiles-details\'">5. Project Details</a>' }
        ]);
      }, 1000);
    } else {
      // Default response for non-greetings
      response = "I'm just a demo bot! 😊";
      setChatMessages(prev => [...prev, { sender: 'bot', text: response }]);
    }
  };

  // Auto-scroll chat to bottom when messages change
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [chatMessages]);

  return (
    <div className={styles.container}>
      {/* Navbar */}
      <header className={styles.navbar}>
        <div className={styles.logo}>
          <a 
            href="/" 
            onClick={(e) => { e.preventDefault(); navigate('/'); }}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            Skill Bridge
          </a>
        </div>
        <nav className={styles.navLinks}>
          <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Home</a>
          <a href="/about" onClick={(e) => { e.preventDefault(); navigate('/about'); }}>About</a>
          <a href="/contact" onClick={(e) => { e.preventDefault(); navigate('/contact'); }}>Contact</a>
          <a href="/profiles" onClick={(e) => { e.preventDefault(); navigate('/profiles'); }}>Profiles</a>
          <a href="/profiles-details" onClick={(e) => { e.preventDefault(); navigate('/profiles-details'); }}>Project Details</a>
        </nav>
      </header>

      {/* Main Grid */}
      <main className={styles.matchWrapper}>
        {/* Right: Summary Panel */}
        <section className={styles.matchesCard}>
          <div className={styles.matchHeader}>
            <h2>Summary of the Document</h2>
            <button className={styles.btnOutline} onClick={clearForm}>Clear Details</button>
          </div>

          <div className={styles.customForm}>
            <div className={styles.formGroup}>
              <label htmlFor="projectName">Project Name:</label>
              <input
                type="text"
                id="projectName"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter Project Name"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="projectDuration">Duration of Project:</label>
              <input
                type="text"
                id="projectDuration"
                value={projectDuration}
                onChange={(e) => setProjectDuration(e.target.value)}
                placeholder="Enter Duration of Project"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="totalConsultants">Total Consultants:</label>
              <input
                type="text"
                id="totalConsultants"
                value={totalConsultants}
                onChange={(e) => setTotalConsultants(e.target.value)}
                placeholder="Enter Total Number of Consultants"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="teamComposition">Team Composition:</label>
              <div className={styles.circleContainer}>
                <div className={styles.circleItem}>
                  <div className={styles.circle}>
                    <img src="https://i.pravatar.cc/50?img=1" alt="BA Avatar" className={styles.circleImg} />
                  </div>
                  <div className={styles.circleLabel}>Business Analyst</div>
                  <input 
                    type="text" 
                    className={styles.teamLabelT} 
                    value={teamComposition.ba}
                    onChange={(e) => handleTeamChange('ba', e.target.value)}
                    placeholder=""
                  />
                </div>
                <div className={styles.circleItem}>
                  <div className={styles.circle}>
                    <img src="https://i.pravatar.cc/50?img=2" alt="Dev Avatar" className={styles.circleImg} />
                  </div>
                  <div className={styles.circleLabel}>Developer</div>
                  <input 
                    type="text" 
                    className={styles.teamLabelT} 
                    value={teamComposition.dev}
                    onChange={(e) => handleTeamChange('dev', e.target.value)}
                    placeholder="DEV details"
                  />
                </div>
                <div className={styles.circleItem}>
                  <div className={styles.circle}>
                    <img src="https://i.pravatar.cc/50?img=3" alt="QA Avatar" className={styles.circleImg} />
                  </div>
                  <div className={styles.circleLabel}>Quality Analyst</div>
                  <input 
                    type="text" 
                    className={styles.teamLabelT} 
                    value={teamComposition.qa}
                    onChange={(e) => handleTeamChange('qa', e.target.value)}
                    placeholder="QA details"
                  />
                </div>
                <div className={styles.circleItem}>
                  <div className={styles.circle}>
                    <img src="https://i.pravatar.cc/50?img=4" alt="PM Avatar" className={styles.circleImg} />
                  </div>
                  <div className={styles.circleLabel}>Project Manager</div>
                  <input 
                    type="text" 
                    className={styles.teamLabelT} 
                    value={teamComposition.pm}
                    onChange={(e) => handleTeamChange('pm', e.target.value)}
                    placeholder="PM details"
                  />
                </div>
                <div className={styles.circleItem}>
                  <div className={styles.circle}>
                    <img src="https://i.pravatar.cc/50?img=5" alt="UX Avatar" className={styles.circleImg} />
                  </div>
                  <div className={styles.circleLabel}>UX</div>
                  <input 
                    type="text" 
                    className={styles.teamLabelT}
                    value={teamComposition.ux}
                    onChange={(e) => handleTeamChange('ux', e.target.value)}
                    placeholder="UX details"
                  />
                </div>
              </div>
            </div>

            {/* Consultants with Vertical Circles and Images */}
            <div className={styles.formGroup}>
              <label htmlFor="consultants">Consultants:</label>
              <div className={`${styles.circleContainer} ${styles.vertical}`}>
                <div className={styles.circleItemC}>
                  <div className={styles.circleC}>
                    <img src="https://i.pravatar.cc/50?img=6" alt="BA Avatar" className={styles.circleImg} />
                  </div>
                  <div className={styles.circleLabelC}>BA</div>
                  <input 
                    type="text" 
                    className={styles.teamLabelC} 
                    value={consultants.ba}
                    onChange={(e) => handleConsultantChange('ba', e.target.value)}
                    placeholder="Enter BA details"
                  />
                </div>
                <div className={styles.circleItemC}>
                  <div className={styles.circleC}>
                    <img src="https://i.pravatar.cc/50?img=7" alt="Dev Avatar" className={styles.circleImg} />
                  </div>
                  <div className={styles.circleLabelC}>Dev</div>
                  <input 
                    type="text" 
                    className={styles.teamLabelC}
                    value={consultants.dev}
                    onChange={(e) => handleConsultantChange('dev', e.target.value)}
                    placeholder="Enter DEV details"
                  />
                </div>
                <div className={styles.circleItemC}>
                  <div className={styles.circleC}>
                    <img src="https://i.pravatar.cc/50?img=8" alt="QA Avatar" className={styles.circleImg} />
                  </div>
                  <div className={styles.circleLabelC}>QA</div>
                  <input 
                    type="text" 
                    className={styles.teamLabelC} 
                    value={consultants.qa}
                    onChange={(e) => handleConsultantChange('qa', e.target.value)}
                    placeholder="Enter QA details"
                  />
                </div>
                <div className={styles.circleItemC}>
                  <div className={styles.circleC}>
                    <img src="https://i.pravatar.cc/50?img=9" alt="PM Avatar" className={styles.circleImg} />
                  </div>
                  <div className={styles.circleLabelC}>PM</div>
                  <input 
                    type="text" 
                    className={styles.teamLabelC} 
                    value={consultants.pm}
                    onChange={(e) => handleConsultantChange('pm', e.target.value)}
                    placeholder="Enter PM details"
                  />
                </div>
                <div className={styles.circleItemC}>
                  <div className={styles.circleC}>
                    <img src="https://i.pravatar.cc/50?img=10" alt="UX Avatar" className={styles.circleImg} />
                  </div>
                  <div className={styles.circleLabelC}>UX</div>
                  <input 
                    type="text" 
                    className={styles.teamLabelC} 
                    value={consultants.ux}
                    onChange={(e) => handleConsultantChange('ux', e.target.value)}
                    placeholder="Enter UX details"
                  />
                </div>
              </div>
            </div>
            
            {/* Green Button Centered Below Both Containers */}
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <button className={styles.btnGreen} onClick={goToNext}>Next</button>
            </div>
          </div>
        </section>
      </main>

      {/* Spinner Modal */}
      {showSpinner && (
        <div className={styles.spinnerBackdrop}>
          <div className={styles.spinnerContainer}>
            <div className={styles.spinner}></div>
            <p>Please wait while we process your document...</p>
          </div>
        </div>
      )}

      {/* Chatbot Toggle Icon */}
      <div className={styles.chatIcon} onClick={toggleChatbot}>💬</div>

      {/* Chatbot Window */}
      {showChatbot && (
        <div className={styles.chatbotBox}>
          {/* Chatbot Header */}
          <div className={styles.chatbotHeader}>
            <span className={styles.chatbotTitle}>
              <img 
                src="https://i.pravatar.cc/150?img=2" 
                alt="Bot" 
                className={styles.chatbotAvatar}
              />
              DreamBot
            </span>
            <button onClick={toggleChatbot} className={styles.chatbotCloseBtn}>✖</button>
          </div>

          {/* Chatbot Messages */}
          <div className={styles.chatbotMessages} ref={chatMessagesRef}>
            {chatMessages.map((msg, index) => (
              <div 
                key={index} 
                className={msg.sender === 'user' ? styles.userMessage : styles.botMessage}
                dangerouslySetInnerHTML={{ __html: msg.text }}
              ></div>
            ))}
          </div>

          {/* Chatbot Input */}
          <div className={styles.chatbotInput}>
            <input
              type="text"
              ref={userInputRef}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Type a message..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UploadProject; 