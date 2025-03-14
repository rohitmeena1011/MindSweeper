import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";
import Score from "./score";
import bg from "/assets/bg.jpg";
import "../../index.css";
import "./Leaderboard.css";

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true); 
  const testData = [
    { name: "Alice", points: 1500, avatar: "avatar1.png" },
    { name: "Bob", points: 1200, avatar: "avatar2.png" },
    { name: "Charlie", points: 1000, avatar: "avatar3.png" },
    { name: "David", points: 900, avatar: "avatar4.png" },
    { name: "Eve", points: 800, avatar: "avatar5.png" },
  ];

  useEffect(() => {
    setTimeout(() => {
      setLeaderboard(testData);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div
      className="bg-dark-blue min-h-screen flex flex-col relative"
      style={{
        height: "88vh",
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        position: "sticky",
      }}
    >
      <div className="overlay-background"></div>
     
        <div className="leaderboardItems">
          <h1 className="leaderboardHeader" data-text="Leaderboard">
            Leaderboard
          </h1>

          {loading ? (
            <div className="loader">
              <TailSpin
                visible={true}
                height="135"
                width="135"
                ariaLabel="loading"
                wrapperClass="spinner"
                color="#00BFFF"
              />
            </div>
          ) : leaderboard.length ? (
            leaderboard.map((elem, index) => (
              <Score
                className={`score ${
                  index === 0
                    ? "first-place"
                    : index === 1
                    ? "second-place"
                    : index === 2
                    ? "third-place"
                    : ""
                }`}
                name={elem.name}
                score={elem.points}
                avatar={elem.avatar}
                rank={index + 1}
                key={index}
              />
            ))
          ) : (
            <p className="no-data">No data available</p>
          )}
        </div>
      </div>
  );
};

export default Leaderboard;