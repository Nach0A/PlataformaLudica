/* ======== Configuración de dificultad ======== */
const DIFFICULTY = {
    easy:       { swaps:  6, speed:  900 },
    normal:     { swaps: 12, speed:  650 },
    hard:       { swaps: 18, speed:  450 },
    impossible: { swaps: 30, speed:  330 }
};

/* ======== Referencias ======== */
const gameArea   = document.querySelector('.game-area');
const cups       = Array.from(document.querySelectorAll('.cup'));
const attemptsEl = document.getElementById('attempts');
const winsEl     = document.getElementById('wins');

/* ======== Estado ======== */
let currentDiff = 'easy';    // nivel de dificultad
let stage       = 'hide';    // hide → shuffling → guess → finished
let attempts    = 0;         // intentos totales
let wins        = 0;         // victorias totales
let ballIndex   = null;      // posición actual de la pelota

/* ======== Utilidades ======== */
const sleep = ms => new Promise(r => setTimeout(r, ms));

/* ======== Inicialización ======== */
initDifficultyMenu();
cups.forEach((cup, idx) => cup.addEventListener('click', () => handleCupClick(idx)));

/* ======== Lógica principal ======== */
async function handleCupClick(idx) {
    // Bloquea lógica si estamos mezclando
    if (stage === 'shuffling') return;

    const cup = cups[idx];

    /* Animación de feedback inmediato */
    cup.classList.remove('raise', 'lower');
    void cup.offsetWidth;
    cup.classList.add('raise');
    setTimeout(() => cup.classList.remove('raise'), 350);

    /* ───────── Etapa 1: esconder la pelota ───────── */
    if (stage === 'hide') {
        gameArea.classList.add('no-hover');     // bloquea hover desde YA
        ballIndex = idx;                        // guardo dónde quedó la pelota
        await liftCup(cup, true);               // levantamos un poco y mostramos

        stage = 'shuffling';
        gameArea.classList.add('shuffling');    // bloquea clicks + hover
        await sleep(300);                       // 0,3 s fijo
        await mixCups();                        // mezcla visible

        gameArea.classList.remove('shuffling'); // clicks vuelven (hover sigue off)
        stage = 'guess';
        return;
    }

    /* ───────── Etapa 2: adivinar ───────── */
    if (stage === 'guess') {
        attempts++;
        attemptsEl.textContent = `Intentos: ${attempts}`;

        if (idx === ballIndex) {                // ✔️ acertó
            wins++;
            winsEl.textContent = `Ganados: ${wins}`;
            await liftCup(cup, true);
        } else {                                // ❌ falló
            await liftCup(cup, false);
            await liftCup(cups[ballIndex], true);
        }

        stage = 'finished';
        await sleep(1000);
        resetRound();                           // quita .no-hover y reinicia
    }
}

/* ======== Animaciones de levantar / cubrir vaso ======== */
async function liftCup(cup, showBall) {
    // 1) Levanta el vaso
    cup.classList.remove('lower', 'cover');
    cup.classList.add('raise');
    if (showBall) cup.classList.add('show-ball');

    await sleep(400);                // vaso arriba un rato para ver la pelota
    cup.classList.remove('raise');

    // 2) Desciende con la nueva animación “cover”
    cup.classList.add('cover');
    await sleep(500);                // duración de coverBall
    cup.classList.remove('cover');

    if (showBall) cup.classList.remove('show-ball');
}


/* ======== Mezcla 2 D visible ======== */
async function mixCups() {
    const { swaps, speed } = DIFFICULTY[currentDiff];

    for (let n = 0; n < swaps; n++) {
        // selecciona dos índices distintos (0-2)
        let i = Math.floor(Math.random() * 3);
        let j;
        do { j = Math.floor(Math.random() * 3); } while (j === i);

        await animateSwap(i, j, speed);

        // si la pelota estaba en uno de los vasos, actualiza ballIndex
        if (ballIndex === i)      ballIndex = j;
        else if (ballIndex === j) ballIndex = i;
    }
}

/* Intercambio visible entre dos vasos */
function animateSwap(i, j, duration) {
    return new Promise(resolve => {
        const cupA   = cups[i];
        const cupB   = cups[j];
        const rectA  = cupA.getBoundingClientRect();
        const rectB  = cupB.getBoundingClientRect();
        const deltaX = rectB.left - rectA.left; // distancia horizontal

        // prepara transición
        [cupA, cupB].forEach(el => {
            el.style.transition = `transform ${duration}ms`;
        });

        // mueve cada vaso hacia la posición del otro
        cupA.style.transform = `translateX(${ deltaX }px)`;
        cupB.style.transform = `translateX(${ -deltaX }px)`;

        // al terminar la animación:
        setTimeout(() => {
            // limpia estilos en línea
            [cupA, cupB].forEach(el => {
                el.style.transition = '';
                el.style.transform  = '';
            });

            // reordena en el DOM para mantener la posición real
            if (deltaX > 0) cupA.after(cupB);
            else            cupB.after(cupA);

            // actualiza el array 'cups'
            [cups[i], cups[j]] = [cups[j], cups[i]];
            resolve();
        }, duration);
    });
}

/* ======== Reinicio de ronda ======== */
function resetRound() {
    stage = 'hide';
    gameArea.classList.remove('no-hover');  // reactiva hover
}

/* ======== Menú de dificultad ======== */
function initDifficultyMenu() {
    const btn  = document.getElementById('difficultyBtn');
    const menu = document.getElementById('difficultyMenu');

    btn.addEventListener('click', () => {
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', !expanded);
        menu.classList.toggle('hidden');
    });

    menu.addEventListener('click', e => {
        if (e.target.matches('[data-level]')) {
            currentDiff   = e.target.dataset.level;
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
