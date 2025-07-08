// Game constants
const GRID_SIZE = 20;
const GAME_SPEED = 180; // Slower speed for better mobile gameplay

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

// Mobile touch controls
function initMobileControls() {
    const btnUp = document.getElementById('btn-up');
    const btnDown = document.getElementById('btn-down');
    const btnLeft = document.getElementById('btn-left');
    const btnRight = document.getElementById('btn-right');
    const btnPause = document.getElementById('btn-pause');

    // Function to handle direction change
    function changeDirection(newDirection) {
        if (!gameStarted) {
            gameStarted = true;
            document.removeEventListener('keydown', startGameOnFirstKey);
            window.startGame();
        }
        
        const directions = {
            'up': direction !== 'down' ? 'up' : direction,
            'down': direction !== 'up' ? 'down' : direction,
            'left': direction !== 'right' ? 'left' : direction,
            'right': direction !== 'left' ? 'right' : direction
        };
        
        if (newDirection in directions) {
            direction = directions[newDirection];
        }
    }

    // Add touch event listeners
    btnUp.addEventListener('touchstart', (e) => {
        e.preventDefault();
        changeDirection('up');
    });

    btnDown.addEventListener('touchstart', (e) => {
        e.preventDefault();
        changeDirection('down');
    });

    btnLeft.addEventListener('touchstart', (e) => {
        e.preventDefault();
        changeDirection('left');
    });

    btnRight.addEventListener('touchstart', (e) => {
        e.preventDefault();
        changeDirection('right');
    });

    btnPause.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (gameStarted && gameOverElement.style.display !== 'block') {
            togglePause();
            // Update pause button icon
            btnPause.innerHTML = isPaused ? '<span>▶</span>' : '<span>⏸</span>';
        }
    });

    // Add click event listeners as fallback
    btnUp.addEventListener('click', (e) => {
        e.preventDefault();
        changeDirection('up');
    });

    btnDown.addEventListener('click', (e) => {
        e.preventDefault();
        changeDirection('down');
    });

    btnLeft.addEventListener('click', (e) => {
        e.preventDefault();
        changeDirection('left');
    });

    btnRight.addEventListener('click', (e) => {
        e.preventDefault();
        changeDirection('right');
    });

    btnPause.addEventListener('click', (e) => {
        e.preventDefault();
        if (gameStarted && gameOverElement.style.display !== 'block') {
            togglePause();
            // Update pause button icon
            btnPause.innerHTML = isPaused ? '<span>▶</span>' : '<span>⏸</span>';
        }
    });

    // Prevent default touch behavior on mobile controls
    document.addEventListener('touchstart', function(e) {
        if (e.target.closest('.mobile-controls')) {
            e.preventDefault();
        }
    }, { passive: false });

    document.addEventListener('touchmove', function(e) {
        if (e.target.closest('.mobile-controls')) {
            e.preventDefault();
        }
    }, { passive: false });
}

