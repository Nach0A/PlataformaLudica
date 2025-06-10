document.addEventListener('DOMContentLoaded', () => {
    const boardContainer = document.getElementById('board-container');
    const minasRestantesSpan = document.getElementById('minas-restantes');
    const resetButton = document.getElementById('reset-button');
    const gameMessageDiv = document.getElementById('game-message');

    let gameData = {}; // Almacenará los datos del juego recibidos de PHP

    // --- Funciones de Renderizado y Actualización del DOM ---

    // Dibuja o actualiza el tablero en el HTML
    function renderBoard() {
        const { tablero, filas, columnas, juego_terminado, tablero_inicializado } = gameData;
        
        // Limpiar el tablero existente
        boardContainer.innerHTML = '';
        
        // Configurar el grid CSS para el número de columnas
        boardContainer.style.gridTemplateColumns = `repeat(${columnas}, 1fr)`;

        // Si el tablero no está inicializado (primer carga/reiniciar), mostrar celdas vacías
        // de lo contrario, renderizar el tablero con datos reales
        const displayTablero = tablero_inicializado ? tablero : Array.from({ length: filas }, () =>
            Array.from({ length: columnas }, () => ({
                mina: false,
                revelado: false,
                marcado: false,
                minas_alrededor: 0 // No importa realmente, solo para la estructura
            }))
        );

        displayTablero.forEach((fila, filaIdx) => {
            fila.forEach((celda, colIdx) => {
                const cellElement = document.createElement('div');
                cellElement.classList.add('cell');
                cellElement.dataset.fila = filaIdx;
                cellElement.dataset.columna = colIdx;

                // Solo renderizar el contenido de las celdas si el tablero ha sido inicializado
                if (tablero_inicializado) {
                    if (celda.revelado) {
                        cellElement.classList.add('revealed');
                        if (celda.mina) {
                            cellElement.classList.add('mine');
                            cellElement.textContent = '💣'; // Emoji de bomba
                        } else if (celda.minas_alrededor > 0) {
                            cellElement.textContent = celda.minas_alrededor;
                            cellElement.classList.add(`number-${celda.minas_alrededor}`);
                        }
                    } else if (celda.marcado) {
                        cellElement.classList.add('flag');
                        cellElement.textContent = '🚩'; // Emoji de bandera
                    }
                    // Si el juego ha terminado y es una mina no revelada (y no marcada), mostrarla al perder
                    if (juego_terminado && !celda.revelado && celda.mina && !celda.marcado) {
                        cellElement.classList.add('mine'); // Mostrar minas al perder
                        cellElement.textContent = '💣';
                    }
                }
                
                boardContainer.appendChild(cellElement);
            });
        });

        // Actualizar el contador de minas restantes
        // Mostrar '--' si el tablero no está inicializado, o el número real si sí lo está
        minasRestantesSpan.textContent = tablero_inicializado ? gameData.minas_restantes : '--';

        // Mostrar mensaje de fin de juego si aplica
        if (juego_terminado) {
            gameMessageDiv.style.display = 'block';
            gameMessageDiv.textContent = gameData.mensaje;
            if (gameData.mensaje.includes('Ganaste')) {
                gameMessageDiv.classList.remove('lose');
                gameMessageDiv.classList.add('win');
            } else {
                gameMessageDiv.classList.remove('win');
                gameMessageDiv.classList.add('lose');
            }
        } else {
            gameMessageDiv.style.display = 'none';
            gameMessageDiv.classList.remove('win', 'lose');
        }
    }

    // --- Lógica de Comunicación con PHP (AJAX) ---

    // Carga el estado inicial del juego desde PHP
    async function loadGame() {
        try {
            const response = await fetch('index.php'); // Petición GET inicial
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            gameData = await response.json();
            renderBoard(); // Renderiza el tablero inicial (vacío)
        } catch (error) {
            console.error('Error al cargar el juego:', error);
            alert('Error al cargar el juego. Inténtalo de nuevo.');
        }
    }

    // Envía una acción al servidor y actualiza el tablero con la respuesta
    async function sendAction(fila, columna, accion) {
        if (gameData.juego_terminado) return; // No permitir acciones si el juego ha terminado

        // Si es el primer clic y se intenta revelar, enviamos la acción 'primer_revelar'
        // Esto le indica a PHP que debe inicializar el tablero con estas coordenadas
        const actualAccion = (!gameData.tablero_inicializado && accion === 'revelar') ? 'primer_revelar' : accion;

        try {
            const response = await fetch('index.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `fila=${fila}&columna=${columna}&accion=${actualAccion}`
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            gameData = await response.json(); // Recibe el nuevo estado del juego
            renderBoard(); // Actualiza el tablero visualmente
        } catch (error) {
            console.error('Error al enviar la acción:', error);
            alert('Error al realizar la acción. Inténtalo de nuevo.');
        }
    }

    // --- Manejadores de Eventos ---

    // Reiniciar el juego
    resetButton.addEventListener('click', async () => {
        try {
            // Cuando se reinicia, también le indicamos a PHP que el tablero debe volver a un estado no inicializado
            const response = await fetch('index.php?reset=true');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            gameData = await response.json();
            renderBoard(); // Renderiza el tablero reiniciado (vacío)
        } catch (error) {
            console.error('Error al reiniciar el juego:', error);
            alert('Error al reiniciar el juego. Inténtalo de nuevo.');
        }
    });

    // Clic en una celda (izquierdo y derecho)
    boardContainer.addEventListener('click', (e) => {
        const cell = e.target.closest('.cell');
        if (!cell || gameData.juego_terminado) return;

        const fila = cell.dataset.fila;
        const columna = cell.dataset.columna;

        // Si la celda ya está revelada o marcada, no hacer nada (con click izquierdo)
        if (cell.classList.contains('revealed') || cell.classList.contains('flag')) {
            return;
        }

        // Antes de enviar la acción, verifica si es el primer clic
        // Si no está inicializado, el primer click siempre es 'revelar'
        sendAction(fila, columna, 'revelar');
    });

    boardContainer.addEventListener('contextmenu', (e) => {
        e.preventDefault(); // Prevenir el menú contextual del navegador
        const cell = e.target.closest('.cell');
        if (!cell || gameData.juego_terminado) return;

        const fila = cell.dataset.fila;
        const columna = cell.dataset.columna;

        // No se puede marcar una celda ya revelada
        if (cell.classList.contains('revealed')) {
            return;
        }

        // Si es el primer clic, no se puede marcar con bandera antes de inicializar el tablero
        if (!gameData.tablero_inicializado) {
            // Opcional: mostrar un mensaje al usuario o simplemente ignorar
            console.log("No puedes marcar con bandera antes del primer clic de revelación.");
            return;
        }

        sendAction(fila, columna, 'marcar');
    });

    // Cargar el juego al inicio
    loadGame();
});