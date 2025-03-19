import React from "react";
import "./Score.css";

const Score = ({ rank, name, score, className }) => (
  <div className={`score ${className}`}>
    <div className="score-rank">{rank}</div>
    <div className="score-name">{name}</div>
    <div className="score-points">{score} pts</div>
  </div>
);

export default Score;
