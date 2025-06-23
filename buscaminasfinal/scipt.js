const board = document.getElementById('board');
const mineCountDisplay = document.getElementById('mine-count');
const timerDisplay = document.getElementById('timer');
const resetButton = document.getElementById('reset-button');
const easyBtn = document.getElementById('easy-btn');
const mediumBtn = document.getElementById('medium-btn');
const hardBtn = document.getElementById('hard-btn');
const winModal = document.getElementById('win-modal');
const modalTitle = document.getElementById('modal-title');
const modalMessage = document.getElementById('modal-message');
const playAgainBtn = document.getElementById('play-again-btn');

let rows, cols, mines;
let grid = [];
let revealedCells = 0;
let gameStarted = false;
let gameOver = false;
let timerInterval;
let timeElapsed = 0;
let flagsPlaced = 0;
let currentDifficulty = 'easy'; // Dificultad inicial

// Definimos los parámetros de dificultad, incluyendo tamaño de celda y fuente
const difficulties = {
    easy: { rows: 8, cols: 8, mines: 10, cellSize: 45, fontSize: '1.8em', iconSize: '1.4em' }, // Más grande para fácil
    medium: { rows: 16, cols: 16, mines: 40, cellSize: 28, fontSize: '1.2em', iconSize: '1em' }, // Ajustado para que quepa
    hard: { rows: 16, cols: 30, mines: 99, cellSize: 22, fontSize: '0.9em', iconSize: '0.8em' } // Ajustado para que quepa
};

function setDifficulty(difficulty) {
    currentDifficulty = difficulty;
    rows = difficulties[difficulty].rows;
    cols = difficulties[difficulty].cols;
    mines = difficulties[difficulty].mines;

    // Ajustar el tamaño de las celdas y la fuente a través de variables CSS
    document.documentElement.style.setProperty('--cell-size', `${difficulties[difficulty].cellSize}px`);
    document.documentElement.style.setProperty('--font-size', difficulties[difficulty].fontSize);
    document.documentElement.style.setProperty('--icon-size', difficulties[difficulty].iconSize);

    // Actualizar botones de dificultad
    easyBtn.classList.remove('active');
    mediumBtn.classList.remove('active');
    hardBtn.classList.remove('active');
    document.getElementById(`${difficulty}-btn`).classList.add('active');

    newGame();
}

function createBoard() {
    board.innerHTML = '';
    board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    board.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

    grid = Array(rows).fill(0).map(() => Array(cols).fill(0)); // Inicializar con 0s

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell', 'hidden');
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.addEventListener('click', handleCellClick);
            cell.addEventListener('contextmenu', handleCellRightClick); // Clic derecho
            board.appendChild(cell);
        }
    }
}

function placeMines(initialRow, initialCol) {
    let minesPlaced = 0;
    while (minesPlaced < mines) {
        const r = Math.floor(Math.random() * rows);
        const c = Math.floor(Math.random() * cols);

        // Evitar colocar mina en la primera celda clicada y sus adyacentes
        if (grid[r][c] !== 'mine' &&
            !(Math.abs(r - initialRow) <= 1 && Math.abs(c - initialCol) <= 1)) {
            grid[r][c] = 'mine';
            minesPlaced++;
        }
    }
}

function calculateAdjacentMines() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c] !== 'mine') {
                let count = 0;
                for (let dr = -1; dr <= 1; dr++) {
                    for (let dc = -1; dc <= 1; dc++) {
                        const nr = r + dr;
                        const nc = c + dc;
                        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === 'mine') {
                            count++;
                        }
                    }
                }
                grid[r][c] = count;
            }
        }
    }
}

function startGame(initialRow, initialCol) {
    gameStarted = true;
    placeMines(initialRow, initialCol);
    calculateAdjacentMines();
    startTimer();
}

function handleCellClick(event) {
    if (gameOver) return;

    const cell = event.target;
    const r = parseInt(cell.dataset.row);
    const c = parseInt(cell.dataset.col);

    if (!gameStarted) {
        startGame(r, c);
    }

    if (cell.classList.contains('revealed') || cell.classList.contains('flag')) {
        if (cell.classList.contains('revealed') && cell.textContent !== '' && !isNaN(parseInt(cell.textContent))) {
            const adjacentMinesCount = parseInt(cell.textContent);
            let adjacentFlags = 0;
            const neighbors = getNeighbors(r, c);
            for (const { nr, nc } of neighbors) {
                const neighborCell = board.querySelector(`.cell[data-row="${nr}"][data-col="${nc}"]`);
                if (neighborCell && neighborCell.classList.contains('flag')) {
                    adjacentFlags++;
                }
            }

            if (adjacentFlags === adjacentMinesCount) {
                for (const { nr, nc } of neighbors) {
                    const neighborCell = board.querySelector(`.cell[data-row="${nr}"][data-col="${nc}"]`);
                    if (neighborCell && neighborCell.classList.contains('hidden') && !neighborCell.classList.contains('flag')) {
                        revealCell(nr, nc);
                    }
                }
            }
        }
        return;
    }

    revealCell(r, c);
}

