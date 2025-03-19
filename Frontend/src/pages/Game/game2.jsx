// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import CryptoJS from 'crypto-js';
// import axios from 'axios';

// // Utility function to reshuffle an array using Fisher-Yates.
// const shuffleArray = (array) => {
//   const newArray = [...array];
//   for (let i = newArray.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
//   }
//   return newArray;
// };

// const Game2 = () => {
//   const { length } = useParams();
//   const gameLength = parseInt(length) || 2;
  
//   const localStorageKey = `game2Data_${gameLength}`;

//   const [target, setTarget] = useState(null);
//   const [availableNumbers, setAvailableNumbers] = useState([]);
//   const [availableOperators, setAvailableOperators] = useState([]);
//   const [placedNodes, setPlacedNodes] = useState([]);
//   const [placedEdges, setPlacedEdges] = useState([]);
//   // Keep the original pools for resets.
//   const [initialNumbers, setInitialNumbers] = useState([]);
//   const [initialOperators, setInitialOperators] = useState([]);
//   const [message, setMessage] = useState('');
//   const [currGameId,setCurrGameId] = useState('');

//   const loadNewGame = () => {
//     fetch(`https://mindsweeper-api.onrender.com/api/generate-game?length=${gameLength}`)
//       .then(response => response.json())
//       .then(data => {
//         // API returns: { target, chosenNumbers, operatorPool }
  
//         // Shuffle the arrays
//         const initialNumbers = data.chosenNumbers;
//         const initialOperators = data.operatorPool;
//         const gameId = data.gameId;
//         let Numbers = initialNumbers;
//         let Operators = initialOperators;
  
//         // Select placed nodes and edges
//         const placedNodes = Array(Numbers.length).fill(null);
//         const placedEdges = Array(Operators.length).fill(null);
  
//         if(Numbers.length > 3){
//           // Set values at specific indices
//           placedNodes[1] = Numbers[1];
//           placedNodes[3] = Numbers[3];
//           placedEdges[2] = Operators[2];
        

//         if(Numbers.length > 5){
//           placedNodes[6] = Numbers[6];
//           placedEdges[4] = Operators[4];
//         }
  
//         // Remove the placed nodes and edges from the arrays
//         Numbers = Numbers.filter((_, index) => index !== 1 && index !== 3 && index !== 6);
//         Operators = Operators.filter((_, index) => index !== 2 && index !== 4);
//         }
  
//         // Update the state with the newly modified values
//         setTarget(data.target);
//         setAvailableNumbers(shuffleArray(Numbers)); // Updated list of numbers
//         setAvailableOperators(shuffleArray(Operators)); // Updated list of operators
//         setInitialNumbers(shuffleArray(Numbers));
//         setInitialOperators(shuffleArray(Operators));
//         setPlacedNodes(placedNodes);
//         setPlacedEdges(placedEdges);
//         setCurrGameId(gameId);
  
//         // Save to localStorage for persistence.
//         localStorage.setItem(localStorageKey, JSON.stringify({
//           target: data.target,
//           initialNumbers: initialNumbers,
//           initialOperators: initialOperators,
//           gameId: gameId
//         }));
  
//         setMessage('');
//       })
//       .catch(err => console.error("Error fetching new game data:", err));
//   };
  

//   useEffect(() => {
    
//     const savedData = localStorage.getItem(localStorageKey);
//     if (savedData) {
//       const parsed = JSON.parse(savedData);
//       let Numbers = parsed.initialNumbers;
//       let Operators = parsed.initialOperators;

//       // Select placed nodes and edges
//       const placedNodes = Array(Numbers.length).fill(null);
//       const placedEdges = Array(Operators.length).fill(null);

//       if(Numbers.length > 3){
//         // Set values at specific indices
//         placedNodes[1] = Numbers[1];
//         placedNodes[3] = Numbers[3];
//         placedEdges[2] = Operators[2];
      

