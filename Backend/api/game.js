const express = require("express");
const url = require('url');
const router = express.Router();

const generateGameData = (chosenLength)=>{
    let numbers = [];
    for (let i=0;i<chosenLength*2;i++){
        numbers.push(Math.floor((Math.random())*40)+1);
    }
    let target = 0;
    let operators = ["+","-","*","/"];
    let chosenNumbers = [];
    let operatorPool = [];
    let j = Math.floor(Math.random()*(numbers.length))
    let number = numbers[j];
    target+=number;
    chosenNumbers.push(number);
    numbers.splice(j,1);
    // const upper = numbers.length;
    chosenLength = Math.max(chosenLength,2);
    for (let i=1;i<chosenLength;i++){
        if (numbers.length === 0) break;
        let j = Math.floor(Math.random()*(numbers.length))
        let number = numbers[j]
        let operator = operators[Math.floor(Math.random()*4)]
        if (operator==="+") target+=number;
        else if (operator==="-") target-=number;
        else if (operator==="*") target*=number;
        else if (operator==="/") target=Math.floor(target/number);
        else continue;
        chosenNumbers.push(number);
        numbers.splice(j,1);
        operatorPool.push(operator);
    }
    numbers.push(...chosenNumbers);
    numbers.sort();
    return {target,numbers,chosenNumbers,operatorPool};
}

router.get("/generate-game", (req, res) => {
    let chosenLength = parseInt(req.query.length) || 2;
    res.json(generateGameData(chosenLength));
});

module.exports = router;