function handleCellRightClick(event) {
    event.preventDefault(); // Evitar menú contextual del navegador
    if (gameOver) return;

    const cell = event.target;
    const r = parseInt(cell.dataset.row);
    const c = parseInt(cell.dataset.col);

    if (cell.classList.contains('revealed')) return;

    if (cell.classList.contains('flag')) {
        cell.classList.remove('flag');
        cell.classList.add('question');
        flagsPlaced--;
    } else if (cell.classList.contains('question')) {
        cell.classList.remove('question');
    } else if (flagsPlaced < mines) { // Solo si quedan banderas por colocar
        cell.classList.add('flag');
        flagsPlaced++;
    }
    updateMineCountDisplay();
}

function revealCell(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= cols) return; // Fuera de límites
    const cell = board.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);

    if (!cell || cell.classList.contains('revealed') || cell.classList.contains('flag')) {
        return;
    }

    cell.classList.remove('hidden', 'question');
    cell.classList.add('revealed');
    revealedCells++;

    const cellValue = grid[r][c];

    if (cellValue === 'mine') {
        cell.classList.add('mine', 'exploded-mine');
        endGame(false, r, c); // Perdió el juego
        return;
    } else if (cellValue > 0) {
        cell.textContent = cellValue;
        cell.dataset.mines = cellValue; // Almacenar el número para el color
    } else { // Celda vacía (0 minas adyacentes)
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dr !== 0 || dc !== 0) { // No la misma celda
                    revealCell(r + dr, c + dc);
                }
            }
        }
    }
    checkWin();
}

function getNeighbors(r, c) {
    const neighbors = [];
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            if (dr !== 0 || dc !== 0) {
                const nr = r + dr;
                const nc = c + dc;
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                    neighbors.push({ nr, nc });
                }
            }
        }
    }
    return neighbors;
}

function checkWin() {
    // El juego se gana cuando todas las celdas no minadas son reveladas
    if (revealedCells === (rows * cols) - mines) {
        endGame(true);
    }
}

function endGame(won, explodedRow, explodedCol) {
    gameOver = true;
    clearInterval(timerInterval);

    if (won) {
        modalTitle.textContent = '¡Victoria!';
        modalMessage.innerHTML = `¡Has despejado el campo en <span style="font-weight:bold; color: #ff4fa3;">${timeElapsed} segundos</span>!`;
        winModal.classList.remove('hidden');

        mineCountDisplay.textContent = '000'; // Todas las minas están "marcadas"
        // Auto-marcar minas no reveladas
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const cell = board.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
                if (grid[r][c] === 'mine' && !cell.classList.contains('flag')) {
                    cell.classList.add('flag');
                }
                // También mostrar minas correctas marcadas con bandera
                if (grid[r][c] === 'mine' && cell.classList.contains('flag')) {
                    cell.classList.remove('hidden', 'question');
                    cell.classList.add('revealed', 'mine'); // Revelar visualmente la mina marcada correctamente
                    cell.textContent = '✔️'; // O un icono de check para éxito
                }
            }
        }
    } else {
        modalTitle.textContent = '¡Derrota!';
        modalMessage.innerHTML = `¡Oh, no! Has explotado una mina en <span style="font-weight:bold; color: #ff4fa3;">${timeElapsed} segundos</span>.`;
        winModal.classList.remove('hidden');

        // Mostrar todas las minas
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const cell = board.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
                if (grid[r][c] === 'mine' && !cell.classList.contains('exploded-mine')) {
                    if (!cell.classList.contains('flag')) { // Si no es una bandera, mostrar la mina
                        cell.classList.remove('hidden', 'question');
                        cell.classList.add('revealed', 'mine');
                    }
                } else if (cell.classList.contains('flag') && grid[r][c] !== 'mine') {
                    // Mostrar X en banderas mal colocadas
                    cell.classList.remove('flag');
                    cell.classList.add('mine'); // Reutilizamos 'mine' para darle un fondo rojo
                    cell.textContent = '❌'; // Símbolo de X
                }
            }
        }
    }
}

function startTimer() {
    timeElapsed = 0;
    timerDisplay.textContent = '000';
    timerInterval = setInterval(() => {
        timeElapsed++;
        if (timeElapsed > 999) { // Limitar a 999 segundos
            timeElapsed = 999;
            clearInterval(timerInterval);
        }
        timerDisplay.textContent = String(timeElapsed).padStart(3, '0');
    }, 1000);
}

function updateMineCountDisplay() {
    const remainingMines = mines - flagsPlaced;
    mineCountDisplay.textContent = String(remainingMines).padStart(3, '0');
}

function newGame() {
    clearInterval(timerInterval);
    gameStarted = false;
    gameOver = false;
    timeElapsed = 0;
    revealedCells = 0;
    flagsPlaced = 0;
    timerDisplay.textContent = '000';
    updateMineCountDisplay(); // Inicializar el conteo de minas
    createBoard();
    winModal.classList.add('hidden'); // Ocultar el modal si estaba visible
}

// Event listeners para los botones de dificultad
easyBtn.addEventListener('click', () => setDifficulty('easy'));
mediumBtn.addEventListener('click', () => setDifficulty('medium'));
hardBtn.addEventListener('click', () => setDifficulty('hard'));
resetButton.addEventListener('click', newGame);
playAgainBtn.addEventListener('click', newGame); // Botón "Jugar de Nuevo" del modal

// Inicializar el juego al cargar la página con la dificultad predeterminada
setDifficulty(currentDifficulty);