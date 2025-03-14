
import './App.css'
import React from 'react';
import AuthForm from './pages/Auth/Auth';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from './pages/Dashboard/dashboard';
import Leaderboard from './pages/Leaderboard/leaderboard';
function App() {
  return (
    <>
  <Router>
    <Routes>
      <Route path="/" element={<AuthForm />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
   </Routes>

    </Router>
    </>
  )
}

export default App
