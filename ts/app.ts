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

let isGameOver = false;

let score = 0;

let animationID = 0;

let ballX: number, ballY: number;
let ballSpeedX = 5;
let ballSpeedY = -5;

const ballRadius = 10;

let paddleX: number;
const paddleWidth = 75;
const paddleHeight = 10;
const paddleY = canvas.height - paddleHeight;

let rightPressed = false;
let leftPressed = false;

const brickRowCount = 3;
const brickColumnCount = 11;
const brickWidth = 100;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

interface Brick {
    x: number;
    y: number;
    status: number;
}

const bricks: Brick[][]= [];

function getRandom(min: number, max: number) : number {
    return Math.floor(Math.random() * (max - min) + min);
}

function brickInit() {
    for (let r = 0; r < brickRowCount; ++r) {
        bricks[r] = [];
        for (let c = 0; c < brickColumnCount; ++c) {
            bricks[r][c] = { x: 0, y: 0, status: 1};
        }
    }
}

function brickRender(ctx: CanvasRenderingContext2D | null) {
    for (let r = 0; r < brickRowCount; ++r) {
        for (let c = 0; c < brickColumnCount; ++c) {
            if (bricks[r][c].status === 1) {
                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[r][c].x = brickX;
                bricks[r][c].y = brickY;
                ctx!.beginPath();
                ctx!.rect(brickX, brickY, brickWidth, brickHeight);
                ctx!.fillStyle = catppuccin[2];
                ctx!.fill();
                ctx!.closePath();
            }
        }
    }
}

function brickCollisionDetection() {
    for (let r = 0; r < brickRowCount; ++r) {
        for (let c = 0; c < brickColumnCount; ++c) {
            const brick = bricks[r][c];

            if (brick.status == 1 &&  ballY - ballRadius <= brick.y + brickHeight && 
                    ballY + ballRadius >= brick.y && ballX + ballRadius >= brick.x && 
                    ballX <= brick.x + brickWidth) {
                ballSpeedY = -ballSpeedY
                brick.status = 0;
                score++;

                if (score === brickRowCount * brickColumnCount) {
                    gameWon();
                }
            }
        }
    }
}

function ballRender(ctx: CanvasRenderingContext2D | null) {
    ctx!.beginPath();
    ctx!.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx!.fillStyle = catppuccin[1];
    ctx!.fill();
    ctx!.closePath();

    if (isGameOver === true) {
        gameOver();
    }
}

function ballMove() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballX + ballSpeedX <= 0 || ballX + ballRadius + ballSpeedX >= canvas.width) {
        ballSpeedX = -ballSpeedX;
    }
    if (ballY + ballSpeedY <= 0) {
        ballSpeedY = -ballSpeedY;
    } else if (ballY + ballRadius > canvas.height) {
        ballY += ballSpeedY;
        isGameOver = true;
    }
}

function paddleRender(ctx: CanvasRenderingContext2D | null) {
    ctx!.beginPath();
    ctx!.rect(paddleX, paddleY, paddleWidth, paddleHeight);
    ctx!.fillStyle = catppuccin[3];
    ctx!.fill();
    ctx!.closePath();
}

function paddleMove() {
    if (rightPressed && paddleX + paddleWidth + 7 <= canvas.width) {
        paddleX += 7;
    } else if (leftPressed && paddleX - 7 >= 0) {
        paddleX -= 7;
    }
}

function paddleCollisionDetection() {
    if (ballY + ballRadius >= paddleY && ballX + ballRadius >= paddleX && 
            ballX - ballRadius <= paddleX + paddleWidth && Math.sign(ballSpeedY) !== -1) {
        ballSpeedY = -ballSpeedY;
    }
}

function init() {
    ballX = canvas.width / 2;
    ballY = canvas.height - 30;
    paddleX = (canvas.width - paddleWidth) / 2;
    brickInit();
}

function scoreRender(ctx: CanvasRenderingContext2D | null) {
    ctx!.font = "16px Ubuntu";
    ctx!.fillStyle = catppuccin[7];
    ctx!.fillText(`Score: ${score}`, 8, 20)
}

function draw() {
    if (!canvas.getContext) {
        console.error("Canvas context is not supported.");
        cancelAnimationFrame(animationID);
        return;
    }

    const ctx = canvas.getContext("2d");
    if(ctx === null) {
        console.error("Canvas context is null.");
        cancelAnimationFrame(animationID);
        return;
    }
    ctx!.clearRect(0, 0, canvas.width, canvas.height)

    ballRender(ctx);
    paddleRender(ctx);
    brickRender(ctx);
    scoreRender(ctx);

    ballMove();
    paddleMove();
    paddleCollisionDetection();
    brickCollisionDetection();

    animationID = requestAnimationFrame(draw);
}

function keydDownHandler(e: KeyboardEvent) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e: KeyboardEvent) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    }
}

function gameOver() {
    alert("Game Over!");
    gameReload();
}

function gameWon() {
    alert("You won!!");
    gameReload();
}

function gameReload() {
    document.location.reload();
}

// Initialize
init();

window.onload = draw;

document.addEventListener("keydown", keydDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
