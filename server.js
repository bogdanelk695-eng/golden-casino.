const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

const html = `
<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Hamster Tap 🐹</title>

<style>
* {
  box-sizing: border-box;
  user-select: none;
}

body {
  margin: 0;
  min-height: 100vh;
  font-family: Arial, sans-serif;
  background: linear-gradient(180deg, #fff4d6, #ffe0a3);
  display: flex;
  justify-content: center;
  align-items: center;
}

.game {
  width: min(420px, 94vw);
  text-align: center;
}

h1 {
  margin: 0 0 10px;
  font-size: 36px;
}

.coins {
  font-size: 32px;
  font-weight: bold;
  margin: 15px;
}

.hamster {
  width: 260px;
  height: 260px;
  margin: 20px auto;
  border-radius: 50%;
  background: #d9a066;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 150px;
  cursor: pointer;
  box-shadow: 0 12px 0 #b47a43;
  transition: transform .08s;
}

.hamster:active {
  transform: scale(.93);
  box-shadow: 0 5px 0 #b47a43;
}

button {
  width: 100%;
  padding: 16px;
  border: 0;
  border-radius: 15px;
  background: #48b86b;
  color: white;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
}

button:disabled {
  background: #999;
}

.info {
  margin-top: 15px;
  font-size: 18px;
}
</style>
</head>

<body>
<div class="game">
  <h1>🐹 Hamster Tap</h1>

  <div class="coins">
    💰 <span id="coins">0</span>
  </div>

  <div id="hamster" class="hamster">🐹</div>

  <button id="upgrade">
    Улучшение: +1 за тап — 50 💰
  </button>

  <div class="info">
    За тап: <b id="power">1</b>
  </div>
</div>

<script>
let coins = Number(localStorage.getItem("coins")) || 0;
let power = Number(localStorage.getItem("power")) || 1;
let cost = Number(localStorage.getItem("cost")) || 50;

const coinsEl = document.getElementById("coins");
const powerEl = document.getElementById("power");
const hamster = document.getElementById("hamster");
const upgrade = document.getElementById("upgrade");

function update() {
  coinsEl.textContent = coins;
  powerEl.textContent = power;

  upgrade.textContent =
    "Улучшение: +" + power + " за тап — " + cost + " 💰";

  upgrade.disabled = coins < cost;

  localStorage.setItem("coins", coins);
  localStorage.setItem("power", power);
  localStorage.setItem("cost", cost);
}

hamster.addEventListener("click", () => {
  coins += power;
  update();
});

upgrade.addEventListener("click", () => {
  if (coins < cost) return;

  coins -= cost;
  power++;
  cost = Math.floor(cost * 1.7);

  update();
});

update();
</script>
</body>
</html>
`;

app.get("/", (req, res) => {
  res.send(html);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("Hamster Tap запущен на порту " + PORT);
});
