// Selección de elementos del DOM
const board = document.getElementById('board');
const mineCountDisplay = document.getElementById('mine-count');
const timerDisplay = document.getElementById('timer');
const resetButton = document.getElementById('reset-button');
const easyBtn = document.getElementById('easy-btn');
const mediumBtn = document.getElementById('medium-btn');
const hardBtn = document.getElementById('hard-btn');

// Elementos del modal
const winModal = document.getElementById('win-modal');
const modalTitle = document.getElementById('modal-title');
const finalTimeDisplay = document.getElementById('final-time');
const modalMinesDisplay = document.getElementById('modal-mines');
const playAgainButton = document.getElementById('play-again-button');

// Variables del juego
let rows, cols, mines;
let grid = [];
let revealedCells = 0;
let gameStarted = false;
let gameOver = false;
let timerInterval;
let timeElapsed = 0;
let flagsPlaced = 0;
let currentDifficulty = 'easy';

// Configuraciones de dificultad
const difficulties = {
    easy: { rows: 8, cols: 8, mines: 10, cellSize: 40, fontSize: '1.5em' },
    medium: { rows: 16, cols: 16, mines: 40, cellSize: 28, fontSize: '1.2em' },
    hard: { rows: 16, cols: 30, mines: 99, cellSize: 20, fontSize: '0.9em' }
};

// Función para establecer la dificultad
function setDifficulty(difficulty) {
    currentDifficulty = difficulty;
    const config = difficulties[difficulty];
    rows = config.rows;
    cols = config.cols;
    mines = config.mines;

    // Aplicar estilos de tamaño al elemento raíz (html) y al tablero
    document.documentElement.style.setProperty('--cell-size', `${config.cellSize}px`);
    document.documentElement.style.setProperty('--font-size', config.fontSize);

    // Calcular tamaño del tablero
    const boardWidth = cols * config.cellSize + 8; // +8 por el padding y bordes del #board
    const boardHeight = rows * config.cellSize + 8;
    
    board.style.width = `${boardWidth}px`;
    board.style.height = `${boardHeight}px`;
    board.style.gridTemplateColumns = `repeat(${cols}, var(--cell-size))`;
    board.style.gridTemplateRows = `repeat(${rows}, var(--cell-size))`;

    // Actualizar botones de dificultad
    easyBtn.classList.remove('active');
    mediumBtn.classList.remove('active');
    hardBtn.classList.remove('active');
    document.getElementById(`${difficulty}-btn`).classList.add('active');

    newGame();
}

// Crear el tablero
function createBoard() {
    board.innerHTML = ''; // Limpiar tablero existente
    grid = Array(rows).fill().map(() => Array(cols).fill(0));

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const cell = document.createElement('div');
            cell.className = 'cell hidden'; // Todas las celdas inician ocultas
            cell.dataset.row = r;
            cell.dataset.col = c;
            
            // Asegurar que el contenido (emoji/número) sea visible y centrado
            cell.style.display = 'flex';
            cell.style.justifyContent = 'center';
            cell.style.alignItems = 'center';
            
            cell.addEventListener('click', handleCellClick);
            cell.addEventListener('contextmenu', handleCellRightClick);
            board.appendChild(cell);
        }
    }
}

// Colocar minas en el tablero
function placeMines(initialRow, initialCol) {
    let minesPlaced = 0;
    while (minesPlaced < mines) {
        const r = Math.floor(Math.random() * rows);
        const c = Math.floor(Math.random() * cols);

        // No colocar minas en la celda inicial ni en sus 8 adyacentes (3x3 seguro)
        if (grid[r][c] !== 'mine' && 
            !(Math.abs(r - initialRow) <= 1 && Math.abs(c - initialCol) <= 1)) {
            grid[r][c] = 'mine';
            minesPlaced++;
        }
    }
}

