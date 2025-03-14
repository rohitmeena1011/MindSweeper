import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import styles from "./Auth.module.css";

const AuthForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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
    <div className="flex justify-center items-center h-screen bg-black">
      <motion.div
        className="relative w-96 p-8 rounded-xl bg-opacity-10 bg-gray-800 text-white border border-gray-700 shadow-lg"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-center text-3xl font-bold mb-6 text-blue-400">
          {isSignUp ? "Sign Up" : "Login"}
        </h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {isSignUp && (
            <div className="flex items-center gap-2 border-b border-gray-600 pb-2">
              <span className="text-blue-400">👤</span>
              <input
                type="text"
                placeholder="Username"
                className={styles.inputField}
              />
            </div>
          )}
          <div className="flex items-center gap-2 border-b border-gray-600 pb-2">
            <span className="text-blue-400">📧</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className={styles.inputField}
            />
          </div>
          <div className="flex items-center gap-2 border-b border-gray-600 pb-2">
            <span className="text-blue-400">🔒</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className={styles.inputField}
            />
          </div>
          {isSignUp && (
            <div className="flex items-center gap-2 border-b border-gray-600 pb-2">
              <span className="text-blue-400">🔒</span>
              <input
                type="password"
                placeholder="Confirm Password"
                className={styles.inputField}
              />
            </div>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="mt-4 py-2 bg-blue-500 rounded-lg text-lg font-semibold hover:bg-blue-600 transition"
          >
            {isSignUp ? "Sign Up" : "Login"}
          </motion.button>
        </form>
        <div className="flex justify-between mt-4 text-sm">
          <button className="text-gray-400 hover:underline">Forgot Password?</button>
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-400 hover:underline"
          >
            {isSignUp ? "Login Instead" : "Sign Up Instead"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthForm;

