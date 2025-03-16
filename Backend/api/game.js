const express = require("express");
const router = express.Router();

const generateGameData = ()=>{
    let numbers = [];
    for (let i=0;i<Math.floor(Math.random()*30+10);i++){
        numbers.push(Math.floor((Math.random())*20)+1);
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
    const upper = numbers.length;
    for (let i=1;i<Math.floor(Math.random()*Math.floor(upper/2))+2;i++){
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

router.get("/generate-game", (req, res) => res.json(generateGameData()));

module.exports = router;
