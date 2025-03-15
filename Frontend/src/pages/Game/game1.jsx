import React, { useState } from "react";
import { Button, Card, CardContent, Typography, Grid } from "@mui/material";

const maxSelections = 10; // Number of attempts
const totalCards = 2 * maxSelections; // Ensuring twice the attempts

const generateGameData = () => {
  let target = Math.floor(Math.random() * 81) + 20; // Random target (20-100)
  let numbers = [];
  let ops = [];
  let currentValue = target;

  // Generate a solvable equation within maxSelections
  for (let i = 0; i < maxSelections / 2; i++) {
    let num = Math.floor(Math.random() * 20) + 1;
    let op = ["+", "-", "*", "/"][Math.floor(Math.random() * 4)];

    if (op === "+") currentValue -= num;
    else if (op === "-") currentValue += num;
    else if (op === "*" && currentValue % num === 0) currentValue /= num;
    else if (op === "/" && currentValue * num <= 100) currentValue *= num;
    else continue;

    numbers.push(num);
    ops.push(op);
  }

  numbers.push(currentValue); // Ensure the equation is valid

  // Fill extra numbers to meet totalCards requirement
  while (numbers.length < totalCards) {
    numbers.push(Math.floor(Math.random() * 30) + 1);
  }

  numbers = numbers.sort(() => Math.random() - 0.5);

  return {
    target,
    numbers: numbers.map((val) => ({ value: val, flipped: false })),
    solutionOps: ops,
  };
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
      updateOngoingResult(newSelectedCards, selectedOps);
    }
  };

  const selectOperator = (op) => {
    if (selectedOps.length < selectedCards.length - 1) {
      let newSelectedOps = [...selectedOps, op];
      setSelectedOps(newSelectedOps);
      updateOngoingResult(selectedCards, newSelectedOps);
    }
  };

  const updateOngoingResult = (cards, ops) => {
    if (cards.length < 2 || ops.length < 1) return;
    let value = cards[0];

    for (let i = 0; i < ops.length; i++) {
      if (ops[i] === "+") value += cards[i + 1];
      else if (ops[i] === "-") value -= cards[i + 1];
      else if (ops[i] === "*") value *= cards[i + 1];
      else if (ops[i] === "/" && cards[i + 1] !== 0) value = Math.floor(value / cards[i + 1]);
    }
    setOngoingResult(value);
  };

  const calculateResult = () => {
    if (selectedCards.length < 2 || selectedOps.length < 1) {
      setMessage("⚠️ Select at least two numbers and one operator.");
      return;
    }

    let finalResult = ongoingResult;

    if (finalResult === gameData.target) {
      setMessage("🎉 Correct! You Win!");
    } else {
      setMessage("❌ Wrong! Cards shuffled. Try again.");
      reshuffleAndReset();
    }
  };

  const reshuffleAndReset = () => {
    let shuffledNumbers = gameData.numbers.map((card) => ({
      ...card,
      flipped: false,
    })).sort(() => Math.random() - 0.5);

    setGameData({ ...gameData, numbers: shuffledNumbers });
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
            disabled={selectedOps.length >= selectedCards.length - 1}
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

      {/* Ongoing Result with Dynamic Color */}
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

      {/* Submit & Reset Buttons */}
      <div style={{ marginTop: "20px" }}>
        <Button
          variant="contained"
          color="success"
          onClick={calculateResult}
          sx={{ margin: "5px" }}
          disabled={selectedCards.length < 2 || selectedOps.length < 1}
        >
          Submit
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => setGameData(generateGameData())}
          sx={{ margin: "5px" }}
        >
          Reset
        </Button>
      </div>

      {/* Result Message */}
      {message && <Typography variant="h6" style={{ marginTop: "10px", color: message.includes("Win") ? "green" : "red" }}>{message}</Typography>}
    </div>
  );
};

export default Game1;
