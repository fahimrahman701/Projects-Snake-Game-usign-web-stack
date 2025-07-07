// Game constants
const GRID_SIZE = 20;
const GAME_SPEED = 120; // Adjusted for smoother movement

// Get canvas context
const canvas = document.getElementById('game-board');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('high-score');
const gameOverElement = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score');
const modalHighScoreElement = document.getElementById('modal-high-score');
const congratulationsElement = document.getElementById('congratulations');

// Calculate cell size based on canvas dimensions
const CELL_SIZE = canvas.width / GRID_SIZE;

// Game state
let snake = [
    { x: GRID_SIZE / 2, y: GRID_SIZE / 2 }
];
let food = generateFood();
let direction = 'right';
let score = 0;
let highScore = getHighScore();
let gameLoop;
let gameStarted = false;
let isPaused = false;

// High score management
function getHighScore() {
    return parseInt(localStorage.getItem('snakeHighScore')) || 0;
}

function setHighScore(score) {
    localStorage.setItem('snakeHighScore', score.toString());
    highScore = score;
    updateHighScoreDisplay();
}

function updateHighScoreDisplay() {
    highScoreElement.textContent = `High Score: ${highScore}`;
}

// Event listeners for keyboard controls
document.addEventListener('keydown', handleKeyPress);

// Initialize game
function init() {
    updateHighScoreDisplay();
    // Clear the canvas completely at initialization
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Draw the initial snake and food without starting the game
    drawGame();
    document.addEventListener('keydown', startGameOnFirstKey);
}

function startGameOnFirstKey(event) {
    if (!gameStarted && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        gameStarted = true;
        document.removeEventListener('keydown', startGameOnFirstKey);
        window.startGame();
        event.preventDefault(); // Prevent default browser scrolling
    }
}

// Make startGame function globally accessible for the onclick attribute
window.startGame = function() {
    if (!isPaused) {
        gameLoop = setInterval(gameStep, GAME_SPEED);
        gameStarted = true;
    }
}

// Toggle pause state
function togglePause() {
    isPaused = !isPaused;
    
    if (isPaused) {
        // Pause the game
        clearInterval(gameLoop);
        // Draw pause indicator
        drawPauseIndicator();
    } else {
        // Resume the game
        gameLoop = setInterval(gameStep, GAME_SPEED);
    }
}

// Draw pause indicator
function drawPauseIndicator() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.font = '30px "Press Start 2P"';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#00ff87';
    ctx.shadowColor = '#00ff87';
    ctx.shadowBlur = 10;
    ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2);
    ctx.shadowBlur = 0;
    
    ctx.font = '16px "Orbitron"';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Press SPACE to resume', canvas.width / 2, canvas.height / 2 + 40);
}

// Main game loop step
function gameStep() {
    moveSnake();
    if (checkCollision()) {
        gameOver();
        return;
    }
    if (checkFoodCollision()) {
        score += 10;
        scoreElement.textContent = `Score: ${score}`;
        food = generateFood();
    } else {
        snake.pop();
    }
    drawGame();
}

// Handle keyboard input
function handleKeyPress(event) {
    const key = event.key;
    
    // Check if Enter key is pressed when game over screen is visible
    if (key === 'Enter' && gameOverElement.style.display === 'block') {
        window.resetGame();
        event.preventDefault(); // Prevent default browser behavior
        return;
    }
    
    // Handle space key for pause/resume
    if (key === ' ' && gameStarted && gameOverElement.style.display !== 'block') {
        togglePause();
        event.preventDefault(); // Prevent default browser behavior
        return;
    }
    
    const directions = {
        'ArrowUp': direction !== 'down' ? 'up' : direction,
        'ArrowDown': direction !== 'up' ? 'down' : direction,
        'ArrowLeft': direction !== 'right' ? 'left' : direction,
        'ArrowRight': direction !== 'left' ? 'right' : direction
    };
    if (key in directions) {
        direction = directions[key];
        event.preventDefault(); // Prevent default browser scrolling with arrow keys
    }
}

// Move snake based on current direction
function moveSnake() {
    const head = { ...snake[0] };
    switch (direction) {
        case 'up': head.y--; break;
        case 'down': head.y++; break;
        case 'left': head.x--; break;
        case 'right': head.x++; break;
    }
    snake.unshift(head);
}

// Check for collisions with walls or self
function checkCollision() {
    const head = snake[0];
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        return true;
    }
    return snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
}

// Check if snake has eaten food
function checkFoodCollision() {
    const head = snake[0];
    return head.x === food.x && head.y === food.y;
}

