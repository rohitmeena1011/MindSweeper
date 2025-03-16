// const express = require("express");
// const router = express.Router();

// const generateGameData = () => {
//   let target = Math.floor(Math.random() * 81) + 20; // Random target (20-100)
//   let maxSelections = Math.floor(Math.random() * 7) + 6; // Random attempts (6-12)
//   let totalCards = 2 * maxSelections; // Ensure enough numbers
//   let equations = [];
//   let allNumbers = new Set();

//   for (let i = 0; i < 3 + Math.floor(Math.random() * 2); i++) {
//     let numbers = [];
//     let ops = [];
//     let currentValue = target;

//     for (let j = 0; j < maxSelections / 2; j++) {
//       let num = Math.floor(Math.random() * 20) + 1;
//       let op = ["+", "-", "*", "/"][Math.floor(Math.random() * 4)];

//       if (op === "+" || (op === "-" && currentValue > num)) {
//         currentValue -= num;
//       } else if (op === "-") {
//         currentValue += num;
//       } else if (op === "*" && currentValue % num === 0) {
//         currentValue /= num;
//       } else if (op === "/" && currentValue * num <= 100) {
//         currentValue *= num;
//       } else {
//         continue;
//       }

//       numbers.push(num);
//       ops.push(op);
//       allNumbers.add(num);
//     }

//     numbers.push(currentValue);
//     equations.push({ numbers, ops });
//   }

//   while (allNumbers.size < totalCards) {
//     allNumbers.add(Math.floor(Math.random() * 30) + 1);
//   }

//   let numberArray = Array.from(allNumbers);
//   numberArray.sort(() => Math.random() - 0.5);

//   return {
//     target,
//     maxSelections,
//     equations,
//     numbers: numberArray.map((val) => ({ value: val, flipped: false })),
//   };
// };

// router.get("/generate-game", (req, res) => {
//   res.json(generateGameData());
// });

// router.get("/reshuffle", (req, res) => {
//   let shuffledNumbers = req.body.numbers.map((card) => ({
//     ...card,
//     flipped: false,
//   }));
//   shuffledNumbers.sort(() => Math.random() - 0.5);

//   res.json({ numbers: shuffledNumbers });
// });

// module.exports = router;

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
