// Lógica de selección, temporizador y control de pares

let timerInterval; // Intervalo del temporizador
let startTime;     // Marca de tiempo de inicio
let matches = 0;   // Contador de pares encontrados
let attempts = 0;  // Contador de intentos realizados
const totalPairs = 12; // Total de pares en el juego

// Referencias al DOM
const timerEl = document.getElementById('timer');           // Elemento del temporizador
const matchesEl = document.getElementById('matches');       // Elemento de pares encontrados
const attemptsEl = document.getElementById('intenos');      // Elemento de intentos
const boardEl = document.querySelector('.game-board');      // Tablero de juego
const restartBtn = document.getElementById('restart-btn');  // Botón de reinicio
const winModal = document.getElementById('win-modal');      // Modal de victoria
const finalTimeEl = document.getElementById('final-time');  // Elemento para mostrar el tiempo final
const playAgainBtn = document.getElementById('play-again-btn'); // Botón para jugar de nuevo
const homeBtn = document.getElementById('home-btn'); // Para navegación al inicio

// Inicialización del juego
function initGame() {
    // Reiniciar contadores
    matches = 0;
    attempts = 0; // Reiniciar intentos
    matchesEl.textContent = `Pares: ${matches}`;
    attemptsEl.textContent = `Intentos: ${attempts}`; // Actualizar display de intentos
    resetTimer();
    startTimer();
    winModal.classList.add('hidden');

    // Reiniciar estado del juego
    firstCard = null;
    secondCard = null;
    lockBoard = false;

    // Generar cartas aleatorias y agregarlas al tablero
    const cards = generateDeck();
    boardEl.innerHTML = '';
    cards.forEach(cardData => boardEl.appendChild(createCardElement(cardData)));
}

// Genera array de 24 cartas mezcladas (12 pares)
function generateDeck() {
    const deck = [];
    for (let i = 1; i <= 12; i++) {
        deck.push({ id: `copa-${i}`, value: i });
        deck.push({ id: `copa-${i}`, value: i });
    }
    return shuffle(deck);
}

// Fisher–Yates shuffle (algoritmo de mezclado)
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Crea elemento DOM de carta
function createCardElement({ value }) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.value = value;

    // Estructura de la carta: frente y reves 
    card.innerHTML = `
<div class="card-inner">
        <div class="card-front"></div>
        <div class="card-back" style="background: url(./imagenes/cartas-diseño-con-el-logo/diseño-pagina-${value}.png) center/contain no-repeat;"></div>
    </div>`;

    card.addEventListener('click', onCardClick);
    return card;
}

// === LÓGICA DE SELECCIÓN DE CARTAS ===

let firstCard = null;   // Primera carta seleccionada
let secondCard = null;  // Segunda carta seleccionada
let lockBoard = false;  // Bloquea el tablero mientras se resuelven pares

// Maneja el clic en una carta
function onCardClick(e) {
    const clicked = e.currentTarget;

    // Prevenir selección si ya fue volteada, es la misma carta o el tablero está bloqueado
    if (lockBoard || clicked === firstCard || clicked.classList.contains('flipped')) return;

    clicked.classList.add('flipped');

    if (!firstCard) {
        firstCard = clicked;
        return;
    }

    secondCard = clicked;
    lockBoard = true;
    attempts++; // Incrementar intentos cuando se selecciona la segunda carta
    attemptsEl.textContent = `Intentos: ${attempts}`; // Actualizar display

    // Comparar valores de las cartas
    if (firstCard.dataset.value === secondCard.dataset.value) {
        matches++;
        matchesEl.textContent = `Pares: ${matches}`;
        disableMatchedCards();
        if (matches === totalPairs) showWinModal();
    } else {
        unflipCards();
    }
}

// Deshabilita las cartas que han sido emparejadas
function disableMatchedCards() {
    firstCard.removeEventListener('click', onCardClick);
    secondCard.removeEventListener('click', onCardClick);
    resetTurn();
}

// Voltea las cartas si no son iguales
function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetTurn();
    }, 1000);
}

// Reinicia la selección de cartas
function resetTurn() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}

// Temporizador en formato mm:ss
function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const minutes = String(Math.floor(elapsed / 60000)).padStart(2, '0');
        const seconds = String(Math.floor((elapsed % 60000) / 1000)).padStart(2, '0');
        timerEl.textContent = `Tiempo ${minutes}:${seconds}`;
    }, 500);
}

// Reinicia el temporizador
function resetTimer() {
    clearInterval(timerInterval);
    timerEl.textContent = '00:00';
}

// Muestra el modal de victoria
function showWinModal() {
    clearInterval(timerInterval);
    finalTimeEl.textContent = timerEl.textContent;
    // Agregar el número de intentos al modal
    const modalContent = document.querySelector('.modal-content');
    // Eliminar cualquier intento previo agregado
    const prevAttempts = modalContent.querySelector('.attempts-info');
    if (prevAttempts) prevAttempts.remove();
    const attemptsInfo = document.createElement('p');
    attemptsInfo.className = 'attempts-info';
    attemptsInfo.textContent = `Intentos realizados: ${attempts}`;
    modalContent.insertBefore(attemptsInfo, modalContent.querySelector('#play-again-btn'));
    winModal.classList.remove('hidden');
}

// Eventos de botones
restartBtn.addEventListener('click', initGame);
playAgainBtn.addEventListener('click', initGame);

if (homeBtn) {
    homeBtn.addEventListener('click', function() {
        window.location.href = '../pagina-principal/inicio.php#inicio';
    });
}

// Arrancar el juego al cargar la página
window.addEventListener('load', initGame);
