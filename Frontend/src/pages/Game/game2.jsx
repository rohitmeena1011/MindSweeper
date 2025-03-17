import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

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
  const { length } = useParams();
  const gameLength = parseInt(length) || 2;
  // Use a unique key for localStorage per gameLength.
  const localStorageKey = `game2Data_${gameLength}`;

  const [target, setTarget] = useState(null);
  const [availableNumbers, setAvailableNumbers] = useState([]);
  const [availableOperators, setAvailableOperators] = useState([]);
  const [placedNodes, setPlacedNodes] = useState([]);
  const [placedEdges, setPlacedEdges] = useState([]);
  // Keep the original pools for resets.
  const [initialNumbers, setInitialNumbers] = useState([]);
  const [initialOperators, setInitialOperators] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Check if game data exists in localStorage.
    const savedData = localStorage.getItem(localStorageKey);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setTarget(parsed.target);
      setAvailableNumbers(parsed.initialNumbers);
      setAvailableOperators(parsed.initialOperators);
      setInitialNumbers(parsed.initialNumbers);
      setInitialOperators(parsed.initialOperators);
      setPlacedNodes(Array(parsed.initialNumbers.length).fill(null));
      setPlacedEdges(Array(parsed.initialOperators.length).fill(null));
    } else {
      // Otherwise, fetch new game data.
      fetch(`http://localhost:5000/api/generate-game?length=${gameLength}`)
        .then(response => response.json())
        .then(data => {
          // API returns: { target, chosenNumbers, operatorPool }
          // Reshuffle the arrays.
          const shuffledNumbers = shuffleArray(data.chosenNumbers);
          const shuffledOperators = shuffleArray(data.operatorPool);
          setTarget(data.target);
          setAvailableNumbers(shuffledNumbers);
          setAvailableOperators(shuffledOperators);
          setInitialNumbers(shuffledNumbers);
          setInitialOperators(shuffledOperators);
          setPlacedNodes(Array(shuffledNumbers.length).fill(null));
          setPlacedEdges(Array(shuffledOperators.length).fill(null));
          // Save to localStorage so that the same game is restored on refresh.
          localStorage.setItem(localStorageKey, JSON.stringify({
            target: data.target,
            initialNumbers: shuffledNumbers,
            initialOperators: shuffledOperators
          }));
        })
        .catch(err => console.error("Error fetching game data:", err));
    }
  }, [gameLength, localStorageKey]);

  // Drag start: store item and type.
  const onDragStart = (e, item, type) => {
    e.dataTransfer.setData("text/plain", JSON.stringify({ item, type }));
  };

  // Allow dropping.
  const allowDrop = (e) => {
    e.preventDefault();
  };

  // Drop handler for number nodes.
  const onDropNode = (e, index) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData("text/plain"));
    if (data.type !== "number" || placedNodes[index] !== null) return;
    const newNodes = [...placedNodes];
    newNodes[index] = data.item;
    setPlacedNodes(newNodes);
    // Remove only one occurrence.
    setAvailableNumbers(prev => {
      const i = prev.indexOf(data.item);
      return i === -1 ? prev : [...prev.slice(0, i), ...prev.slice(i + 1)];
    });
    checkBoardComplete(newNodes, placedEdges);
  };

  // Drop handler for operator edges.
  const onDropEdge = (e, index) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData("text/plain"));
    if (data.type !== "operator" || placedEdges[index] !== null) return;
    const newEdges = [...placedEdges];
    newEdges[index] = data.item;
    setPlacedEdges(newEdges);
    // Remove only one occurrence.
    setAvailableOperators(prev => {
      const i = prev.indexOf(data.item);
      return i === -1 ? prev : [...prev.slice(0, i), ...prev.slice(i + 1)];
    });
    checkBoardComplete(placedNodes, newEdges);
  };

  // Compute the sequential result (left-to-right evaluation).
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

  // Check if the board is fully filled and if the result matches the target.
  const checkBoardComplete = (nodes, edges) => {
    if (nodes.every(val => val !== null) && edges.every(val => val !== null)) {
      const finalResult = computeResult(nodes, edges);
      if (finalResult === target) {
        setMessage("Congratulations! Correct result achieved.");
      } else {
        setMessage("Incorrect result. Resetting game...");
        setTimeout(() => {
          resetBoard();
        }, 2000);
      }
    }
  };

  // Reset the board (while keeping the same target and pool).
  const resetBoard = () => {
    setPlacedNodes(Array(initialNumbers.length).fill(null));
    setPlacedEdges(Array(initialOperators.length).fill(null));
    setAvailableNumbers([...initialNumbers]);
    setAvailableOperators([...initialOperators]);
    setMessage('');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Target: {target !== null ? target : 'Loading...'}</h2>
      {message && <h3>{message}</h3>}

      {/* Game Board */}
      <div style={{ margin: '20px 0' }}>
        <h3>Game Board</h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {placedNodes.map((node, index) => (
            <React.Fragment key={`node-${index}`}>
              {/* Node as a perfect circle */}
              <div
                onDrop={(e) => onDropNode(e, index)}
                onDragOver={allowDrop}
                style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  border: '2px solid #333',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '10px',
                  backgroundColor: index === 0 ? '#d4f7d4' : '#fff',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: '#333'
                }}
              >
                {node !== null ? node : (index === 0 ? "Start" : "")}
              </div>
              {/* Edge as a squared diamond (square rotated 45°) */}
              {index < placedEdges.length && (
                <div
                  onDrop={(e) => onDropEdge(e, index)}
                  onDragOver={allowDrop}
                  style={{
                    width: '60px',
                    height: '60px',
                    border: '2px solid #007bff',
                    backgroundColor: '#f0f8ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '10px',
                    transform: 'rotate(45deg)'
                  }}
                >
                  <div style={{
                    transform: 'rotate(-45deg)',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#007bff'
                  }}>
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
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {availableNumbers.map((num, idx) => (
            <div
              key={`num-${idx}`}
              draggable
              onDragStart={(e) => onDragStart(e, num, "number")}
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
                cursor: 'grab'
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
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {availableOperators.map((op, idx) => (
            <div
              key={`op-${idx}`}
              draggable
              onDragStart={(e) => onDragStart(e, op, "operator")}
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
                cursor: 'grab'
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

