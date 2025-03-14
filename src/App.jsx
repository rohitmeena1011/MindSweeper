
import './App.css'
import React from 'react';
import AuthForm from './pages/Auth/Auth';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
function App() {
  return (
    <>
  <Router>
    <Routes>
      <Route path="/" element={<AuthForm />} />
   </Routes>

    </Router>
    </>
  )
}

export default App
