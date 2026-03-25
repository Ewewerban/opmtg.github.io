lucide.createIcons();

let lives = { 1: 40, 2: 40 };
let timerInterval;
let seconds = 0;
let isRunning = false;
let gameHistory = JSON.parse(localStorage.getItem('mtg_history')) || [];

function adjustLife(player, amount) {
    lives[player] += amount;
    const display = document.getElementById(`life-${player}`);
    const box = document.getElementById(`box-${player}`);
    
    display.innerText = lives[player];

    // Reakcja na Zero HP
    if (lives[player] <= 0) {
        box.classList.add('dead');
    } else {
        box.classList.remove('dead');
    }
}

function toggleTimer() {
    const btn = document.getElementById('timer-btn');
    if (isRunning) {
        clearInterval(timerInterval);
        btn.innerHTML = '<i data-lucide="play"></i>';
    } else {
        timerInterval = setInterval(() => {
            seconds++;
            updateTimerDisplay();
        }, 1000);
        btn.innerHTML = '<i data-lucide="pause"></i>';
    }
    isRunning = !isRunning;
    lucide.createIcons();
}

function updateTimerDisplay() {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    document.getElementById('game-timer').innerText = `${h}:${m}:${s}`;
}

function resetGame() {
    if(confirm("Zakończyć grę i zapisać wynik?")) {
        saveMatch();
        lives = { 1: 40, 2: 40 };
        seconds = 0;
        if(isRunning) toggleTimer();
        updateTimerDisplay();
        document.getElementById('life-1').innerText = 40;
        document.getElementById('life-2').innerText = 40;
        document.querySelectorAll('.player-box').forEach(b => b.classList.remove('dead'));
    }
}

function saveMatch() {
    const winner = lives[1] > lives[2] ? "Player 1" : "Player 2";
    const match = {
        time: document.getElementById('game-timer').innerText,
        winner: winner,
        score: `${lives[1]} - ${lives[2]}`
    };
    gameHistory.push(match);
    localStorage.setItem('mtg_history', JSON.stringify(gameHistory));
}

function showHistory() {
    const body = document.getElementById('history-body');
    body.innerHTML = "";
    gameHistory.reverse().forEach(game => {
        body.innerHTML += `<tr><td>${game.time}</td><td>${game.winner}</td><td>${game.score}</td></tr>`;
    });
    document.getElementById('history-modal').style.display = "block";
}

function closeHistory() {
    document.getElementById('history-modal').style.display = "none";
}
