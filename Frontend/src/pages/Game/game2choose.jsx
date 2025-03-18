import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import React from "react";

export default function Game2choose() {
  const navigate = useNavigate();

  const levels = [
    { name: "Easy", color: "bg-green-500", route: "/game2/3" },
    { name: "Medium", color: "bg-yellow-500", route: "/game2/5" },
    { name: "Hard", color: "bg-red-500", route: "/game2/7" },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-r from-purple-800 to-black text-white justify-center">
   
      <h1 className="text-4xl font-extrabold">Choose Your Level</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 items-center mt-10 sm:mt-20 justify-center">
        {levels.map((level, index) => (
          <motion.button
            key={index}
            className={`${level.color} px-8 py-4 text-2xl font-bold rounded-lg shadow-lg hover:scale-110 transition transform duration-300`}
            onClick={() => navigate(level.route)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            {level.name}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
