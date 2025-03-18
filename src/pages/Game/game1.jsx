import React, { useState, useEffect } from "react";
import { Button, Card, CardContent, Typography, Grid } from "@mui/material";
import axios from "axios";

const maxSelections = 10;

const Game1 = () => {
  const [gameData, setGameData] = useState(null);
  const [selectedCards, setSelectedCards] = useState([]);
  const [selectedOps, setSelectedOps] = useState([]);
  const [ongoingResult, setOngoingResult] = useState(null);
  const [message, setMessage] = useState("");
  const [attemptsLeft, setAttemptsLeft] = useState(maxSelections);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGameData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/generate-game");
      setGameData(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching game data:", err);
      setError("Failed to load game data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGameData();
  }, []);

  const flipCard = (index) => {
    if (!gameData.numbers[index].flipped && selectedCards.length < maxSelections) {
      let newNumbers = gameData.numbers.map((card, i) =>
        i === index ? { ...card, flipped: true } : card
      );

      setGameData({ ...gameData, numbers: newNumbers });

      let newSelectedCards = [...selectedCards, newNumbers[index].value];
      setSelectedCards(newSelectedCards);
      setAttemptsLeft((prev) => prev - 1);
    }
  };

  const selectOperator = (op) => {
    if (selectedCards.length < 2) {
      setMessage("Select at least two numbers first.");
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
        fetchGameData();
        resetState();
      }, 2000);
    } else if (attemptsLeft <= 1) {
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

  if (loading) return <Typography variant="h5">Loading game data...</Typography>;
  if (error) return <Typography variant="h5" color="error">{error}</Typography>;

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
         Target: {gameData.target}
      </Typography>

      <Typography variant="h6" color="primary">
        Attempts Left: {attemptsLeft}/{maxSelections}
      </Typography>

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

      <Typography variant="h6" style={{ marginTop: "10px" }}>
  {selectedCards
    .map((num, idx) => (idx < selectedOps.length ? `${num} ${selectedOps[idx]}` : num))
    .join(" ")}
</Typography>


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