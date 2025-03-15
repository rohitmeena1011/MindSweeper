import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './Auth.module.css';

const AuthForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('authToken', data.token);
      navigate('/');
    } else {
      console.error('Authentication failed');
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.background}>
        <div className={styles.shape}></div>
        <div className={styles.shape}></div>
      </div>
      <motion.div
        className={styles.authBox}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className={styles.authTitle}>{isSignUp ? 'Sign Up' : 'Login'}</h2>
        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <div className={styles.inputContainer}>
              <span>👤</span>
              <input type="text" placeholder="Username" />
            </div>
          )}
          <div className={styles.inputContainer}>
            <span>📧</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
          </div>
          <div className={styles.inputContainer}>
            <span>🔒</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </div>
          {isSignUp && (
            <div className={styles.inputContainer}>
              <span>🔒</span>
              <input type="password" placeholder="Confirm Password" />
            </div>
          )}
          <motion.button whileHover={{ scale: 1.05 }} className={styles.authButton}>
            {isSignUp ? 'Sign Up' : 'Login'}
          </motion.button>
        </form>
        <div className={styles.authFooter}>
          <button>Forgot Password?</button>
          <button onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? 'Login Instead' : 'Sign Up Instead'}
          </button> 
        </div>
      </motion.div>
    </div>
  );
};

export default AuthForm;