// Generate new food position
function generateFood() {
    while (true) {
        const food = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
        };
        if (!snake.some(segment => segment.x === food.x && segment.y === food.y)) {
            return food;
        }
    }
}

// Draw game state
function drawGame() {
    // Clear canvas with a slight trail effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw snake with neon effect
    snake.forEach((segment, index) => {
        const gradient = ctx.createLinearGradient(
            segment.x * CELL_SIZE,
            segment.y * CELL_SIZE,
            (segment.x + 1) * CELL_SIZE,
            (segment.y + 1) * CELL_SIZE
        );

        if (index === 0) { // Head
            gradient.addColorStop(0, '#00ff87');
            gradient.addColorStop(1, '#60efff');
        } else { // Body with fade effect
            const alpha = 1 - (index / snake.length) * 0.6;
            gradient.addColorStop(0, `rgba(0, 255, 135, ${alpha})`);
            gradient.addColorStop(1, `rgba(96, 239, 255, ${alpha})`);
        }

        ctx.fillStyle = gradient;
        
        // Draw rounded rectangle for segments
        const radius = CELL_SIZE / 3;
        const x = segment.x * CELL_SIZE;
        const y = segment.y * CELL_SIZE;
        const width = CELL_SIZE - 1;
        const height = CELL_SIZE - 1;

        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.fill();

        // Add neon glow effect
        ctx.shadowColor = '#00ff87';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Add eyes to the head
        if (index === 0) {
            ctx.fillStyle = '#1e0040';
            const eyeSize = CELL_SIZE / 5;
            const eyeOffset = CELL_SIZE / 3;
            
            // Position eyes based on direction
            let leftEyeX, leftEyeY, rightEyeX, rightEyeY;
            switch(direction) {
                case 'right':
                    leftEyeX = x + CELL_SIZE - eyeOffset;
                    leftEyeY = y + eyeOffset;
                    rightEyeX = x + CELL_SIZE - eyeOffset;
                    rightEyeY = y + CELL_SIZE - eyeOffset;
                    break;
                case 'left':
                    leftEyeX = x + eyeOffset;
                    leftEyeY = y + eyeOffset;
                    rightEyeX = x + eyeOffset;
                    rightEyeY = y + CELL_SIZE - eyeOffset;
                    break;
                case 'up':
                    leftEyeX = x + eyeOffset;
                    leftEyeY = y + eyeOffset;
                    rightEyeX = x + CELL_SIZE - eyeOffset;
                    rightEyeY = y + eyeOffset;
                    break;
                case 'down':
                    leftEyeX = x + eyeOffset;
                    leftEyeY = y + CELL_SIZE - eyeOffset;
                    rightEyeX = x + CELL_SIZE - eyeOffset;
                    rightEyeY = y + CELL_SIZE - eyeOffset;
                    break;
            }
            
            ctx.beginPath();
            ctx.arc(leftEyeX, leftEyeY, eyeSize, 0, Math.PI * 2);
            ctx.arc(rightEyeX, rightEyeY, eyeSize, 0, Math.PI * 2);
            ctx.fill();
        }
    });

    // Draw food with pulsing effect
    const pulseSize = Math.sin(Date.now() / 200) * 2;
    ctx.fillStyle = '#ff3366';
    ctx.shadowColor = '#ff3366';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(
        food.x * CELL_SIZE + CELL_SIZE / 2,
        food.y * CELL_SIZE + CELL_SIZE / 2,
        (CELL_SIZE / 2 - 2) + pulseSize,
        0,
        Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;
}

// Game over handling
function gameOver() {
    clearInterval(gameLoop);
    
    // Check for new high score
    let isNewHighScore = false;
    if (score > highScore) {
        setHighScore(score);
        isNewHighScore = true;
        congratulationsElement.style.display = 'block';
    } else {
        congratulationsElement.style.display = 'none';
    }
    
    finalScoreElement.textContent = score;
    modalHighScoreElement.textContent = highScore;
    gameOverElement.style.display = 'block';
}

// Reset game state - make globally accessible for the onclick attribute
window.resetGame = function() {
    snake = [{ x: GRID_SIZE / 2, y: GRID_SIZE / 2 }];
    direction = 'right';
    score = 0;
    scoreElement.textContent = 'Score: 0';
    food = generateFood();
    gameOverElement.style.display = 'none';
    isPaused = false;
    clearInterval(gameLoop);
    
    // Start the game immediately when Play Again is clicked
    gameStarted = true;
    window.startGame();
    
    // Remove the startGameOnFirstKey event listener as we're starting immediately
    document.removeEventListener('keydown', startGameOnFirstKey);
}

// Start the game
init();