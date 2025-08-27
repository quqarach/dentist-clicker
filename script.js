// Telegram WebApp
if (window.Telegram && Telegram.WebApp) {
    Telegram.WebApp.ready();
}

// Элементы
const painLocation = document.getElementById("pain-location");
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
let selectedLocation = "";
let selectedTooth = "";
let isHealthyTooth = false;

// Выбор локации боли
document.querySelectorAll(".pain-option").forEach(option => {
    option.addEventListener("click", () => {
        selectedLocation = option.dataset.location;
        console.log("Выбрана локация боли:", selectedLocation);

        painLocation.style.display = "none";
        toothSelection.style.display = "block";
    });
});

// Выбор зуба
document.querySelectorAll(".tooth").forEach(tooth => {
    tooth.addEventListener("click", () => {
        selectedTooth = tooth.dataset.tooth;
        // Определяем, здоровый ли зуб (data-tooth="1" - здоровый)
        isHealthyTooth = selectedTooth === "1";
        console.log("Выбран зуб:", selectedTooth, "в локации:", selectedLocation, "Здоровый:", isHealthyTooth);

        // Анимация выбора
        tooth.classList.add("selected");
        setTimeout(() => {
            tooth.classList.remove("selected");
        }, 500);

        setTimeout(() => {
            toothSelection.style.display = "none";
            clickerScreen.style.display = "block";
            startGame();
        }, 600);
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

        // Анимация кнопки
        clickButton.style.transform = "scale(0.95)";
        setTimeout(() => {
            clickButton.style.transform = "scale(1)";
        }, 100);

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
        if (isHealthyTooth) {
            resultMessage.textContent = "😱 Ай-ай-ай! Вы удалили здоровый зуб! Так нельзя!";
            resultMessage.style.color = "#ff6b00";
        } else {
            resultMessage.textContent = "🎉 Зуб вырван! Победа! Пациент спасен!";
            resultMessage.style.color = "#2e7d32";
        }
    } else {
        if (isHealthyTooth) {
            resultMessage.textContent = "😅 Фух! Вы не успели удалить здоровый зуб!";
            resultMessage.style.color = "#1976d2";
        } else {
            resultMessage.textContent = "😭 Ты проиграл! Не успел вырвать больной зуб!";
            resultMessage.style.color = "#c62828";
        }
    }

    // Отправляем результат в Telegram
    if (window.Telegram && Telegram.WebApp) {
        Telegram.WebApp.sendData(JSON.stringify({
            success: win,
            clicks: clicks,
            timeLeft: timeLeft,
            painLocation: selectedLocation,
            toothType: selectedTooth,
            wasHealthy: isHealthyTooth
        }));
    }
}

// Кнопка "Играть снова"
playAgainBtn.addEventListener("click", () => {
    resultScreen.style.display = "none";
    painLocation.style.display = "block";
    selectedLocation = "";
    selectedTooth = "";
    isHealthyTooth = false;
});