//       if(Numbers.length > 5){
//         placedNodes[6] = Numbers[6];
//         placedEdges[4] = Operators[4];
//       }

//       // Remove the placed nodes and edges from the arrays
//       Numbers = Numbers.filter((_, index) => index !== 1 && index !== 3 && index !== 6);
//       Operators = Operators.filter((_, index) => index !== 2 && index !== 4);
//       }

//       // Update the state with the newly modified values
//       setTarget(parsed.target);
//       setAvailableNumbers(shuffleArray(Numbers)); // Updated list of numbers
//       setAvailableOperators(shuffleArray(Operators)); // Updated list of operators
//       setInitialNumbers(shuffleArray(Numbers));
//       setInitialOperators(shuffleArray(Operators));
//       setPlacedNodes(placedNodes);
//       setPlacedEdges(placedEdges);
//       setCurrGameId(parsed.gameId)
//     } else {
//       // Otherwise, fetch new game data.
//       loadNewGame();
//     }
//   }, [gameLength, localStorageKey]);

//   // Drag start: store item and type.
//   const onDragStart = (e, item, type) => {
//     e.dataTransfer.setData("text/plain", JSON.stringify({ item, type }));
//   };

//   // Allow dropping.
//   const allowDrop = (e) => {
//     e.preventDefault();
//   };

//   // Drop handler for number nodes.
//   const onDropNode = (e, index) => {
//     e.preventDefault();
//     const data = JSON.parse(e.dataTransfer.getData("text/plain"));
//     if (data.type !== "number" || placedNodes[index] !== null) return;
//     const newNodes = [...placedNodes];
//     newNodes[index] = data.item;
//     setPlacedNodes(newNodes);
//     // Remove only one occurrence.
//     setAvailableNumbers(prev => {
//       const i = prev.indexOf(data.item);
//       return i === -1 ? prev : [...prev.slice(0, i), ...prev.slice(i + 1)];
//     });
//     checkBoardComplete(newNodes, placedEdges);
//   };

//   // Drop handler for operator edges.
//   const onDropEdge = (e, index) => {
//     e.preventDefault();
//     const data = JSON.parse(e.dataTransfer.getData("text/plain"));
//     if (data.type !== "operator" || placedEdges[index] !== null) return;
//     const newEdges = [...placedEdges];
//     newEdges[index] = data.item;
//     setPlacedEdges(newEdges);
//     // Remove only one occurrence.
//     setAvailableOperators(prev => {
//       const i = prev.indexOf(data.item);
//       return i === -1 ? prev : [...prev.slice(0, i), ...prev.slice(i + 1)];
//     });
//     checkBoardComplete(placedNodes, newEdges);
//   };

//   // Compute the sequential result (left-to-right evaluation).
//   const computeResult = (nodes, edges) => {
//     if (nodes[0] === null) return null;
//     let result = parseInt(nodes[0]);
//     for (let i = 0; i < edges.length; i++) {
//       if (edges[i] === null || nodes[i + 1] === null) break;
//       const nextVal = parseInt(nodes[i + 1]);
//       const op = edges[i];
//       if (op === '+') result += nextVal;
//       else if (op === '-') result -= nextVal;
//       else if (op === '*') result *= nextVal;
//       else if (op === '/') result = Math.floor(result / nextVal);
//     }
//     return result;
//   };

//   const addPoints = () => {
//     const gameId = JSON.stringify(currGameId);
//     const secretKey = 'Z8yd9sfG9h1r3f9$jb0vXp!92mbR6hFz';
//     console.log(gameId)
  
//     const encryptedGameId = CryptoJS.AES.encrypt(gameId, secretKey).toString();
  
//     const email = localStorage.getItem('email');
  
