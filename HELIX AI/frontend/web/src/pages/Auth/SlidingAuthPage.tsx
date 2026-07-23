import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Orb from '../../components/magicui/Orb';
import { useEmotion } from '../../context/EmotionContext';
import { API_BASE_URL } from '../../utils/api_config';


const HelpLink = styled.div`
  margin-top: 20px;
  font-size: 13px;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.3s;
  text-decoration: underline;

  &:hover {
    color: #ffffff;
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  }
`;

const SlidingAuthPage: React.FC = () => {
   const [isRightPanelActive, setIsRightPanelActive] = useState(false);
   const [loading, setLoading] = useState(false);
   const navigate = useNavigate();
   const { refreshUser } = useEmotion();

   // Register State
   const [regName, setRegName] = useState('');
   const [regEmail, setRegEmail] = useState('');
   const [regPassword, setRegPassword] = useState('');

   // Login State
   const [loginEmail, setLoginEmail] = useState('');
   const [loginPassword, setLoginPassword] = useState('');

   const handleRegister = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      try {
         const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
               full_name: regName,
               email: regEmail,
               password: regPassword
            })
         });

         if (response.ok) {
            const data = await response.json();
            // Transform user object into session format if needed
            const sessionData = {
               user_id: String(data.id),
               full_name: data.full_name,
               email: data.email
            };
            localStorage.setItem('user', JSON.stringify(sessionData));
            refreshUser();
            navigate('/chat');
         } else {
            const data = await response.json();
            alert(data.detail || "Registration failed");
         }
      } catch (error) {
         console.error(error);
         alert("Error connecting to server");
      } finally {
         setLoading(false);
      }
   };

   const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      try {
         const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
               email: loginEmail,
               password: loginPassword
            })
         });

         if (response.ok) {
            const data = await response.json();
            localStorage.setItem('user', JSON.stringify(data));
            refreshUser();
            navigate('/chat');
         } else {
            const data = await response.json();
            alert(data.detail || "Login failed");
         }
      } catch (error) {
         console.error(error);
         alert("Error connecting to server");
      } finally {
         setLoading(false);
      }
   };

   const handleGuestMode = () => {
      const guestUser = {
         user_id: `guest_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
         full_name: 'Guest User',
         email: 'guest@healix.ai',
         is_guest: true
      };
      localStorage.setItem('user', JSON.stringify(guestUser));
      refreshUser();
      navigate('/chat');
   };

   return (
      <Container>
         <div className="background">
            <Orb hue={260} hoverIntensity={0.5} />
         </div>

         <div className={`container ${isRightPanelActive ? 'right-panel-active' : ''}`} id="container">
            {/* Sign Up Form */}
            <div className="form-container sign-up-container">
               <form onSubmit={handleRegister}>
                  <h3>Sign Up</h3>
                  <div className="subtitle">Join Healix AI Today</div>

                  <label>Full Name</label>
                  <input
                     type="text"
                     placeholder="Name"
                     value={regName}
                     onChange={(e) => setRegName(e.target.value)}
                     required
                  />

                  <label>Email</label>
                  <input
                     type="email"
                     placeholder="Email"
                     value={regEmail}
                     onChange={(e) => setRegEmail(e.target.value)}
                     required
                  />

                  <label>Password</label>
                  <input
                     type="password"
                     placeholder="Password"
                     value={regPassword}
                     onChange={(e) => setRegPassword(e.target.value)}
                     required
                  />

                  <button type="submit" disabled={loading}>
                     {loading ? 'Processing...' : 'Sign Up'}
                  </button>

                  <HelpLink onClick={handleGuestMode} style={{ color: '#000000', fontWeight: 800 }}>
                     Anonymous Usage? Continue as Guest
                  </HelpLink>

                  <HelpLink onClick={() => navigate('/help')} style={{ color: '#000000' }}>
                     Need help? Contact support
                  </HelpLink>
               </form>
            </div>

            {/* Login Form */}
            <div className="form-container sign-in-container">
               <form onSubmit={handleLogin}>
                  <h3>Login Here</h3>
                  <div className="subtitle">Welcome back to Healix AI</div>

                  <label>Username</label>
                  <input
                     type="email"
                     placeholder="Email or Phone"
                     value={loginEmail}
                     onChange={(e) => setLoginEmail(e.target.value)}
                     required
                  />

                  <label>Password</label>
                  <input
                     type="password"
                     placeholder="Password"
                     value={loginPassword}
                     onChange={(e) => setLoginPassword(e.target.value)}
                     required
                  />

                  <button type="submit" disabled={loading}>
                     {loading ? 'Processing...' : 'Log In'}
                  </button>

                  <HelpLink onClick={handleGuestMode} style={{ color: '#000000', fontWeight: 800 }}>
                     Anonymous Usage? Continue as Guest
                  </HelpLink>

                  <HelpLink onClick={() => navigate('/help')} style={{ color: '#000000' }}>
                     Need help? Contact support
                  </HelpLink>
               </form>
            </div>

            {/* Overlay Panels */}
            <div className="overlay-container">
               <div className="overlay">
                  <div className="overlay-panel overlay-left">
                     <h3>Already with us?</h3>
                     <p>Continue your wellness journey by signing in.</p>
                     <button className="ghost" onClick={() => setIsRightPanelActive(false)}>Sign In</button>
                  </div>
                  <div className="overlay-panel overlay-right">
                     <h3>Hello, Soul!</h3>
                     <p>Start your path to mental clarity and support today.</p>
                     <button className="ghost" onClick={() => setIsRightPanelActive(true)}>Sign Up</button>
                  </div>
               </div>
            </div>
         </div>

         {/* Developer Credits Footer */}
         <div className="developer-credits" style={{
            position: 'absolute',
            bottom: '20px',
            textAlign: 'center',
            width: '100%',
            color: '#000000',
            zIndex: 10
         }}>
            <p style={{
               fontFamily: "'MonteCarlo', cursive",
               fontSize: '24px',
               margin: 0,
               fontWeight: 'bold'
            }}>
               Project developed by Ezhil Arasi, Nivetha, Sarathi
            </p>
         </div>
      </Container>
   );
};

const Container = styled.div`
  min-height: 100vh;
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Poppins', sans-serif;
  overflow: hidden;
  position: relative;

  .background {
    width: 600px;
    height: 600px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 0;
  }

  .container {
    background: #ffffff;
    border-radius: 12px;
    backdrop-filter: blur(20px);
    border: 2px solid #000000;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
    position: relative;
    overflow: hidden;
    width: 850px;
    max-width: 95%;
    min-height: 580px;
    z-index: 10;
  }

  h3 {
    font-size: 32px;
    font-weight: 700;
    line-height: 42px;
    text-align: center;
    color: #000000;
    margin-bottom: 5px;
  }

  p {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    letter-spacing: 0.5px;
    margin: 20px 0 30px;
    color: #000000;
  }

  .subtitle {
    font-size: 14px;
    color: #000000;
    text-align: center;
    margin-bottom: 10px;
    font-weight: 500;
  }

  label {
    display: block;
    margin-top: 15px;
    font-size: 16px;
    font-weight: 600;
    color: #000000;
    text-align: left;
    width: 100%;
  }

  input {
    display: block;
    height: 45px;
    width: 100%;
    background-color: #ffffff;
    border-radius: 8px;
    padding: 0 15px;
    margin-top: 8px;
    font-size: 14px;
    font-weight: 500;
    color: #000000;
    border: 1.5px solid #000000;
    outline: none;
    transition: all 0.2s;

    &::placeholder {
      color: #666666;
    }

    &:focus {
      border-color: #000000;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    }
  }

  button {
    margin-top: 30px;
    width: 100%;
    background-color: #000000;
    color: #ffffff;
    padding: 14px 0;
    font-size: 18px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
    border: 2px solid #000000;
    outline: none;

    &:hover {
      background-color: #e5e5e5;
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }

  button.ghost {
    background: transparent;
    border: 1px solid #ffffff;
    color: #ffffff;
    margin-top: 10px;
    
    &:hover {
      background: rgba(0, 0, 0, 0.08);
    }
  }

  .social {
    display: none;
  }

  form {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 40px 35px;
    height: 100%;
    text-align: center;
  }

  .form-container {
    position: absolute;
    top: 0;
    height: 100%;
    transition: all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    z-index: 10;
  }

  .sign-in-container {
    left: 0;
    width: 50%;
    z-index: 2;
  }

  .container.right-panel-active .sign-in-container {
    transform: translateX(100%);
    opacity: 0;
  }

  .sign-up-container {
    left: 0;
    width: 50%;
    opacity: 0;
    z-index: 1;
  }

  .container.right-panel-active .sign-up-container {
    transform: translateX(100%);
    opacity: 1;
    z-index: 5;
    animation: show 0.6s;
  }

  @keyframes show {
    0%, 49.99% { opacity: 0; z-index: 1; }
    50%, 100% { opacity: 1; z-index: 5; }
  }

  .overlay-container {
    position: absolute;
    top: 0;
    left: 50%;
    width: 50%;
    height: 100%;
    overflow: hidden;
    transition: transform 0.6s ease-in-out;
    z-index: 100;
  }

  .container.right-panel-active .overlay-container {
    transform: translateX(-100%);
  }

  .overlay {
    background: linear-gradient(135deg, #00d2ff 0%, #ff007f 100%);
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 0 0;
    color: #FFFFFF;
    position: relative;
    left: -100%;
    height: 100%;
    width: 200%;
    transform: translateX(0);
    transition: transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }

  .container.right-panel-active .overlay {
    transform: translateX(50%);
  }

  .overlay-panel {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 0 40px;
    text-align: center;
    top: 0;
    height: 100%;
    width: 50%;
    transform: translateX(0);
    transition: transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);

    h3, p {
      color: #ffffff;
    }
  }

  .overlay-left { transform: translateX(-20%); }
  .container.right-panel-active .overlay-left { transform: translateX(0); }

  .overlay-right { right: 0; transform: translateX(0); }
  .container.right-panel-active .overlay-right { transform: translateX(20%); }
`;

export default SlidingAuthPage;
