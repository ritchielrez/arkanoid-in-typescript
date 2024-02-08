import { Entities, EntitiesRender, EntitiesUpdate } from "./entity.js"
import { Ball } from "./ball.js"
import { Paddle } from "./paddle.js"
import { Bricks } from "./brick.js"

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

let ball: Ball;
let paddle: Paddle;
let bricks: Bricks;

function getRandom(min: number, max: number) : number {
    return Math.floor(Math.random() * (max - min) + min);
}

function scoreRender() {
    if (game.scoreElement === null) {
        console.error("scoreElement is null");
    }
    game.scoreElement!.innerHTML = game.score.toString();

    if (game.score === brickRowCount * brickColumnCount) {
        isGameRunning = false;
        toggleScreen(game.winScreen, true);
    }
}

function update() {
    paddle.move(game.leftKeyPressed, game.rightKeyPressed, game.canvas.width);
    EntitiesUpdate(ball.entities.x, ball.entities.y, ball.entities.speedX, ball.entities.speedY);
    if (ball.bounceToWalls(game.canvas.width, game.canvas.height)) {
        isGameRunning = false;
        toggleScreen(game.stopScreen, true);
    }
    paddle.collisionDetection(ball);
    game.score = bricks.collisionDetection(ball, game.score);
}

function draw() {
    game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height)

    EntitiesRender([ball.entities, paddle.entities, bricks.entities], game.ctx, ["#f38ba8", "#f9e2af", "#a6e3a1"]);
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


function init() {
    ballSpeedX = 5;
    ballSpeedY = -5;
    ballX = game.canvas.width / 2;
    ballY = game.canvas.height - 30;

    paddleX = (game.canvas.width - paddleWidth) / 2;
    paddleY = game.canvas.height - paddleHeight;

    ball = new Ball(ballX, ballY, ballSpeedX, ballSpeedY, ballRadius);
    paddle = new Paddle(paddleX, paddleY, 7, 0, paddleWidth, paddleHeight)
    bricks = new Bricks(brickWidth, brickHeight, brickPadding, brickRowCount, brickColumnCount, brickOffsetTop, brickOffsetLeft);

    toggleScreen(game.startScreen, false);

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