// Initialize game
function init() {
    updateHighScoreDisplay();
    // Clear the canvas completely at initialization
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Draw the initial snake and food without starting the game
    drawGame();
    document.addEventListener('keydown', startGameOnFirstKey);
    // Initialize mobile controls
    initMobileControls();
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

    // Draw snake with improved neon effect
    snake.forEach((segment, index) => {
        const x = segment.x * CELL_SIZE;
        const y = segment.y * CELL_SIZE;
        const centerX = x + CELL_SIZE / 2;
        const centerY = y + CELL_SIZE / 2;
        const radius = (CELL_SIZE / 2) - 1;

        if (index === 0) { 
            // Head - draw as circle with gradient
            const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
            gradient.addColorStop(0, '#60efff');
            gradient.addColorStop(0.7, '#00ff87');
            gradient.addColorStop(1, '#00cc6a');
            
            ctx.fillStyle = gradient;
            ctx.shadowColor = '#00ff87';
            ctx.shadowBlur = 15;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        } else { 
            // Body segments - draw as circles with fade effect
            const alpha = Math.max(0.3, 1 - (index / snake.length) * 0.7);
            const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
            gradient.addColorStop(0, `rgba(96, 239, 255, ${alpha})`);
            gradient.addColorStop(0.7, `rgba(0, 255, 135, ${alpha})`);
            gradient.addColorStop(1, `rgba(0, 204, 106, ${alpha})`);
            
            ctx.fillStyle = gradient;
            ctx.shadowColor = '#00ff87';
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius * (0.7 + alpha * 0.3), 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }

        // Add eyes to the head
        if (index === 0) {
            ctx.fillStyle = '#1e0040';
            const eyeSize = CELL_SIZE / 6;
            const eyeDistance = CELL_SIZE / 4;
            
            // Position eyes based on direction
            let leftEyeX, leftEyeY, rightEyeX, rightEyeY;
            switch(direction) {
                case 'right':
                    leftEyeX = centerX + eyeDistance/2;
                    leftEyeY = centerY - eyeDistance/2;
                    rightEyeX = centerX + eyeDistance/2;
                    rightEyeY = centerY + eyeDistance/2;
                    break;
                case 'left':
                    leftEyeX = centerX - eyeDistance/2;
                    leftEyeY = centerY - eyeDistance/2;
                    rightEyeX = centerX - eyeDistance/2;
                    rightEyeY = centerY + eyeDistance/2;
                    break;
                case 'up':
                    leftEyeX = centerX - eyeDistance/2;
                    leftEyeY = centerY - eyeDistance/2;
                    rightEyeX = centerX + eyeDistance/2;
                    rightEyeY = centerY - eyeDistance/2;
                    break;
                case 'down':
                    leftEyeX = centerX - eyeDistance/2;
                    leftEyeY = centerY + eyeDistance/2;
                    rightEyeX = centerX + eyeDistance/2;
                    rightEyeY = centerY + eyeDistance/2;
                    break;
            }
            
            // Draw eyes with white background and dark pupils
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(leftEyeX, leftEyeY, eyeSize, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(rightEyeX, rightEyeY, eyeSize, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw pupils
            ctx.fillStyle = '#1e0040';
            ctx.beginPath();
            ctx.arc(leftEyeX, leftEyeY, eyeSize/2, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(rightEyeX, rightEyeY, eyeSize/2, 0, Math.PI * 2);
            ctx.fill();
        }
    });

    // Draw food with improved pulsing effect
    const pulseSize = Math.sin(Date.now() / 300) * 3;
    const foodCenterX = food.x * CELL_SIZE + CELL_SIZE / 2;
    const foodCenterY = food.y * CELL_SIZE + CELL_SIZE / 2;
    const foodRadius = (CELL_SIZE / 2 - 2) + pulseSize;
    
    // Create radial gradient for food
    const foodGradient = ctx.createRadialGradient(foodCenterX, foodCenterY, 0, foodCenterX, foodCenterY, foodRadius);
    foodGradient.addColorStop(0, '#ff6b9d');
    foodGradient.addColorStop(0.7, '#ff3366');
    foodGradient.addColorStop(1, '#cc1144');
    
    ctx.fillStyle = foodGradient;
    ctx.shadowColor = '#ff3366';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(foodCenterX, foodCenterY, foodRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Add inner sparkle effect
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.arc(foodCenterX - foodRadius/3, foodCenterY - foodRadius/3, foodRadius/4, 0, Math.PI * 2);
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
    
    // Reset pause button icon
    const btnPause = document.getElementById('btn-pause');
    if (btnPause) {
        btnPause.innerHTML = '<span>⏸</span>';
    }
    
    // Start the game immediately when Play Again is clicked
    gameStarted = true;
    window.startGame();
    
    // Remove the startGameOnFirstKey event listener as we're starting immediately
    document.removeEventListener('keydown', startGameOnFirstKey);
}

// Start the game
init();