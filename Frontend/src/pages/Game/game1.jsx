import React, { useState } from "react";
import { Button, Card, CardContent, Typography, Grid } from "@mui/material";

const maxSelections = 10; // Maximum attempts allowed
const totalCards = 2 * maxSelections; // Total number of cards on the board

const generateGameData = () => {
  let target = Math.floor(Math.random() * 81) + 20; // Target between 20-100
  let numbers = [];
  let currentValue = target;
  let availableOperators = ["+", "-", "*", "/"];

  // Generate numbers that can form a valid equation leading to the target
  for (let i = 0; i < maxSelections / 2; i++) {
    let num = Math.floor(Math.random() * 20) + 1;
    let op = availableOperators[Math.floor(Math.random() * 4)];

    if (op === "+") currentValue -= num;
    else if (op === "-") currentValue += num;
    else if (op === "*" && currentValue % num === 0) currentValue /= num;
    else if (op === "/" && currentValue * num <= 100) currentValue *= num;
    else continue;

    numbers.push({ value: num, flipped: false });
  }

  numbers.push({ value: currentValue, flipped: false });

  // Fill remaining slots with random numbers
  while (numbers.length < totalCards) {
    numbers.push({ value: Math.floor(Math.random() * 30) + 1, flipped: false });
  }

  numbers = numbers.sort(() => Math.random() - 0.5); // Shuffle the numbers

  return { target, numbers };
};

const Game1 = () => {
  const [gameData, setGameData] = useState(generateGameData());
  const [selectedCards, setSelectedCards] = useState([]);
  const [selectedOps, setSelectedOps] = useState([]);
  const [ongoingResult, setOngoingResult] = useState(null);
  const [message, setMessage] = useState("");
  const [attemptsLeft, setAttemptsLeft] = useState(maxSelections);

  const flipCard = (index) => {
    if (!gameData.numbers[index].flipped && selectedCards.length < maxSelections) {
      let newNumbers = [...gameData.numbers];
      newNumbers[index].flipped = true;
      setGameData({ ...gameData, numbers: newNumbers });

      let newSelectedCards = [...selectedCards, newNumbers[index].value];
      setSelectedCards(newSelectedCards);
      setAttemptsLeft(attemptsLeft - 1);
    }
  };

  const selectOperator = (op) => {
    if (selectedCards.length < 2) {
      setMessage("⚠️ Select at least two numbers first.");
      return;
    }

    let newSelectedOps = [...selectedOps, op];
    setSelectedOps(newSelectedOps);
    calculateResult(selectedCards, newSelectedOps);
  };

  const calculateResult = (cards, ops) => {
    let value = cards[0];

    for (let i = 0; i < ops.length; i++) {
      if (ops[i] === "+") value += cards[i + 1];
      else if (ops[i] === "-") value -= cards[i + 1];
      else if (ops[i] === "*") value *= cards[i + 1];
      else if (ops[i] === "/" && cards[i + 1] !== 0) value = Math.floor(value / cards[i + 1]);
    }

    setOngoingResult(value);

    if (value === gameData.target) {
      setMessage("🎉 Correct! Generating a new game...");
      setTimeout(() => {
        setGameData(generateGameData());
        resetState();
      }, 2000);
    } else if (attemptsLeft === 1) {
      setMessage("❌ Out of attempts! Cards reset.");
      resetGame();
    }
  };

  const resetGame = () => {
    let resetNumbers = gameData.numbers.map((card) => ({ ...card, flipped: false }));
    setGameData({ ...gameData, numbers: resetNumbers });
    resetState();
  };

  const resetState = () => {
    setSelectedCards([]);
    setSelectedOps([]);
    setOngoingResult(null);
    setAttemptsLeft(maxSelections);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        🎯 Target: {gameData.target}
      </Typography>

      <Typography variant="h6" color="primary">
        Attempts Left: {attemptsLeft}/{maxSelections}
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
        {["+", "-", "*", "/"].map((op) => (
          <Button
            key={op}
            variant="contained"
            color="primary"
            onClick={() => selectOperator(op)}
            sx={{ margin: "5px" }}
          >
            {op}
          </Button>
        ))}
      </div>

      {/* Ongoing Calculation */}
      <Typography variant="h6" style={{ marginTop: "10px" }}>
        {selectedCards
          .map((num, idx) => (idx < selectedOps.length ? `${num} ${selectedOps[idx]}` : num))
          .join(" ")}
      </Typography>

      {/* Ongoing Result */}
      <Typography
        variant="h6"
        style={{
          marginTop: "10px",
          color:
            ongoingResult === gameData.target
              ? "green"
              : Math.abs(ongoingResult - gameData.target) <= 10
              ? "orange"
              : "red",
        }}
      >
        Ongoing Result: {ongoingResult !== null ? ongoingResult : "N/A"}
      </Typography>

      {/* Result Message */}
      {message && (
        <Typography
          variant="h6"
          style={{ marginTop: "10px", color: message.includes("Win") ? "green" : "red" }}
        >
          {message}
        </Typography>
      )}
    </div>
  );
};

export default Game1;

