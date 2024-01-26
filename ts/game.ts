let ballX: number, ballY: number;
let ballSpeedX: number, ballSpeedY: number;

const ballRadius = 10;

let paddleX: number, paddleY: number;
const paddleWidth = 75;
const paddleHeight = 10;

const brickRowCount = 3;
const brickColumnCount = 11;
const brickWidth = 100;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

let firstRun = true;
let isGameRunning = true;

class Game {
    // Readonly forces these fields to be only initialized from the constructor
    readonly canvas!: HTMLCanvasElement;
    readonly ctx!: CanvasRenderingContext2D;
    readonly startScreen: HTMLElement | null = null;
    readonly winScreen: HTMLElement | null = null;
    readonly stopScreen: HTMLElement | null = null;
    readonly scoreElement: HTMLSpanElement | null = null;

    loopID = 0;
    score = 0;

    rightKeyPressed = false;
    leftKeyPressed = false;

    constructor(canvas: HTMLCanvasElement | null, startScreen: HTMLElement | null, 
                winScreen: HTMLElement | null, stopScreen: HTMLElement | null, 
                scoreElement: HTMLSpanElement | null) {
        if (canvas === null) {
            console.error("Canvas is null");
            isGameRunning = false;
            return;
        }
        this.canvas = canvas;

        if (!this.canvas.getContext) {
            console.error("Canvas context is not supported");
            isGameRunning = false;
            return;
        }

        const ctx = this.canvas.getContext("2d");
        if(ctx === null) {
            console.error("Canvas context is null");
            isGameRunning = false;
            return;
        }
        this.ctx = ctx;

        this.startScreen = startScreen;
        this.winScreen = winScreen;
        this.stopScreen = stopScreen;
        this.scoreElement = scoreElement;
    }
}

let game: Game;

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
                // Update the x and y values
                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[r][c].x = brickX;
                bricks[r][c].y = brickY;

                // Render
                game.ctx.beginPath();
                game.ctx.rect(bricks[r][c].x, bricks[r][c].y, brickWidth, brickHeight);
                game.ctx.fillStyle = "#a6e3a1";
                game.ctx.fill();
                game.ctx.closePath();
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
                game.score++;
            }
        }
    }
}

function ballRender() {
    game.ctx.beginPath();
    game.ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    game.ctx.fillStyle = "#f38ba8";
    game.ctx.fill();
    game.ctx.closePath();
}

function ballMove() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballX + ballSpeedX <= 0 || ballX + ballRadius + ballSpeedX >= game.canvas.width) {
        ballSpeedX = -ballSpeedX;
    }
    if (ballY + ballSpeedY <= 0) {
        ballSpeedY = -ballSpeedY;
    } else if (ballY + ballRadius >= game.canvas.height) {
        gameOver();
    }
}

function paddleRender() {
    game.ctx.beginPath();
    game.ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
    game.ctx.fillStyle = "#f9e2af";
    game.ctx.fill();
    game.ctx.closePath();
}

function paddleMove() {
    if (game.rightKeyPressed && paddleX + paddleWidth + 7 <= game.canvas.width) {
        paddleX += 7;
    } else if (game.leftKeyPressed && paddleX - 7 >= 0) {
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
    if (game.scoreElement === null) {
        console.error("scoreElement is null");
    }
    game.scoreElement!.innerHTML = game.score.toString();

    if (game.score === brickRowCount * brickColumnCount) {
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
    game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height)

    ballRender();
    paddleRender();
    brickRender();
    scoreRender();
}

function gameLoop() {
    if (isGameRunning === true) {
        draw();
        update();
        game.loopID = window.requestAnimationFrame(gameLoop);
    }
}

function keydDownHandler(e: KeyboardEvent) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        game.rightKeyPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        game.leftKeyPressed = true;
    }
}

function keyUpHandler(e: KeyboardEvent) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        game.rightKeyPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        game.leftKeyPressed = false;
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

    game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
    element!.style.display = display;
}

function gameOver() {
    isGameRunning = false;
    toggleScreen(game.stopScreen, true);
}

function gameWon() {
    isGameRunning = false;
    toggleScreen(game.winScreen, true);
}

function init() {
    ballSpeedX = 5;
    ballSpeedY = -5;
    ballX = game.canvas.width / 2;
    ballY = game.canvas.height - 30;

    paddleX = (game.canvas.width - paddleWidth) / 2;
    paddleY = game.canvas.height - paddleHeight;

    toggleScreen(game.startScreen, false);

    brickInit();
    gameLoop();
}

function reinit() {
    game.score = 0;
    isGameRunning = true;
    toggleScreen(game.stopScreen, false);
    init();
}

function start() {
    let canvas = document.getElementById("canvas") as HTMLCanvasElement;
    let startScreen = document.getElementById("start-screen");
    let winScreen = document.getElementById("win-screen");
    let stopScreen = document.getElementById("stop-screen");
    let scoreElement = document.getElementById("score") as HTMLSpanElement;

    game = new Game(canvas, startScreen, winScreen, stopScreen, scoreElement);

    if (firstRun === true) {
        init();
        firstRun = false;
        return;
    }
    reinit();
}

document.addEventListener("keydown", keydDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

let startButton = document.getElementById("start-button");
if (startButton === null) {
    console.error("Start button is null");
    isGameRunning = false;
}
startButton!.addEventListener("click", start);

let restartButton = document.getElementById("restart-button");
if (restartButton === null) {
    console.error("Restart button is null");
    isGameRunning = false;
}
restartButton!.addEventListener("click", start);

let backToStartScreenButton = document.getElementById("back-to-start-screen-button");
if (backToStartScreenButton === null) {
    console.error("Back to start screen button is null");
    isGameRunning = false;
}
backToStartScreenButton!.addEventListener("click", () => {
    game.score = 0;
    toggleScreen(game.stopScreen, false);
    toggleScreen(game.winScreen, false);
    toggleScreen(game.startScreen, true);
});
