/* ========= Configuración de dificultad ========= */
const DIFFICULTY = {
    easy: { swaps: 6, speed: 900 },
    normal: { swaps: 4, speed: 1200 },//12  650
    hard: { swaps: 18, speed: 450 },
    impossible: { swaps: 30, speed: 330 }
};

/* ========= Mensajes ========= */
const WRONG_MESSAGES = [
    '¡Fallaste! 😢', 'Te has equivocado.', 'No fue la opción correcta.',
    'Esta vez no acertaste.', 'Uy, no era ahí.', '¡Casi!', '¡Ni cerca, campeón!',
    'La bola estaba en otro vaso.', 'Errar es parte del juego. ¡Sigue! 💪',
    'Ánimo, la próxima lo clavas!', 'Le pifiaste!', 'Te comiste el amague.',
    'Te patinó la bocha.', '¡Te falló la puntería!', 'Te fuiste con la finta.',
    '¿Revanchita?', '¿Otra ronda para redimirte?'
];
const WIN_MESSAGES = [
    '¡Correcto! 🎉', '¡Excelente jugada!', '¡La clavaste!', '¡Bien ahí!',
    '¡Lo encontraste!', '¡Impecable!', '¡Genial, sigue así!', '¡Eso es habilidad!',
    '¡Durísimo! 💪', '¡Crack total!', '¡Maestro de la mosqueta!', '¡Te salió redondo!',
    '¡Golazo!', '¡Perfecto!', '¡Aplausos!', '¡Brillante!', '¡De diez!'
];

/* ========= Referencias DOM ========= */
const gameArea = document.querySelector('.game-board');
const cups = Array.from(document.querySelectorAll('.cup'));
const attemptsEl = document.getElementById('attempts');
const winsEl = document.getElementById('wins');
const resultEl = document.getElementById('resultBanner');
const feedbackEl = document.getElementById('feedbackBanner');
const nextEl = document.getElementById('nextBanner');
const streakEl = document.getElementById('streak');


/* ========= Estado ========= */
let currentDiff = 'normal'; // Dificultad inicial
let stage = 'hide';
let attempts = 0;
let wins = 0;
let streak = 0;
let ballIndex = null;

/* ========= Helpers ========= */
const sleep = ms => new Promise(r => setTimeout(r, ms));
const rand = arr => arr[Math.floor(Math.random() * arr.length)];

function lockBoard() { gameArea.classList.add('no-hover'); gameArea.style.pointerEvents = 'none'; }
function unlockBoard() { gameArea.classList.remove('no-hover'); gameArea.style.pointerEvents = 'auto'; }
function enableClicksOnly() { gameArea.style.pointerEvents = 'auto'; }

/* ========= Carteles ========= */
function showResult(text) {
    resultEl.textContent = text;
    resultEl.classList.remove('hidden');
    return new Promise(res => setTimeout(() => { resultEl.classList.add('hidden'); res(); }, 1000));
}
function showFeedback(win) {
    feedbackEl.textContent = win ? '¡Bien Visto!' : '¡Muy lento!';
    feedbackEl.classList.remove('hidden');
    return new Promise(res => setTimeout(() => { feedbackEl.classList.add('hidden'); res(); }, 1000));
}
function showNextBanner() {
    lockBoard();
    nextEl.classList.remove('hidden');
    return new Promise(res => setTimeout(() => {
        nextEl.classList.add('hidden');
        unlockBoard();
        res();
    }, 1000));
}

/* ========= Inicialización ========= */
cups.forEach(c => c.addEventListener('click', handleCupClick));
initDifficultyMenu();

/* ========= Lógica principal ========= */
async function handleCupClick(e) {
    if (stage === 'shuffling') return;

    const cup = e.currentTarget;
    const idx = cups.indexOf(cup);

    /* Animación instantánea de levantar */
    cup.classList.remove('raise', 'lower'); void cup.offsetWidth;
    cup.classList.add('raise');

    /* -------- Etapa 1: esconder la pelota -------- */
    if (stage === 'hide') {
        lockBoard();
        ballIndex = idx;
        await liftCup(cup, true);

        stage = 'shuffling';
        gameArea.classList.add('shuffling');
        await sleep(300);
        await mixCups();
        gameArea.classList.remove('shuffling');

        enableClicksOnly();
        stage = 'guess';
        return;
    }

    if (stage === 'guess') {
        lockBoard();
        attempts++; attemptsEl.textContent = `Intentos: ${attempts}`;

        const win = idx === ballIndex;

        if (win) {
            wins++; winsEl.textContent = `Ganados: ${wins}`;
            streak++; streakEl.textContent = `Racha: ${streak}`;
            await liftCup(cup, true);
            await showResult(rand(WIN_MESSAGES));
        } else {
            streak = 0; streakEl.textContent = 'Racha: 0';
            await Promise.all([
                liftCup(cup, false),
                liftCup(cups[ballIndex], true)
            ]);
            await showResult(rand(WRONG_MESSAGES));
        }

        await showFeedback(win);
        await showNextBanner();
        resetRound();
    }

}

/* ========= Animaciones de vasos ========= */
async function liftCup(cup, showBall) {
    cup.classList.remove('lower', 'cover');
    cup.classList.add('raise');
    if (showBall) cup.classList.add('show-ball');

    await sleep(400);

    cup.classList.remove('raise');
    cup.classList.add('cover');
    await sleep(500);

    cup.classList.remove('cover');
    if (showBall) cup.classList.remove('show-ball');
}

async function mixCups() {
    const { swaps, speed } = DIFFICULTY[currentDiff];
    for (let n = 0; n < swaps; n++) {
        let i = Math.floor(Math.random() * 3);
        let j; do { j = Math.floor(Math.random() * 3); } while (j === i);
        await animateSwap(i, j, speed);
        if (ballIndex === i) ballIndex = j; else if (ballIndex === j) ballIndex = i;
    }
}
function animateSwap(i, j, duration) {
    return new Promise(res => {
        const A = cups[i], B = cups[j];
        const dx = B.getBoundingClientRect().left - A.getBoundingClientRect().left;
        [A, B].forEach(el => el.style.transition = `transform ${duration}ms`);
        A.style.transform = `translateX(${dx}px)`;
        B.style.transform = `translateX(${-dx}px)`;
        setTimeout(() => {
            [A, B].forEach(el => { el.style.transition = ''; el.style.transform = ''; });
            if (dx > 0) A.after(B); else B.after(A);
            [cups[i], cups[j]] = [cups[j], cups[i]];
            res();
        }, duration);
    });
}

/* ========= Reinicio de ronda ========= */
function resetRound() {
    stage = 'hide';
    cups.forEach(c => {
        c.classList.remove('raise', 'show-ball');
        c.classList.add('lower');
        setTimeout(() => c.classList.remove('lower'), 800);
    });
}

/* ========= Menú de dificultad ========= */
function initDifficultyMenu() {
    const btn = document.getElementById('difficultyBtn');
    const menu = document.getElementById('difficultyMenu');

    btn.addEventListener('click', () => {
        const ex = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', !ex);
        menu.classList.toggle('hidden');
    });

    menu.addEventListener('click', e => {
        if (e.target.matches('[data-level]')) {
            currentDiff = e.target.dataset.level;
            btn.textContent = `Dificultad: ${e.target.textContent} ▾`;
            menu.classList.add('hidden');
            btn.setAttribute('aria-expanded', 'false');
        }
    });

    document.addEventListener('click', e => {
        if (!menu.contains(e.target) && e.target !== btn) {
            menu.classList.add('hidden');
            btn.setAttribute('aria-expanded', 'false');
        }
    });
}