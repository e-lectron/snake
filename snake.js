// Основные переменные игры
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const restartButton = document.getElementById('restartButton');
const gameOverText = document.getElementById('gameOverText');
const scoreValue = document.getElementById('scoreValue');

const gridSize = 20;
let tileCount = { x: 0, y: 0 };

// Настройки змейки
let snake = [{ x: 10, y: 10 }];
let direction = null; // Устанавливаем начальное направление как null
let nextDirection = 'RIGHT';
let apple = { x: 5, y: 5 };
let appleCount = 0; // Счётчик съеденных яблок
let gameStarted = false; // Флаг, указывающий на начало игры

// Инициализация размеров холста
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    tileCount.x = Math.floor(canvas.width / gridSize);
    tileCount.y = Math.floor(canvas.height / gridSize);
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Основная функция игры
function gameLoop() {
    if (gameStarted) {
        update();
        draw();
    }
    setTimeout(gameLoop, 100);
}

// Обновление состояния игры
function update() {
    if (!direction) return; // Если направление не задано, не обновляем

    // Обновление направления змейки
    direction = nextDirection;

    // Перемещение змейки
    let head = { ...snake[0] };
    switch (direction) {
        case 'UP': head.y -= 1; break;
        case 'DOWN': head.y += 1; break;
        case 'LEFT': head.x -= 1; break;
        case 'RIGHT': head.x += 1; break;
    }

    // Проверка на выход за границы
    if (head.x < 0 || head.x >= tileCount.x || head.y < 0 || head.y >= tileCount.y) {
        gameOver();
        return;
    }

    // Проверка на столкновение с самим собой
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }

    // Добавление новой головы змейки
    snake.unshift(head);

    // Проверка на съедание яблока
    if (head.x === apple.x && head.y === apple.y) {
        appleCount++; // Увеличиваем счётчик яблок
        spawnApple();
        updateScore();
    } else {
        snake.pop();
    }
}

// Отрисовка на холсте
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Рисование змейки
    ctx.fillStyle = 'lime';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    });

    // Рисование яблока
    ctx.fillStyle = 'red';
    ctx.fillRect(apple.x * gridSize, apple.y * gridSize, gridSize, gridSize);
}

// Перемещение яблока на случайную позицию
function spawnApple() {
    apple = {
        x: Math.floor(Math.random() * tileCount.x),
        y: Math.floor(Math.random() * tileCount.y)
    };
}

// Обновление значения счётчика яблок
function updateScore() {
    scoreValue.textContent = appleCount;
}

// Сброс игры
function resetGame() {
    snake = [{ x: 10, y: 10 }];
    direction = null; // Устанавливаем начальное направление как null
    nextDirection = 'RIGHT';
    appleCount = 0; // Сброс счётчика яблок
    updateScore(); // Обновление счётчика на экране
    spawnApple();
    gameStarted = false; // Игра ещё не началась
    restartButton.style.display = 'none'; // Скрыть кнопку перезапуска
    gameOverText.style.display = 'none'; // Скрыть текст завершения игры
}

// Завершение игры
function gameOver() {
    gameStarted = false; // Игра завершена
    restartButton.style.display = 'block'; // Показать кнопку перезапуска
    gameOverText.style.display = 'block'; // Показать текст завершения игры
}

// Обработка событий касания
document.addEventListener('touchstart', handleTouchStart, { passive: false });
document.addEventListener('touchmove', handleTouchMove, { passive: false });

let touchStartX = 0;
let touchStartY = 0;

function handleTouchStart(event) {
    const touch = event.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
}

function handleTouchMove(event) {
    const touch = event.touches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Горизонтальное движение
        nextDirection = deltaX > 0 ? 'RIGHT' : 'LEFT';
    } else {
        // Вертикальное движение
        nextDirection = deltaY > 0 ? 'DOWN' : 'UP';
    }

    touchStartX = touch.clientX;
    touchStartY = touch.clientY;

    event.preventDefault();
}

// Обработка клика по кнопке перезапуска
restartButton.addEventListener('click', () => {
    resetGame();
    gameStarted = true; // Начать игру после перезапуска
});

// Запуск игры
resetGame();
gameStarted = true; // Игра начинается сразу после загрузки
gameLoop();
