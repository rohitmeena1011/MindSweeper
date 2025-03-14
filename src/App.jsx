
import './App.css'
import React from 'react';
import AuthForm from './pages/Auth/Auth';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from './pages/Dashboard/dashboard';
import Leaderboard from './pages/Leaderboard/leaderboard';
import game1 from './pages/Game/game1';
import game2 from './pages/Game/game2';
function App() {
  return (
    <>
  <Router>
    <Routes>
      <Route path="/" element={<Dashboard/>} />
      <Route path="/login" element={<AuthForm />} />
  
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/game1" element={<game1/>} />
      <Route path="/game2" element={<game2 />} />
   </Routes>

    </Router>
    </>
  )
}

export default App
