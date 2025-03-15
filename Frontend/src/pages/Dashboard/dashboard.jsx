import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken"); 
    setIsAuthenticated(!!token); 
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleGameClick = (path) => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      navigate(path);
    }
  };

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col">
      {/* Navbar */}
      <nav className="bg-gray-800 p-4 flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-bold text-blue-400">MindSweeper</h1>
        <Link to="/leaderboard" className="text-lg text-gray-300 hover:text-white">
          Leaderboard
        </Link>
        <Link to="/login" className="text-lg text-gray-300 hover:text-white">
          Login
        </Link>
      </nav>

      {/* Main Section */}
      <div className="flex flex-col items-center justify-center flex-grow gap-8">
        <button
          onClick={() => handleGameClick("/game1")}
          className="w-64 h-24 flex items-center justify-center text-2xl font-bold text-white bg-blue-500 rounded-2xl shadow-xl uppercase transform transition-all duration-300 hover:scale-110 hover:bg-blue-700"
        >
          Game 1
        </button>
        <button
          onClick={() => handleGameClick("/game2")}
          className="w-64 h-24 flex items-center justify-center bg-red-500 rounded-2xl shadow-lg text-white font-bold text-2xl uppercase tracking-wider transition-all transform hover:scale-110 hover:bg-red-700"
        >
          Game 2
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
