let canvas: HTMLCanvasElement | null;
let startScreen: HTMLElement | null;
let winScreen: HTMLElement | null;
let stopScreen: HTMLElement | null;
let scoreElement: HTMLSpanElement | null;
let ctx: CanvasRenderingContext2D | null;

let isGameRunning = true;

let score = 0;

let gameLoopID = 0;

let ballX: number, ballY: number;
let ballSpeedX: number, ballSpeedY: number;

const ballRadius = 10;

let paddleX: number, paddleY: number;
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

interface Brick {
    x: number;
    y: number;
    status: number;
}

let bricks: Brick[][]= [];

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

function brickRender() {
    for (let r = 0; r < brickRowCount; ++r) {
        for (let c = 0; c < brickColumnCount; ++c) {
            if (bricks[r][c].status === 1) {
                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[r][c].x = brickX;
                bricks[r][c].y = brickY;
                ctx!.beginPath();
                ctx!.rect(brickX, brickY, brickWidth, brickHeight);
                ctx!.fillStyle = "#a6e3a1";
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

            if (brick.status === 1 && ballY - ballRadius <= brick.y + brickHeight &&
                    ballY + ballRadius >= brick.y && ballX + ballRadius >= brick.x &&
                    ballX <= brick.x + brickWidth) {
                ballSpeedY = -ballSpeedY;
                brick.status = 0;
                score++;
            }
        }
    }
}

function ballRender() {
    ctx!.beginPath();
    ctx!.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx!.fillStyle = "#f38ba8";
    ctx!.fill();
    ctx!.closePath();
}

function ballMove() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballX + ballSpeedX <= 0 || ballX + ballRadius + ballSpeedX >= canvas!.width) {
        ballSpeedX = -ballSpeedX;
    }
    if (ballY + ballSpeedY <= 0) {
        ballSpeedY = -ballSpeedY;
    } else if (ballY + ballRadius >= canvas!.height) {
        gameOver();
    }
}

function paddleRender() {
    ctx!.beginPath();
    ctx!.rect(paddleX, paddleY, paddleWidth, paddleHeight);
    ctx!.fillStyle = "#f9e2af";
    ctx!.fill();
    ctx!.closePath();
}

function paddleMove() {
    if (rightPressed && paddleX + paddleWidth + 7 <= canvas!.width) {
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

function scoreRender() {
    if (scoreElement === null) {
        console.error("scoreElement is null");
    }
    scoreElement!.innerHTML = score.toString();

    if (score === brickRowCount * brickColumnCount) {
        gameWon();
    }
}

function update() {
    ballMove();
    paddleMove();
    paddleCollisionDetection();
    brickCollisionDetection();
}

function draw() {
    ctx!.clearRect(0, 0, canvas!.width, canvas!.height)

    ballRender();
    paddleRender();
    brickRender();
    scoreRender();
}

function gameLoop() {
    if (isGameRunning === true) {
        draw();
        update();
        gameLoopID = window.requestAnimationFrame(gameLoop);
    }
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

function toggleScreen(element: HTMLElement | null, toggle: boolean) {
    if (element === null) {
        console.error("HTMLElement provided to toggleScreen() is null");
        return;
    }

    let display: string;

    if (toggle === true) {
        display = "block";
    } else {
        display = "none";
    }

    ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
    element!.style.display = display;
}

function gameOver() {
    isGameRunning = false;
    toggleScreen(stopScreen, true);
}

function gameWon() {
    isGameRunning = false;
    toggleScreen(winScreen, true);
}

function init() {
    canvas = document.getElementById("canvas") as HTMLCanvasElement;
    startScreen = document.getElementById("start-screen");
    winScreen = document.getElementById("win-screen");
    stopScreen = document.getElementById("stop-screen");
    scoreElement = document.getElementById("score") as HTMLSpanElement;

    if (canvas === null) {
        console.error("Canvas is null");
    }

    if (!canvas!.getContext) {
        console.error("Canvas context is not supported");
        isGameRunning = false;
    }
    ctx = canvas!.getContext("2d");
    if(ctx === null) {
        console.error("Canvas context is null");
        isGameRunning = false;
    }

    ballSpeedX = 5;
    ballSpeedY = -5;
    ballX = canvas!.width / 2;
    ballY = canvas!.height - 30;
    paddleX = (canvas!.width - paddleWidth) / 2;
    paddleY = canvas!.height - paddleHeight;

    toggleScreen(startScreen, false);

    brickInit();
    gameLoop();
}

function reinit() {
    isGameRunning = true;
    toggleScreen(stopScreen, false);
    init();
}

document.addEventListener("keydown", keydDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
