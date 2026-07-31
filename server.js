const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const html = `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport"
        content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
  <title>Hamster Tap</title>

  <script src="https://telegram.org/js/telegram-web-app.js"></script>

  <style>
    * {
      box-sizing: border-box;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
    }

    body {
      margin: 0;
      min-height: 100vh;
      font-family: Arial, sans-serif;
      background: var(--tg-theme-bg-color, #fff3d1);
      color: var(--tg-theme-text-color, #222);
      display: flex;
      justify-content: center;
    }

    .game {
      width: min(430px, 100%);
      padding: 25px 18px;
      text-align: center;
    }

    h1 {
      margin: 5px 0 15px;
      font-size: 34px;
    }

    .balance {
      font-size: 38px;
      font-weight: bold;
      margin: 15px 0;
    }

    .tap-info {
      font-size: 18px;
      opacity: .8;
    }

    #hamster {
      width: 270px;
      height: 270px;
      margin: 35px auto;
      border-radius: 50%;
      background: #d9a066;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 150px;
      cursor: pointer;
      box-shadow: 0 12px 0 #ae743e;
      transition: transform .08s, box-shadow .08s;
      touch-action: manipulation;
    }

    #hamster:active {
      transform: scale(.91);
      box-shadow: 0 5px 0 #ae743e;
    }

    button {
      width: 100%;
      padding: 17px;
      border: 0;
      border-radius: 16px;
      font-size: 19px;
      font-weight: bold;
      background: #36a852;
      color: white;
      cursor: pointer;
    }

    button:disabled {
      opacity: .5;
    }

    .user {
      margin-top: 18px;
      opacity: .7;
    }

    .float {
      position: fixed;
      pointer-events: none;
      font-size: 25px;
      font-weight: bold;
      animation: floatUp .7s ease-out forwards;
    }

    @keyframes floatUp {
      from {
        opacity: 1;
        transform: translateY(0);
      }

      to {
        opacity: 0;
        transform: translateY(-80px);
      }
    }
  </style>
</head>

<body>

<div class="game">

  <h1>🐹 Hamster Tap</h1>

  <div class="balance">
    💰 <span id="coins">0</span>
  </div>

  <div class="tap-info">
    За тап: <b id="power">1</b> 💰
  </div>

  <div id="hamster">🐹</div>

  <button id="upgrade">
    Улучшить тап
  </button>

  <div class="user" id="user">
    Подключение к Telegram...
  </div>

</div>

<script>
const tg = window.Telegram.WebApp;

tg.ready();
tg.expand();

const coinsElement = document.getElementById("coins");
const powerElement = document.getElementById("power");
const hamster = document.getElementById("hamster");
const upgradeButton = document.getElementById("upgrade");
const userElement = document.getElementById("user");

let coins = Number(localStorage.getItem("coins")) || 0;
let power = Number(localStorage.getItem("power")) || 1;
let cost = Number(localStorage.getItem("cost")) || 50;

function save() {
  localStorage.setItem("coins", coins);
  localStorage.setItem("power", power);
  localStorage.setItem("cost", cost);
}

function update() {
  coinsElement.textContent = coins;
  powerElement.textContent = power;

  upgradeButton.textContent =
    "Улучшить тап — " + cost + " 💰";

  upgradeButton.disabled = coins < cost;

  save();
}

function showUser() {
  const user = tg.initDataUnsafe?.user;

  if (user) {
    const name =
      user.first_name ||
      user.username ||
      "Игрок";

    userElement.textContent = "👤 " + name;
  } else {
    userElement.textContent =
      "Открой игру через Telegram";
  }
}

function floatingText(x, y) {
  const element = document.createElement("div");

  element.className = "float";
  element.textContent = "+" + power;

  element.style.left = x + "px";
  element.style.top = y + "px";

  document.body.appendChild(element);

  setTimeout(() => {
    element.remove();
  }, 700);
}

hamster.addEventListener("pointerdown", (event) => {
  coins += power;

  floatingText(
    event.clientX,
    event.clientY
  );

  if (tg.HapticFeedback) {
    tg.HapticFeedback.impactOccurred("light");
  }

  update();
});

upgradeButton.addEventListener("click", () => {
  if (coins < cost) return;

  coins -= cost;
  power++;

  cost = Math.floor(cost * 1.7);

  if (tg.HapticFeedback) {
    tg.HapticFeedback.notificationOccurred("success");
  }

  update();
});

showUser();
update();
</script>

</body>
</html>
`;

app.get("/", (req, res) => {
  res.send(html);
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    game: "Hamster Tap"
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("Hamster Tap запущен на порту " + PORT);
});
