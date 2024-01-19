const catppuccin = [
    "#45475A",
    "#F38BA8",
    "#A6E3A1",
    "#F9E2AF",
    "#89B4FA",
    "#F5C2E7",
    "#94E2D5",
    "#BAC2DE",
];

const canvas = document.getElementById("canvas") as HTMLCanvasElement;

let score = 0;

let ballX, ballY;
let ballSpeedX = 2;
let ballSpeedY = -2;

const ballRadius = 10;

let paddleX;
const paddleWidth = 75;
const paddleHeight = 10;

let rightPressed = false;
let leftPressed = false;

const brickRowCount = 3;
const brickColumnCount = 11;
const brickWidth = 100;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

const bricks = [];

function getRandom(min: number, max: number) : number {
    return Math.floor(Math.random() * (max - min) + min);
}

function initBricks() {
    for (let r = 0; r < brickRowCount; ++r) {
        bricks[r] = [];
        for (let c = 0; c < brickColumnCount; ++c) {
            bricks[r][c] = { x: 0, y: 0, status: 1};
        }
    }
}

function renderBricks(ctx: CanvasRenderingContext2D) {
    for (let r = 0; r < brickRowCount; ++r) {
        for (let c = 0; c < brickColumnCount; ++c) {
            if (bricks[r][c].status == 1) {
                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[r][c].x = brickX;
                bricks[r][c].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = catppuccin[2];
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function collisionDetection() {
    for (let r = 0; r < brickRowCount; ++r) {
        for (let c = 0; c < brickColumnCount; ++c) {
            const brick = bricks[r][c];

            if (ballY - ballRadius <= brick.y + brickHeight && ballY + ballRadius >= 
                    brick.y && ballX + ballRadius >= brick.x && ballX <= brick.x + brickWidth) {
                ballSpeedY = -ballSpeedY
                brick.status = 0;
                score++;
            }
        }
    }
}

function renderBall(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = catppuccin[1];
    ctx.fill();
    ctx.closePath();
}

function moveBall(intervalID: number) {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballX + ballSpeedX <= 0 || ballX + ballRadius + ballSpeedX > canvas.width) {
        ballSpeedX = -ballSpeedX;
    }
    if (ballY + ballSpeedY <= 0) {
        ballSpeedY = -ballSpeedY;
    } else if (ballY - 2 * ballRadius > canvas.height) {
        gameOver(intervalID);
    }
}

function renderPaddle(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = catppuccin[3];
    ctx.fill();
    ctx.closePath();
}

function movePaddle() {
    if (rightPressed && paddleX + paddleWidth + 7 <= canvas.width) {
        paddleX += 7;
    } else if (leftPressed && paddleX - 7 >= 0) {
        paddleX -= 7;
    }
}

function init() {
    ballX = canvas.width / 2;
    ballY = canvas.height - 30;
    paddleX = (canvas.width - paddleWidth) / 2;
    initBricks();
}

function renderScore(ctx: CanvasRenderingContext2D) {
    ctx.font = "16px Ubuntu";
    ctx.fillStyle = catppuccin[7];
    ctx.fillText(`Score: ${score}`, 8, 20)
}

function draw(intervalID: number) {
    if (!canvas.getContext) {
        console.error("Canvas context is not supported.");
        return;
    }
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    renderBall(ctx);
    renderPaddle(ctx);
    renderBricks(ctx);
    renderScore(ctx);
    
    moveBall(intervalID);
    movePaddle();
    collisionDetection();
}

function keydDownHandler(e: KeyboardEvent) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e: KeyboardEvent) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

function gameOver(intervalID: number) {
    alert("Game Over!");
    document.location.reload();
    clearInterval(intervalID);
}

// Initialize
init();

let intervalID = 0;

window.onload = () => {
    intervalID = setInterval(() => {
        draw(intervalID);
    }, 10);
};

document.addEventListener("keydown", keydDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