// Calcular minas adyacentes a cada celda
function calculateAdjacentMines() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c] !== 'mine') { // Solo si no es una mina
                let count = 0;
                // Revisar las 8 celdas alrededor
                for (let dr = -1; dr <= 1; dr++) {
                    for (let dc = -1; dc <= 1; dc++) {
                        const nr = r + dr; // Neighbor row
                        const nc = c + dc; // Neighbor col
                        // Asegurarse de que la celda vecina esté dentro del tablero y sea una mina
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

// Iniciar el juego
function startGame(initialRow, initialCol) {
    gameStarted = true;
    placeMines(initialRow, initialCol);
    calculateAdjacentMines();
    startTimer();
}

// Manejar clic en celda
function handleCellClick(event) {
    if (gameOver) return; // Si el juego terminó, no hacer nada

    const cell = event.target;
    const r = parseInt(cell.dataset.row);
    const c = parseInt(cell.dataset.col);

    if (!gameStarted) {
        startGame(r, c); // Si es el primer clic, iniciar el juego
    }

    // Si la celda ya está revelada o es una bandera, no hacer nada (excepto chord)
    if (cell.classList.contains('revealed')) {
        // Implementación de la "Chord" (revelar adyacentes si num banderas = num minas)
        if (cell.textContent !== '') { // Si la celda revelada tiene un número
            const adjacentMines = parseInt(cell.dataset.mines); // El número de minas adyacentes
            if (isNaN(adjacentMines) || adjacentMines === 0) return; // No es un número o es 0

            let adjacentFlags = 0;
            const neighbors = getNeighbors(r, c);
            for (const { nr, nc } of neighbors) {
                const neighborCell = board.querySelector(`.cell[data-row="${nr}"][data-col="${nc}"]`);
                if (neighborCell && neighborCell.classList.contains('flag')) {
                    adjacentFlags++;
                }
            }

            // Si el número de banderas alrededor coincide con el número de minas adyacentes
            if (adjacentFlags === adjacentMines) {
                for (const { nr, nc } of neighbors) {
                    const neighborCell = board.querySelector(`.cell[data-row="${nr}"][data-col="${nc}"]`);
                    // Revelar solo las celdas ocultas que no tienen bandera
                    if (neighborCell && neighborCell.classList.contains('hidden') && !neighborCell.classList.contains('flag')) {
                        revealCell(nr, nc);
                    }
                }
            }
        }
        return; // Detener la ejecución si ya estaba revelada
    }

    if (cell.classList.contains('flag')) return; // No revelar si es una bandera

    revealCell(r, c); // Revelar la celda al hacer clic
}

// Manejar clic derecho (banderas y signo de interrogación)
function handleCellRightClick(event) {
    event.preventDefault(); // Prevenir el menú contextual del navegador
    if (gameOver) return;

    const cell = event.target;
    // No permitir banderas en celdas ya reveladas
    if (cell.classList.contains('revealed')) return;

    if (cell.classList.contains('flag')) {
        // Si ya tiene bandera, quitarla y poner signo de interrogación
        cell.classList.remove('flag');
        cell.classList.add('question');
        cell.textContent = '?';
        flagsPlaced--;
    } else if (cell.classList.contains('question')) {
        // Si tiene signo de interrogación, quitarlo (dejar celda vacía/oculta)
        cell.classList.remove('question');
        cell.textContent = '';
    } else if (flagsPlaced < mines) {
        // Si no tiene nada y quedan banderas, poner bandera
        cell.classList.add('flag');
        cell.textContent = '🚩';
        flagsPlaced++;
    }
    updateMineCountDisplay(); // Actualizar el contador de minas restantes
}

// Revelar una celda
function revealCell(r, c) {
    // Validar que las coordenadas estén dentro del tablero
    if (r < 0 || r >= rows || c < 0 || c >= cols) return;

    const cell = board.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
    // Si la celda ya está revelada o es una bandera, no hacer nada
    if (!cell || cell.classList.contains('revealed') || cell.classList.contains('flag')) return;

    cell.classList.remove('hidden', 'question'); // Quitar clases de oculta/pregunta
    cell.classList.add('revealed'); // Añadir clase de revelada
    cell.textContent = ''; // Limpiar texto previo (bandera, ?)
    revealedCells++; // Incrementar contador de celdas reveladas

    // Asegurar que el contenido sea visible y centrado (aunque ya está en CSS general del .cell)
    cell.style.display = 'flex';
    cell.style.justifyContent = 'center';
    cell.style.alignItems = 'center';

    if (grid[r][c] === 'mine') {
        // Si es una mina, el juego termina
        cell.classList.add('mine', 'exploded-mine'); // Añadir clases para estilo de mina explotada
        cell.textContent = '💣'; // Mostrar icono de bomba
        endGame(false); // Terminar juego (perdió)
        return;
    } else if (grid[r][c] > 0) {
        // Si es un número (minas adyacentes > 0)
        cell.textContent = grid[r][c]; // Mostrar el número
        cell.dataset.mines = grid[r][c]; // Guardar el número en un data-attribute para CSS
    } else {
        // Si es una celda vacía (0 minas adyacentes), revelar celdas adyacentes recursivamente
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dr !== 0 || dc !== 0) { // Excluir la celda actual
                    revealCell(r + dr, c + dc); // Llamada recursiva
                }
            }
        }
    }
    
    checkWin(); // Verificar si el jugador ganó después de cada revelación
}

