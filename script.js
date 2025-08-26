// Telegram WebApp
if (window.Telegram && Telegram.WebApp) {
    Telegram.WebApp.ready();
}

// Элементы
const toothSelection = document.getElementById("tooth-selection");
const clickerScreen = document.getElementById("clicker-screen");
const resultScreen = document.getElementById("result-screen");
const progressBar = document.getElementById("progress-bar");
const clickCountEl = document.getElementById("clicks");
const timerEl = document.getElementById("timer");
const clickButton = document.getElementById("click-button");
const resultMessage = document.getElementById("result-message");
const playAgainBtn = document.getElementById("play-again");

let clicks = 0;
let targetClicks = 30;
let timeLeft = 10;
let timer;
let gameActive = false;

// Выбор зуба
document.querySelectorAll(".tooth").forEach(tooth => {
    tooth.addEventListener("click", () => {
        const toothId = tooth.dataset.tooth;
        console.log("Выбран зуб:", toothId);
        
        toothSelection.style.display = "none";
        clickerScreen.style.display = "block";

        startGame();
    });
});

// Запуск игры
function startGame() {
    clicks = 0;
    timeLeft = 10;
    gameActive = true;

    clickCountEl.textContent = clicks;
    timerEl.textContent = timeLeft;
    progressBar.style.width = "0%";

    // Таймер
    timer = setInterval(() => {
        timeLeft--;
        timerEl.textContent = timeLeft;

        if (timeLeft <= 0) {
            endGame(false);
        }
    }, 1000);

    // Клик по кнопке
    clickButton.onclick = () => {
        if (!gameActive) return;

        clicks++;
        clickCountEl.textContent = clicks;
        const progress = (clicks / targetClicks) * 100;
        progressBar.style.width = progress + "%";

        if (clicks >= targetClicks) {
            endGame(true);
        }
    };
}

// Завершение игры
function endGame(win) {
    clearInterval(timer);
    gameActive = false;
    clickerScreen.style.display = "none";
    resultScreen.style.display = "block";

    if (win) {
        resultMessage.textContent = "🎉 Зуб вырван! Победа!";
        resultMessage.style.color = "#2e7d32";
    } else {
        resultMessage.textContent = "😭 Ты проиграл! Не успел!";
        resultMessage.style.color = "#c62828";
    }

    // Отправляем результат в Telegram
    if (window.Telegram && Telegram.WebApp) {
        Telegram.WebApp.sendData(JSON.stringify({
            success: win,
            clicks: clicks,
            timeLeft: timeLeft
        }));
    }
}

// Кнопка "Играть снова"
playAgainBtn.addEventListener("click", () => {
    resultScreen.style.display = "none";
    toothSelection.style.display = "block";
});