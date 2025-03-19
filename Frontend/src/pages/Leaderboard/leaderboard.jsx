// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { TailSpin } from "react-loader-spinner";
// import Score from "./score";
// import bg from "/assets/bg.jpg";
// import "../../index.css";
// import "./Leaderboard.css";

// const Leaderboard = () => {
//   const [leaderboard, setLeaderboard] = useState([]);
//   const [loading, setLoading] = useState(true); 
//   const testData = [
//     { name: "Alice", points: 1500},
//     { name: "Bob", points: 1200},
//     { name: "Charlie", points: 1000},
//     { name: "David", points: 900 },
//     { name: "Eve", points: 800},
//   ];

//   const getLeaderBoard = () =>{
//     fetch(`https://mindsweeper-api.onrender.com/api/leaderboard`)
//       .then(response => response.json())
//       .then(data => {
//         console.log(data)
//         setLeaderboard(data.leaderboard)})
//       .catch(err => console.error("Error fetching new game data:", err));
//   };

//   useEffect(() => {
//     setTimeout(() => {
//       getLeaderBoard();
//       setLoading(false);
//     }, 1000);
//   }, []);

//   return (
//     <div
//       className="bg-dark-blue min-h-screen flex flex-col relative"
//       style={{
//         height: "88vh",
//         backgroundImage: `url(${bg})`,
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//         backgroundRepeat: "no-repeat",
//         minHeight: "100vh",
//         position: "sticky",
//       }}
//     >
//       <div className="overlay-background"></div>
     
//         <div className="leaderboardItems">
//           <h1 className="leaderboardHeader" data-text="Leaderboard">
//             Leaderboard
//           </h1>

//           {loading ? (
//             <div className="loader">
//               <TailSpin
//                 visible={true}
//                 height="135"
//                 width="135"
//                 ariaLabel="loading"
//                 wrapperClass="spinner"
//                 color="#00BFFF"
//               />
//             </div>
//           ) : leaderboard.length ? (
//             leaderboard.map((elem, index) => (
//               <Score
//                 className={`score ${
//                   index === 0
//                     ? "first-place"
//                     : index === 1
//                     ? "second-place"
//                     : index === 2
//                     ? "third-place"
//                     : ""
//                 }`}
//                 name={elem.username}
//                 score={elem.points}
                
//                 rank={index + 1}
//                 key={index}
//               />
//             ))
//           ) : (
//             <p className="no-data">No data available</p>
//           )}
//         </div>
//       </div>
//   );
// };

// export default Leaderboard;


import React, { useEffect, useState } from "react";
import { TailSpin } from "react-loader-spinner";
import bg from "/assets/bg.jpg";
// Remove or adjust these imports if not needed:
// import "../../index.css";
// import "./Leaderboard.css";

const ITEMS_PER_PAGE = 5; // Number of items per page

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // ----- Pagination Helpers -----
  const totalItems = leaderboard.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPageData = leaderboard.slice(startIndex, endIndex);

  // ----- Fetch Leaderboard Data -----
  const getLeaderBoard = () => {
    fetch(`https://mindsweeper-api.onrender.com/api/leaderboard`)
      .then((response) => response.json())
      .then((data) => {
        // Expect data.leaderboard to be an array of { username, points }
        setLeaderboard(data.leaderboard);
      })
      .catch((err) => console.error("Error fetching leaderboard data:", err));
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      getLeaderBoard();
      setLoading(false);
    }, 1000);
  }, []);

  // ----- Pagination Handlers -----
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "relative",
      }}
    >
      {/* Optional overlay if you want to darken or color-tint the background */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.6)",
        }}
      ></div>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "600px",
          margin: "0 auto",
          padding: "2rem",
          textAlign: "center",
          color: "#fff",
        }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: "bold",
            marginBottom: "1.5rem",
            textTransform: "uppercase",
            letterSpacing: "2px",
          }}
        >
          Leaderboard
        </h1>

        {loading ? (
          <div style={{ marginTop: "3rem" }}>
            <TailSpin
              visible={true}
              height="135"
              width="135"
              ariaLabel="loading"
              color="#00BFFF"
            />
          </div>
        ) : currentPageData.length ? (
          <>
            {/* Leaderboard List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {currentPageData.map((elem, index) => {
                // Overall rank in the entire list
                const overallRank = startIndex + index + 1;

                // Choose a border color or style for top ranks
                let rowBorder = "2px solid transparent";
                if (overallRank === 1) rowBorder = "2px solid gold";
                else if (overallRank === 2) rowBorder = "2px solid silver";
                else if (overallRank === 3) rowBorder = "2px solid #cd7f32"; // Bronze

                return (
                  <div
                    key={overallRank}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      border: rowBorder,
                      borderRadius: "6px",
                      padding: "0.75rem 1rem",
                      fontSize: "1.1rem",
                    }}
                  >
                    <span style={{ flex: "0 0 2rem", fontWeight: "bold" }}>
                      {overallRank}
                    </span>
                    <span style={{ flex: "1", textAlign: "center", fontWeight: 500 }}>
                      {elem.username}
                    </span>
                    <span style={{ flex: "0 0 6rem", textAlign: "right" }}>
                      {elem.points} pts
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "1rem",
                marginTop: "1rem",
              }}
            >
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                style={{
                  backgroundColor: "#1976d2",
                  color: "#fff",
                  border: "none",
                  padding: "0.5rem 1rem",
                  borderRadius: "4px",
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                  opacity: currentPage === 1 ? 0.5 : 1,
                }}
              >
                Previous
              </button>

              <span style={{ fontWeight: 500 }}>
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                style={{
                  backgroundColor: "#1976d2",
                  color: "#fff",
                  border: "none",
                  padding: "0.5rem 1rem",
                  borderRadius: "4px",
                  cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                  opacity: currentPage === totalPages ? 0.5 : 1,
                }}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <p style={{ marginTop: "2rem", fontSize: "1.2rem" }}>No data available</p>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;