// Obtener celdas vecinas (utilizado para la función chord)
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

// Verificar si el jugador ganó
function checkWin() {
    // El jugador gana si todas las celdas que NO son minas han sido reveladas
    if (revealedCells === (rows * cols) - mines) {
        endGame(true); // Terminar juego (ganó)
    }
}

// Finalizar el juego
function endGame(won) {
    gameOver = true;
    clearInterval(timerInterval); // Detener el temporizador

    // Desactivar eventos en todas las celdas para evitar más interacciones
    document.querySelectorAll('.cell').forEach(cell => {
        cell.removeEventListener('click', handleCellClick);
        cell.removeEventListener('contextmenu', handleCellRightClick);
    });

    if (won) {
        modalTitle.textContent = '¡VICTORIA!';
        finalTimeDisplay.textContent = String(timeElapsed).padStart(3, '0');
        modalMinesDisplay.textContent = mines;
        winModal.classList.remove('hidden'); // Mostrar el modal de victoria

        // Comportamiento de Google al ganar:
        // Solo revela las minas no marcadas con el icono de bomba,
        // manteniendo las banderas que el jugador haya colocado.
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const cell = board.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
                if (grid[r][c] === 'mine') {
                    // Si es una mina y NO tiene una bandera puesta por el jugador
                    if (!cell.classList.contains('flag')) {
                        cell.classList.remove('hidden', 'question'); // Quitar oculto/pregunta
                        cell.classList.add('revealed', 'mine'); // Revelar como mina
                        cell.textContent = '💣'; // Mostrar icono de la bomba
                    }
                    // Si ya tenía una bandera (porque el jugador la puso), se mantiene como está
                }
            }
        }
        mineCountDisplay.textContent = '000'; // Todas las minas han sido "encontradas"
    } else {
        resetButton.textContent = '💀'; // Cambiar el botón de reinicio a una calavera
        // Mostrar todas las minas y las banderas incorrectas al perder
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const cell = board.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
                if (grid[r][c] === 'mine') {
                    // Revela la mina si no es la que explotó y no tiene ya una bandera
                    if (!cell.classList.contains('flag') && !cell.classList.contains('exploded-mine')) {
                        cell.classList.remove('hidden', 'question');
                        cell.classList.add('revealed', 'mine');
                        cell.textContent = '💣';
                    }
                } else if (cell.classList.contains('flag') && grid[r][c] !== 'mine') {
                    // Si hay una bandera en una celda que NO es mina (bandera incorrecta)
                    cell.classList.remove('flag'); // Quitar la bandera
                    cell.classList.add('revealed', 'wrong-flag'); // Marcar como bandera incorrecta
                    cell.textContent = '❌'; // Mostrar una "X"
                }
            }
        }
    }
}

// Iniciar temporizador
function startTimer() {
    timeElapsed = 0;
    timerDisplay.textContent = '000'; // Reiniciar visualmente el temporizador
    timerInterval = setInterval(() => {
        timeElapsed++;
        if (timeElapsed > 999) { // Limitar el temporizador a 999
            timeElapsed = 999;
            clearInterval(timerInterval);
        }
        timerDisplay.textContent = String(timeElapsed).padStart(3, '0');
    }, 1000); // Actualizar cada segundo
}

// Actualizar contador de minas restantes
function updateMineCountDisplay() {
    const remainingMines = mines - flagsPlaced;
    mineCountDisplay.textContent = String(Math.max(0, remainingMines)).padStart(3, '0');
}

// Nuevo juego
function newGame() {
    clearInterval(timerInterval); // Detener cualquier temporizador activo
    gameStarted = false;
    gameOver = false;
    timeElapsed = 0;
    revealedCells = 0;
    flagsPlaced = 0;
    resetButton.textContent = 'Reiniciar'; // Restaurar texto del botón
    timerDisplay.textContent = '000'; // Reiniciar temporizador visual
    winModal.classList.add('hidden'); // Ocultar el modal de victoria
    updateMineCountDisplay(); // Actualizar contador de minas
    createBoard(); // Recrear el tablero
}

// Event listeners para los botones
easyBtn.addEventListener('click', () => setDifficulty('easy'));
mediumBtn.addEventListener('click', () => setDifficulty('medium'));
hardBtn.addEventListener('click', () => setDifficulty('hard'));
resetButton.addEventListener('click', newGame);
playAgainButton.addEventListener('click', newGame);

// Inicializar el juego al cargar la página (establece dificultad por defecto y crea el tablero)
document.addEventListener('DOMContentLoaded', () => {
    setDifficulty(currentDifficulty); // Iniciar con la dificultad 'easy'
});
