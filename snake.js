// Основные переменные игры
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const restartButton = document.getElementById('restartButton');
const gameOverText = document.getElementById('gameOverText');
const scoreValue = document.getElementById('scoreValue');

const gridSize = 20;
let tileCount = { x: 0, y: 0 };
const borderSize = 5; // Размер границы

// Настройки змейки
let snake = [{ x: 10, y: 10 }];
let direction = 'RIGHT'; // Устанавливаем начальное направление
let apple = { x: 5, y: 5 };
let appleCount = 0; // Счётчик съеденных яблок

let gameInterval; // Переменная для хранения ID игрового цикла
const gameSpeed = 250; // Скорость игры (мс)

// Инициализация размеров холста
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    tileCount.x = Math.floor((canvas.width - 2 * borderSize) / gridSize);
    tileCount.y = Math.floor((canvas.height - 2 * borderSize) / gridSize);
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Основная функция игры
function gameLoop() {
    update();
    draw();
}

// Обновление состояния игры
function update() {
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

    // Рисование границы
    ctx.strokeStyle = 'white';
    ctx.lineWidth = borderSize;
    ctx.strokeRect(borderSize / 2, borderSize / 2, canvas.width - borderSize, canvas.height - borderSize);

    // Рисование змейки
    ctx.fillStyle = 'lime';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize + borderSize, segment.y * gridSize + borderSize, gridSize, gridSize);
    });

    // Рисование яблока
    ctx.fillStyle = 'red';
    ctx.fillRect(apple.x * gridSize + borderSize, apple.y * gridSize + borderSize, gridSize, gridSize);
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
    direction = 'RIGHT'; // Устанавливаем начальное направление
    appleCount = 0; // Сброс счётчика яблок
    updateScore(); // Обновление счётчика на экране
    spawnApple();
    restartButton.style.display = 'none'; // Скрыть кнопку перезапуска
    gameOverText.style.display = 'none'; // Скрыть текст завершения игры

    // Останавливаем старый игровой цикл и запускаем новый
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, gameSpeed);
}

// Завершение игры
function gameOver() {
    clearInterval(gameInterval); // Остановить игровой цикл
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
        direction = deltaX > 0 ? 'RIGHT' : 'LEFT';
    } else {
        // Вертикальное движение
        direction = deltaY > 0 ? 'DOWN' : 'UP';
    }

    touchStartX = touch.clientX;
    touchStartY = touch.clientY;

    event.preventDefault();
}

// Обработка клика по кнопке перезапуска
restartButton.addEventListener('click', () => {
    resetGame(); // Перезапуск игры
});

// Обработка клавиш
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp': if (direction !== 'DOWN') direction = 'UP'; break;
        case 'ArrowDown': if (direction !== 'UP') direction = 'DOWN'; break;
        case 'ArrowLeft': if (direction !== 'RIGHT') direction = 'LEFT'; break;
        case 'ArrowRight': if (direction !== 'LEFT') direction = 'RIGHT'; break;
    }
});

// Запуск игры
resetGame();
