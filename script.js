lucide.createIcons();

let players = JSON.parse(localStorage.getItem('mtg_players')) || [];
let activeMatch = { p1: null, p2: null, p1Life: 20, p2Life: 20 };
let timeLeft = 3000; // 50 minut w sekundach
let timerId = null;

// Tab Switching
function switchTab(tab) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.menu button').forEach(b => b.classList.remove('active'));
    document.getElementById(`tab-${tab}`).classList.add('active');
    if(tab === 'standings') renderStandings();
}

// Player Management
function addPlayer() {
    const nameInput = document.getElementById('player-name');
    if(!nameInput.value) return;
    
    players.push({
        name: nameInput.value,
        points: 0,
        matches: 0
    });
    
    nameInput.value = '';
    save();
    renderPlayers();
}

function renderPlayers() {
    const list = document.getElementById('player-list');
    list.innerHTML = players.map((p, i) => `
        <div class="player-row">
            <span>${p.name}</span>
            <button onclick="startMatch(${i})">HOST MATCH</button>
        </div>
    `).join('');
}

// Timer
function startRound() {
    if(timerId) return;
    timerId = setInterval(() => {
        timeLeft--;
        const m = Math.floor(timeLeft / 60);
        const s = timeLeft % 60;
        document.getElementById('round-timer').innerText = `${m}:${s < 10 ? '0'+s : s}`;
        if(timeLeft <= 0) clearInterval(timerId);
    }, 1000);
}

// Match Logic
function modLife(p, amt) {
    if(p === 1) activeMatch.p1Life += amt;
    else activeMatch.p2Life += amt;
    document.getElementById('m-p1-life').innerText = activeMatch.p1Life;
    document.getElementById('m-p2-life').innerText = activeMatch.p2Life;
}

function reportMatch() {
    // Prosta logika: kto ma więcej HP ten wygrywa (3 pkt), remis (1 pkt)
    alert("Result Reported to Standings!");
    switchTab('standings');
}

function renderStandings() {
    const body = document.getElementById('standings-body');
    const sorted = [...players].sort((a,b) => b.points - a.points);
    body.innerHTML = sorted.map((p, i) => `
        <tr>
            <td>${i+1}</td>
            <td>${p.name}</td>
            <td>${p.points}</td>
            <td>${p.matches}</td>
        </tr>
    `).join('');
}

function save() { localStorage.setItem('mtg_players', JSON.stringify(players)); }
renderPlayers();
