// Get the canvas element
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set initial paddle position
let paddleX = canvas.width / 2;

// Set initial ball position and movement
let ballX = canvas.width / 2;
let ballY = canvas.height - 30;
let ballDX = 2;
let ballDY = -2;
const ballRadius = 10;

// Set paddle dimensions
const paddleHeight = 10;
const paddleWidth = 75;

// Set brick dimensions
const brickRowCount = 5;
const brickColumnCount = 10;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

// Create the bricks
const bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

// Update canvas dimensions based on screen size
function updateCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    paddleX = (canvas.width - paddleWidth) / 2;
}

// Move the paddle left or right based on keyboard input
function movePaddle(e) {
    if (e.key === "ArrowLeft") {
        paddleX -= 7;
    } else if (e.key === "ArrowRight") {
        paddleX += 7;
    }
}

// Draw the paddle on the canvas
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

// Draw the ball on the canvas
function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

// Draw the bricks on the canvas
function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;

                // Add class to determine brick row
                const brickRowClass = `brick-row-${r + 1}`;

                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = brickRowClass;
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

// Update the ball position and check for collisions
function updateBall() {
    ballX += ballDX;
    ballY += ballDY;

    // Check for collision with walls
    if (ballX + ballRadius > canvas.width || ballX - ballRadius < 0) {
        ballDX = -ballDX;
    }
    if (ballY - ballRadius < 0) {
        ballDY = -ballDY;
    }
    if (ballY + ballRadius > canvas.height - ballRadius - paddleHeight) {
        if (ballX > paddleX && ballX < paddleX + paddleWidth) {
            ballDY = -ballDY;
        }
    }

    // Check for collision with bricks
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const brick = bricks[c][r];
            if (brick.status === 1) {
                if (
                    ballX > brick.x &&
                    ballX < brick.x + brickWidth &&
                    ballY > brick.y &&
                    ballY < brick.y + brickHeight
                ) {
                    ballDY = -ballDY;
                    brick.status = 0;
                }
            }
        }
    }
}

// Draw all game elements on the canvas
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
}

// Game loop
function gameLoop() {
    updateBall();
    draw();
    requestAnimationFrame(gameLoop);
}

// Add event listeners for paddle movement
window.addEventListener("keydown", movePaddle);
window.addEventListener("keyup", movePaddle);

// Add event listener for resize events
window.addEventListener("resize", updateCanvasSize);

// Call the function initially to set the canvas size
updateCanvasSize();

// Start the game loop
gameLoop();