//     axios.post('https://mindsweeper-api.onrender.com/api/update-points', {
//       encryptedGameId,
//       email_id: email,  
//       points: gameLength === 3 ? 2 : gameLength === 5 ? 5 : gameLength === 7 ? 10 : 0
//     })
//     .then(response => {
//       console.log('Points updated successfully:', response.data);
//     })
//     .catch(err => {
//       console.error("Error updating points:", err);
//     });
//   };

//   const checkBoardComplete = (nodes, edges) => {
//     if (nodes.every(val => val !== null) && edges.every(val => val !== null)) {
//       const finalResult = computeResult(nodes, edges);
//       if (finalResult === target) {
//         setMessage("Congratulations! Correct result achieved. Loading new game...");
//         addPoints()
//         setTimeout(() => {
//           loadNewGame();
//         }, 2000);
//       } else {
//         setMessage("Incorrect result. Resetting game...");
//         setTimeout(() => {
//           resetBoard();
//         }, 2000);
//       }
//     }
//   };

//   // Reset the board (while keeping the same target and pool).
//   const resetBoard = () => {
//     setPlacedNodes(Array(initialNumbers.length).fill(null));
//     setPlacedEdges(Array(initialOperators.length).fill(null));
//     setAvailableNumbers([...initialNumbers]);
//     setAvailableOperators([...initialOperators]);
//     setMessage('');
//   };

//   return (
//     <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
//       <h2>Target: {target !== null ? target : 'Loading...'}</h2>
//       {message && <h3>{message}</h3>}

//       {/* Game Board */}
//       <div style={{ margin: '20px 0' }}>
//   <h3>Game Board</h3>
//   <div
//     style={{
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       flexWrap: 'wrap',
//       gap: '5px',
//       maxWidth: '100%',
//     }}
//   >
//     {placedNodes.map((node, index) => (
//       <React.Fragment key={`node-${index}`}>
//         {/* Node as a perfect circle */}
//         <div
//           onDrop={(e) => onDropNode(e, index)}
//           onDragOver={allowDrop}
//           style={{
//             width: '60px',
//             height: '60px',
//             borderRadius: '50%',
//             border: '2px solid #333',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             margin: '5px',
//             backgroundColor: index === 0 ? '#d4f7d4' : '#fff',
//             fontSize: '18px',
//             fontWeight: 'bold',
//             color: '#333',
//           }}
//         >
//           {node !== null ? node : index === 0 ? 'Start' : ''}
//         </div>
//         {/* Edge as a squared diamond */}
//         {index < placedEdges.length && (
//           <div
//             onDrop={(e) => onDropEdge(e, index)}
//             onDragOver={allowDrop}
//             style={{
//               width: '50px',
//               height: '50px',
//               border: '2px solid #007bff',
//               backgroundColor: '#f0f8ff',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               margin: '5px',
//               transform: 'rotate(45deg)',
//             }}
//           >
//             <div
//               style={{
//                 transform: 'rotate(-45deg)',
//                 fontSize: '18px',
//                 fontWeight: 'bold',
//                 color: '#007bff',
//               }}
//             >
//               {placedEdges[index] ? placedEdges[index] : ''}
//             </div>
//           </div>
//         )}
//       </React.Fragment>
//     ))}
//   </div>
// </div>

//       {/* Available Numbers */}
//       <div style={{ margin: '20px 0' }}>
//         <h3>Available Numbers</h3>
//         <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center',alignItems: 'center' }}>
//           {availableNumbers.map((num, idx) => (
//             <div
//               key={`num-${idx}`}
//               draggable
//               onDragStart={(e) => onDragStart(e, num, "number")}
//               style={{
//                 width: '50px',
//                 height: '50px',
//                 borderRadius: '50%',
//                 border: '1px solid gray',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 margin: '5px',
//                 backgroundColor: '#fff',
//                 fontSize: '18px',
//                 fontWeight: 'bold',
//                 color: '#333',
//                 cursor: 'grab'
//               }}
//             >
//               {num}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Available Operators */}
//       <div style={{ margin: '20px 0' }}>
//         <h3>Available Operators</h3>
//         <div style={{ display: 'flex', flexWrap: 'wrap' ,justifyContent: 'center',alignItems: 'center'}}>
//           {availableOperators.map((op, idx) => (
//             <div
//               key={`op-${idx}`}
//               draggable
//               onDragStart={(e) => onDragStart(e, op, "operator")}
//               style={{
//                 width: '50px',
//                 height: '50px',
//                 border: '1px solid gray',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 margin: '5px',
//                 backgroundColor: '#fff',
//                 fontSize: '24px',
//                 fontWeight: 'bold',
//                 color: '#007bff',
//                 cursor: 'grab'
//               }}
//             >
//               {op}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Game2;


