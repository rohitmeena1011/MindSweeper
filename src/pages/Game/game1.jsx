import React, { useState } from "react";
import { Button, Card, CardContent, Typography, Grid } from "@mui/material";

// Function to generate a valid target and numbers ensuring a solvable game
const generateGameData = (keepTarget = null, keepNumbers = null) => {
  let target = keepTarget ?? Math.floor(Math.random() * 81) + 20; // Target: 20-100
  let numbers = keepNumbers ? [...keepNumbers] : [];
  let currentValue = target;

  if (!keepNumbers) {
    // Generate a valid sequence ensuring at least one solution exists
    for (let i = 0; i < 5; i++) {
      let num = Math.floor(Math.random() * 50) + 1; // Numbers from 1-50
      let op = ["+", "*", "/"][Math.floor(Math.random() * 3)]; // Removed '-' to avoid negatives

      if (op === "+") currentValue -= num;
      else if (op === "*") {
        if (currentValue * num <= 100) currentValue *= num;
        else continue;
      } else if (op === "/") {
        if (currentValue % num === 0 && currentValue / num > 0) currentValue = Math.floor(currentValue / num);
        else continue;
      }

      numbers.push({ value: num, flipped: false });
    }

    numbers.push({ value: currentValue, flipped: false }); // Ensure one final number

    // Fill extra distractor numbers
    while (numbers.length < 10) {
      numbers.push({ value: Math.floor(Math.random() * 100) + 1, flipped: false });
    }
  }

  // Shuffle numbers to hide the correct sequence
  numbers = numbers.sort(() => Math.random() - 0.5);

  return { target, numbers };
};

const Game1 = () => {
  const [gameData, setGameData] = useState(generateGameData());
  const [selectedCards, setSelectedCards] = useState([]);
  const [selectedOps, setSelectedOps] = useState([]);
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState("");

  // Flip a card and add to selection
  const flipCard = (index) => {
    if (!gameData.numbers[index].flipped && selectedCards.length < 10) {
      let newNumbers = [...gameData.numbers];
      newNumbers[index].flipped = true;
      setGameData({ ...gameData, numbers: newNumbers });
      setSelectedCards([...selectedCards, newNumbers[index].value]);
    }
  };

  // Select an operator
  const selectOperator = (op) => {
    if (selectedOps.length < selectedCards.length - 1) {
      setSelectedOps([...selectedOps, op]);
    }
  };

  // Compute the result based on selections
  const calculateResult = () => {
    if (selectedCards.length < 2) {
      setMessage("Select at least two numbers.");
      return;
    }

    let value = selectedCards[0];
    for (let i = 0; i < selectedOps.length; i++) {
      if (selectedOps[i] === "+") value += selectedCards[i + 1];
      else if (selectedOps[i] === "*") value *= selectedCards[i + 1];
      else if (selectedOps[i] === "/" && selectedCards[i + 1] !== 0)
        value = Math.floor(value / selectedCards[i + 1]); // Ensure integer division
    }

    setResult(value);
    setMessage(value === gameData.target ? "🎉 Correct! You Win!" : "❌ Wrong! Try again.");
  };

  // Reset the game and reshuffle cards
  const resetGame = () => {
    setGameData(generateGameData());
    setSelectedCards([]);
    setSelectedOps([]);
    setResult(null);
    setMessage("");
  };

  // Replay mode: Same target & numbers, but reshuffled & reset flipped state
  const replayGame = () => {
    let newNumbers = gameData.numbers.map((card) => ({ ...card, flipped: false }));
    setGameData({ target: gameData.target, numbers: newNumbers.sort(() => Math.random() - 0.5) });
    setSelectedCards([]);
    setSelectedOps([]);
    setResult(null);
    setMessage("");
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        🎯 Target: {gameData.target}
      </Typography>

      {/* Card Grid */}
      <Grid container spacing={2} justifyContent="center">
        {gameData.numbers.map((card, index) => (
          <Grid item key={index}>
            <Card
              onClick={() => flipCard(index)}
              sx={{
                width: 80,
                height: 120,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: card.flipped ? "yellow" : "gray",
                color: "black",
                fontSize: 20,
                cursor: card.flipped ? "default" : "pointer",
              }}
            >
              <CardContent>{card.flipped ? card.value : "?"}</CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Operator Selection */}
      <div style={{ marginTop: "20px" }}>
        {["+", "*", "/"].map((op) => (
          <Button
            key={op}
            variant="contained"
            color="primary"
            onClick={() => selectOperator(op)}
            sx={{ margin: "5px" }}
            disabled={selectedOps.length >= selectedCards.length - 1}
          >
            {op}
          </Button>
        ))}
      </div>

      {/* Selected Equation */}
      <Typography variant="h6" style={{ marginTop: "10px" }}>
        {selectedCards
          .map((num, idx) => (idx < selectedOps.length ? `${num} ${selectedOps[idx]}` : num))
          .join(" ")}
      </Typography>

      {/* Submit & Reset Buttons */}
      <div style={{ marginTop: "20px" }}>
        <Button variant="contained" color="success" onClick={calculateResult} sx={{ margin: "5px" }}>
          Submit
        </Button>
        <Button variant="contained" color="secondary" onClick={resetGame} sx={{ margin: "5px" }}>
          Reset
        </Button>
        <Button variant="contained" color="warning" onClick={replayGame} sx={{ margin: "5px" }}>
          🔄 Replay (Shuffle Cards)
        </Button>
      </div>

      {/* Result Message */}
      {message && (
        <Typography variant="h6" style={{ marginTop: "10px", color: message.includes("Win") ? "green" : "red" }}>
          {message}
        </Typography>
      )}

      {/* Result Display */}
      {result !== null && (
        <Typography variant="h6" style={{ marginTop: "10px" }}>
          Your Result: {result}
        </Typography>
      )}
    </div>
  );
};

export default Game1;
