import React, { useState, useEffect } from "react";
import { Button, Card, CardContent, Typography, Grid } from "@mui/material";
import axios from "axios";
import { useParams } from "react-router-dom";

const Game1 = () => {
  const { length } = useParams();
  const [gameData, setGameData] = useState(null);
  const [selectedCards, setSelectedCards] = useState([]);
  const [selectedOps, setSelectedOps] = useState([]);
  const [ongoingResult, setOngoingResult] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attemptsLeft, setAttemptsLeft] = useState(0);

  // Save the game state to localStorage
  const saveGameState = (state) => {
    localStorage.setItem("gameState", JSON.stringify(state));
  };

  // Load game state from localStorage if available
  const loadGameState = () => {
    const savedState = localStorage.getItem("gameState");
    if (savedState) {
      return JSON.parse(savedState);
    }
    return null;
  };

  const fetchGameData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/api/generate-game?length=${length}`
      );
      const newGameData = {
        ...response.data,
        numbers: response.data.numbers.map((num) => ({
          value: num,
          flipped: false,
        })),
      };
      setGameData(newGameData);
      setAttemptsLeft(response.data.chosenNumbers.length);
      // Reset selections on new game
      setSelectedCards([]);
      setSelectedOps([]);
      setOngoingResult(null);
      saveGameState({
        gameData: newGameData,
        selectedCards: [],
        selectedOps: [],
        attemptsLeft: response.data.chosenNumbers.length,
      });
      setLoading(false);
    } catch (err) {
      console.error("Error fetching game data:", err);
      setError("Failed to load game data");
      setLoading(false);
    }
  };

  // On mount, load saved state if available; otherwise, fetch new game data.
  useEffect(() => {
    const savedState = loadGameState();
    if (savedState && savedState.gameData) {
      setGameData(savedState.gameData);
      setSelectedCards(savedState.selectedCards);
      setSelectedOps(savedState.selectedOps);
      setAttemptsLeft(savedState.attemptsLeft);
      setLoading(false);
    } else {
      fetchGameData();
    }
  }, [length]);

  // Save state changes to localStorage
  useEffect(() => {
    if (gameData) {
      saveGameState({ gameData, selectedCards, selectedOps, attemptsLeft });
    }
  }, [gameData, selectedCards, selectedOps, attemptsLeft]);

  const flipCard = (index) => {
    if (!gameData.numbers[index].flipped && attemptsLeft > 0) {
      const newNumbers = gameData.numbers.map((card, i) =>
        i === index ? { ...card, flipped: true } : card
      );
      setGameData({ ...gameData, numbers: newNumbers });

      const newSelectedCards = [...selectedCards, newNumbers[index].value];
      setSelectedCards(newSelectedCards);
      setAttemptsLeft((prev) => prev - 1);

      // If after flipping a card the expression is complete (more than one card available),
      // calculate the ongoing result.
      if (newSelectedCards.length > 1 && newSelectedCards.length === selectedOps.length + 1) {
        calculateResult(newSelectedCards, selectedOps);
      }
    }
  };

  const selectOperator = (op) => {
    // Only allow selecting an operator if there is a card waiting for an operator
    if (selectedCards.length <= selectedOps.length) {
      setMessage("Select a card first.");
      return;
    }
    const newSelectedOps = [...selectedOps, op];
    setSelectedOps(newSelectedOps);

    // Only calculate if the expression is complete (i.e. at least 2 numbers exist)
    if (selectedCards.length > newSelectedOps.length) {
      calculateResult(selectedCards, newSelectedOps);
    }
  };

  const calculateResult = (cards, ops) => {
    let value = cards[0];
    for (let i = 0; i < ops.length; i++) {
      if (ops[i] === "+") value += cards[i + 1];
      else if (ops[i] === "-") value -= cards[i + 1];
      else if (ops[i] === "*") value *= cards[i + 1];
      else if (ops[i] === "/" && cards[i + 1] !== 0)
        value = Math.floor(value / cards[i + 1]);
    }
    setOngoingResult(value);

    // Check if the current result meets the target.
    if (cards.length > 1 && value === gameData.target) {
      setMessage("🎉 Correct! Generating a new game...");
      setTimeout(() => {
        fetchGameData();
      }, 2000);
    } else if (attemptsLeft <= 0) {
      setMessage("❌ Out of attempts! Cards reset.");
      resetGame();
    } else {
      setMessage("");
    }
  };

  const resetGame = () => {
    const resetNumbers = gameData.numbers.map((card) => ({
      ...card,
      flipped: false,
    }));
    setGameData({ ...gameData, numbers: resetNumbers });
    resetState();
  };

  const resetState = () => {
    setSelectedCards([]);
    setSelectedOps([]);
    setOngoingResult(null);
    setAttemptsLeft(gameData.chosenNumbers.length);
    setMessage("");
  };

  if (loading)
    return <Typography variant="h5">Loading game data...</Typography>;
  if (error)
    return (
      <Typography variant="h5" color="error">
        {error}
      </Typography>
    );

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Target: {gameData.target}
      </Typography>
      <Typography variant="h6" color="primary">
        Attempts Left: {attemptsLeft}/{gameData.chosenNumbers.length}
      </Typography>

      <Grid container spacing={2} justifyContent="center" style={{ marginTop: "20px" }}>
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
                backgroundColor: card.flipped ? "#fff" : "#1976d2",
                color: card.flipped ? "black" : "white",
                fontSize: 24,
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                cursor: card.flipped ? "default" : "pointer",
                border: "1px solid #ccc",
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
            // Disable the operator button if no new card is available for an operation.
            disabled={selectedCards.length <= selectedOps.length}
          >
            {op}
          </Button>
        ))}
      </div>

      <Typography variant="h6" style={{ marginTop: "10px" }}>
        {selectedCards
          .map((num, idx) =>
            idx < selectedOps.length ? `${num} ${selectedOps[idx]}` : num
          )
          .join(" ")}
      </Typography>

      <Typography
        variant="h6"
        style={{
          marginTop: "10px",
          color:
            ongoingResult === gameData.target
              ? "green"
              : ongoingResult !== null && Math.abs(ongoingResult - gameData.target) <= 10
              ? "orange"
              : "red",
        }}
      >
        Ongoing Result: {ongoingResult !== null ? ongoingResult : "N/A"}
      </Typography>

      {message && (
        <Typography
          variant="h6"
          style={{
            marginTop: "10px",
            color: message.includes("Correct") ? "green" : "red",
          }}
        >
          {message}
        </Typography>
      )}
    </div>
  );
};

export default Game1;