import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import axios from 'axios';

// Utility function to reshuffle an array using Fisher-Yates.
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const Game2 = () => {
  // Read "length" from URL param (e.g., /game2/3).
  const { length } = useParams();
  // If parsing fails, default to 2.
  const gameLength = parseInt(length) || 2;

  // State variables
  const [target, setTarget] = useState(null);
  const [availableNumbers, setAvailableNumbers] = useState([]);
  const [availableOperators, setAvailableOperators] = useState([]);
  const [placedNodes, setPlacedNodes] = useState([]);
  const [placedEdges, setPlacedEdges] = useState([]);
  const [initialNumbers, setInitialNumbers] = useState([]);
  const [initialOperators, setInitialOperators] = useState([]);
  const [message, setMessage] = useState('');
  const [currGameId, setCurrGameId] = useState('');

  // State to track which node/edge is currently selected
  const [selectedNodeIndex, setSelectedNodeIndex] = useState(null);
  const [selectedEdgeIndex, setSelectedEdgeIndex] = useState(null);

  /**
   * Always load a fresh game from the server whenever
   * this component mounts or "gameLength" changes.
   */
  useEffect(() => {
    loadNewGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameLength]);

  /**
   * Fetch a new game from the API, partially place some
   * nodes/operators, and shuffle the remaining ones.
   */
  const loadNewGame = () => {
    fetch(`https://mindsweeper-api.onrender.com/api/generate-game?length=${gameLength}`)
      .then(response => response.json())
      .then(data => {
        // The API is expected to return:
        // {
        //   target: number,
        //   chosenNumbers: number[],
        //   operatorPool: string[], // e.g. ["+", "-", "*", "/"]
        //   gameId: string
        // }
        let Numbers = data.chosenNumbers;
        let Operators = data.operatorPool;
        const gameId = data.gameId;

        // Prepare empty placeholders
        const placedNodesArr = Array(Numbers.length).fill(null);
        const placedEdgesArr = Array(Operators.length).fill(null);

        // Partially place some numbers/operators if length > 3
        if (Numbers.length > 3) {
          placedNodesArr[1] = Numbers[1];
          placedNodesArr[3] = Numbers[3];
          placedEdgesArr[2] = Operators[2];

          // For length > 5, place additional items
          if (Numbers.length > 5) {
            placedNodesArr[6] = Numbers[6];
            placedEdgesArr[4] = Operators[4];
          }

          // Remove those from the available pools
          Numbers = Numbers.filter((_, i) => i !== 1 && i !== 3 && i !== 6);
          Operators = Operators.filter((_, i) => i !== 2 && i !== 4);
        }

        // Shuffle the leftover arrays
        const shuffledNums = shuffleArray(Numbers);
        const shuffledOps = shuffleArray(Operators);

        // Update state
        setTarget(data.target);
        setAvailableNumbers(shuffledNums);
        setAvailableOperators(shuffledOps);
        setInitialNumbers(shuffledNums);
        setInitialOperators(shuffledOps);
        setPlacedNodes(placedNodesArr);
        setPlacedEdges(placedEdgesArr);
        setCurrGameId(gameId);
        setMessage('');

        // Clear any selections
        setSelectedNodeIndex(null);
        setSelectedEdgeIndex(null);

        // No localStorage usage here — always fresh.
      })
      .catch(err => console.error("Error fetching new game data:", err));
  };

  /**
   * Click handler for an empty node. Sets that node index as selected.
   */
  const handleNodeClick = (index) => {
    // Only select if it's empty
    if (placedNodes[index] !== null) return;
    setSelectedNodeIndex(index);
    setSelectedEdgeIndex(null);
  };

  /**
   * When a number in the available pool is clicked,
   * if a node is selected, place that number there.
   */
  const handleNumberSelection = (num) => {
    if (selectedNodeIndex === null) return;

    // Place the number
    const newNodes = [...placedNodes];
    newNodes[selectedNodeIndex] = num;
    setPlacedNodes(newNodes);

    // Remove from the available pool
    setAvailableNumbers(prev => {
      const idx = prev.indexOf(num);
      return idx === -1 ? prev : [...prev.slice(0, idx), ...prev.slice(idx + 1)];
    });

    // Clear selection
    setSelectedNodeIndex(null);

    // Check if the board is complete
    checkBoardComplete(newNodes, placedEdges);
  };

  /**
   * Click handler for an empty edge. Sets that edge index as selected.
   */
  const handleEdgeClick = (index) => {
    if (placedEdges[index] !== null) return;
    setSelectedEdgeIndex(index);
    setSelectedNodeIndex(null);
  };

  /**
   * When an operator in the available pool is clicked,
   * if an edge is selected, place that operator there.
   */
  const handleOperatorSelection = (op) => {
    if (selectedEdgeIndex === null) return;

    // Place the operator
    const newEdges = [...placedEdges];
    newEdges[selectedEdgeIndex] = op;
    setPlacedEdges(newEdges);

    // Remove from the available pool
    setAvailableOperators(prev => {
      const idx = prev.indexOf(op);
      return idx === -1 ? prev : [...prev.slice(0, idx), ...prev.slice(idx + 1)];
    });

    // Clear selection
    setSelectedEdgeIndex(null);

    // Check if the board is complete
    checkBoardComplete(placedNodes, newEdges);
  };

  /**
   * Evaluate the placedNodes and placedEdges from left to right.
   * e.g. If placedNodes = [2, 3, 4], placedEdges = ['+', '*'],
   * the result is 2 + 3 * 4 = 20 (left-to-right, no operator precedence).
   */
  const computeResult = (nodes, edges) => {
    if (nodes[0] === null) return null;
    let result = parseInt(nodes[0]);
    for (let i = 0; i < edges.length; i++) {
      if (edges[i] === null || nodes[i + 1] === null) break;
      const nextVal = parseInt(nodes[i + 1]);
      const op = edges[i];
      if (op === '+') result += nextVal;
      else if (op === '-') result -= nextVal;
      else if (op === '*') result *= nextVal;
      else if (op === '/') result = Math.floor(result / nextVal);
    }
    return result;
  };

  /**
   * If the board is fully filled, compute the result and compare with target.
   * If correct, add points and load a new game.
   * If incorrect, reset the current board.
   */
  const checkBoardComplete = (nodes, edges) => {
    const allNodesFilled = nodes.every(val => val !== null);
    const allEdgesFilled = edges.every(val => val !== null);

    if (allNodesFilled && allEdgesFilled) {
      const finalResult = computeResult(nodes, edges);
      if (finalResult === target) {
        setMessage("Congratulations! Correct result achieved. Loading new game...");
        addPoints();
        setTimeout(() => {
          loadNewGame();
        }, 2000);
      } else {
        setMessage("Incorrect result. Resetting game...");
        setTimeout(() => {
          resetBoard();
        }, 2000);
      }
    }
  };

  /**
   * Add points to the user based on the length.
   * Uses the encrypted game ID and email from localStorage.
   */
  const addPoints = () => {
    const gameId = JSON.stringify(currGameId);
    const secretKey = 'Z8yd9sfG9h1r3f9$jb0vXp!92mbR6hFz';
    const encryptedGameId = CryptoJS.AES.encrypt(gameId, secretKey).toString();
    const email = localStorage.getItem('email');

    axios.post('https://mindsweeper-api.onrender.com/api/update-points', {
      encryptedGameId,
      email_id: email,
      points:
        gameLength === 3
          ? 2
          : gameLength === 5
          ? 5
          : gameLength === 7
          ? 10
          : 0
    })
    .then(response => {
      console.log('Points updated successfully:', response.data);
    })
    .catch(err => {
      console.error("Error updating points:", err);
    });
  };

  /**
   * Reset the board (but keep the same target & initial pool).
   */
  const resetBoard = () => {
    setPlacedNodes(Array(initialNumbers.length).fill(null));
    setPlacedEdges(Array(initialOperators.length).fill(null));
    setAvailableNumbers([...initialNumbers]);
    setAvailableOperators([...initialOperators]);
    setMessage('');
    setSelectedNodeIndex(null);
    setSelectedEdgeIndex(null);
  };

  // ----- RENDER -----
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Target: {target !== null ? target : 'Loading...'}</h2>
      {message && <h3>{message}</h3>}

      {/* Game Board */}
      <div style={{ margin: '20px 0' }}>
        <h3>Game Board</h3>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '5px',
            maxWidth: '100%',
          }}
        >
          {placedNodes.map((node, index) => (
            <React.Fragment key={`node-${index}`}>
              {/* Node as a perfect circle */}
              <div
                onClick={() => handleNodeClick(index)}
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  border:
                    selectedNodeIndex === index
                      ? '3px solid #64b5f6'
                      : '2px solid #333',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '5px',
                  backgroundColor: node !== null ? '#d4f7d4' : '#fff',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#333',
                  cursor: node === null ? 'pointer' : 'default',
                }}
              >
                {node !== null ? node : ''}
              </div>
              {/* Edge as a squared diamond */}
              {index < placedEdges.length && (
                <div
                  onClick={() => handleEdgeClick(index)}
                  style={{
                    width: '50px',
                    height: '50px',
                    border:
                      selectedEdgeIndex === index
                        ? '3px solid #64b5f6'
                        : '2px solid #007bff',
                    backgroundColor: '#f0f8ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '5px',
                    transform: 'rotate(45deg)',
                    cursor: placedEdges[index] === null ? 'pointer' : 'default',
                  }}
                >
                  <div
                    style={{
                      transform: 'rotate(-45deg)',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: '#007bff',
                    }}
                  >
                    {placedEdges[index] ? placedEdges[index] : ''}
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Available Numbers */}
      <div style={{ margin: '20px 0' }}>
        <h3>Available Numbers</h3>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {availableNumbers.map((num, idx) => (
            <div
              key={`num-${idx}`}
              onClick={() => handleNumberSelection(num)}
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                border: '1px solid gray',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '5px',
                backgroundColor: '#fff',
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#333',
                // Only clickable if a node is selected
                cursor: selectedNodeIndex !== null ? 'pointer' : 'default',
              }}
            >
              {num}
            </div>
          ))}
        </div>
      </div>

      {/* Available Operators */}
      <div style={{ margin: '20px 0' }}>
        <h3>Available Operators</h3>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {availableOperators.map((op, idx) => (
            <div
              key={`op-${idx}`}
              onClick={() => handleOperatorSelection(op)}
              style={{
                width: '50px',
                height: '50px',
                border: '1px solid gray',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '5px',
                backgroundColor: '#fff',
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#007bff',
                // Only clickable if an edge is selected
                cursor: selectedEdgeIndex !== null ? 'pointer' : 'default',
              }}
            >
              {op}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Game2;
