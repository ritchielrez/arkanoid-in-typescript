import { Entities, EntitiesRender, EntitiesUpdate } from "./entity.js"
import { Ball } from "./ball.js"
import { Paddle } from "./paddle.js"
import { Bricks } from "./brick.js"

let isGameRunning = false;

class Game {
    // Readonly forces these fields to be only initialized from the constructor
    readonly canvas!: HTMLCanvasElement;
    readonly ctx!: CanvasRenderingContext2D;
    readonly startScreen: HTMLElement | null = null;
    readonly winScreen: HTMLElement | null = null;
    readonly stopScreen: HTMLElement | null = null;
    readonly scoreElement: HTMLSpanElement | null = null;

    readonly fps = 60.0;
    readonly frameTime = 1000.0 / this.fps;

    previousTime = 0.0;
    currentTime = 0.0;
    deltaTime = 0.0;

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

    if (game.score === bricks.rowCount * bricks.columnCount) {
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

function gameLoop(timeStamp: number) {
    if (isGameRunning === true) {
        game.currentTime = timeStamp;
        if(game.previousTime === 0) {
            game.previousTime = game.currentTime;
        }
        game.deltaTime = game.currentTime - game.previousTime;

        if(game.deltaTime >= game.frameTime) {
            game.previousTime = game.currentTime - (game.deltaTime % game.frameTime);
            update();
        }
        draw();

        window.requestAnimationFrame(gameLoop);
    } else {
        game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height)
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

function start() {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const startScreen = document.getElementById("start-screen");
    const winScreen = document.getElementById("win-screen");
    const stopScreen = document.getElementById("stop-screen");
    const scoreElement = document.getElementById("score") as HTMLSpanElement;

    game = new Game(canvas, startScreen, winScreen, stopScreen, scoreElement);

    const ballRadius = 10;

    const paddleWidth = 75;
    const paddleHeight = 10;

    const brickRowCount = 5;
    const brickColumnCount = 5;
    const brickWidth = 100;
    const brickHeight = 20;
    const brickPadding = 30;
    const brickOffsetTop = 75;
    const brickOffsetLeft = game.canvas.width / 8;

    const ballSpeedX = 5;
    const ballSpeedY = -5;
    const ballX = game.canvas.width / 2;
    const ballY = game.canvas.height - 30;

    const paddleX = (game.canvas.width - paddleWidth) / 2;
    const paddleY = game.canvas.height - paddleHeight;

    ball = new Ball(ballX, ballY, ballSpeedX, ballSpeedY, ballRadius);
    paddle = new Paddle(paddleX, paddleY, 7, 0, paddleWidth, paddleHeight)
    bricks = new Bricks(brickWidth, brickHeight, brickPadding, brickRowCount, brickColumnCount, brickOffsetTop, brickOffsetLeft);

    game.score = 0;
    isGameRunning = true;

    toggleScreen(game.winScreen, false);
    toggleScreen(game.stopScreen, false);
    toggleScreen(game.startScreen, false);

    window.requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", keydDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

let startButton = document.getElementById("start-button");
if (startButton === null) {
    console.error("Start button is null");
    isGameRunning = false;
}
startButton!.addEventListener("click", start);

let restartButtons = Array.from(document.getElementsByClassName("restart-button"));
restartButtons.forEach((restartButton) => {
    if (restartButton === null) {
        console.error("One of the restart buttons is null");
        isGameRunning = false;
    }
    restartButton!.addEventListener("click", start);
})

let backToStartScreenButtons = Array.from(document.getElementsByClassName("back-to-start-screen-button"));
backToStartScreenButtons.forEach((backToStartScreenButton) => {
    if (backToStartScreenButton === null) {
        console.error("One of the back to start screen buttons is null");
        isGameRunning = false;
    }
    backToStartScreenButton!.addEventListener("click", () => {
        game.score = 0;
        toggleScreen(game.stopScreen, false);
        toggleScreen(game.winScreen, false);
        toggleScreen(game.startScreen, true);
    });
})

let backToStartScreenButton2 = document.getElementById("back-to-start-screen-button-2");
if (backToStartScreenButton2 === null) {
    console.error("Back to start screen button 2 is null");
    isGameRunning = false;
}
backToStartScreenButton2!.addEventListener("click", () => {
    game.score = 0;
    toggleScreen(game.stopScreen, false);
    toggleScreen(game.winScreen, false);
    toggleScreen(game.startScreen, true);
});
