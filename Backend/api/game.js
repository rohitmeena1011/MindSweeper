const express = require("express");
const router = express.Router();

const generateGameData = () => {
  let target = Math.floor(Math.random() * 81) + 20;
  let numbers = new Set();
  let correctNumbers = [];
  let ops = ["+", "-", "*", "/"];

  let currentValue = target;
  while (correctNumbers.length < 5) {
    let num = Math.floor(Math.random() * 20) + 1;
    let op = ops[Math.floor(Math.random() * 4)];

    if (op === "+") currentValue -= num;
    else if (op === "-" && currentValue >= num) currentValue += num;
    else if (op === "*" && currentValue % num === 0) currentValue /= num;
    else if (op === "/" && currentValue * num <= 100) currentValue *= num;
    else continue;

    correctNumbers.push(num);
    numbers.add(num);
  }

  while (numbers.size < 20) numbers.add(Math.floor(Math.random() * 30) + 1);

  return { target, numbers: Array.from(numbers).sort(() => Math.random() - 0.5) };
};

router.get("/generate-game", (req, res) => res.json(generateGameData()));

module.exports = router;
