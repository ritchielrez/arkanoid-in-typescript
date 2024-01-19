var catppuccin = [
    "#45475A",
    "#F38BA8",
    "#A6E3A1",
    "#F9E2AF",
    "#89B4FA",
    "#F5C2E7",
    "#94E2D5",
    "#BAC2DE",
];
var canvas = document.getElementById("canvas");
var ballX, ballY;
var ballSpeedX = 2;
var ballSpeedY = -2;
var ballRadius = 10;
var paddleX;
var paddleWidth = 75;
var paddleHeight = 10;
var rightPressed = false;
var leftPressed = false;
var brickRowCount = 3;
var brickColumnCount = 9;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var bricks = [];
function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
function initBricks() {
    for (var r = 0; r < brickRowCount; ++r) {
        bricks[r] = [];
        for (var c = 0; c < brickColumnCount; ++c) {
            bricks[r][c] = { x: 0, y: 0, status: 1 };
        }
    }
}
function renderBricks(ctx) {
    for (var r = 0; r < brickRowCount; ++r) {
        for (var c = 0; c < brickColumnCount; ++c) {
            if (bricks[r][c].status == 1) {
                var brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                var brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
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
    for (var r = 0; r < brickRowCount; ++r) {
        for (var c = 0; c < brickColumnCount; ++c) {
            var brick = bricks[r][c];
            if (ballX > brick.x && ballX < brick.x + brickWidth && ballY > brick.y && ballY < brick.y + brickHeight) {
                ballSpeedY = -ballSpeedY;
                brick.status = 0;
            }
        }
    }
}
function renderBall(ctx) {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = catppuccin[1];
    ctx.fill();
    ctx.closePath();
}
function moveBall(intervalID) {
    ballX += ballSpeedX;
    ballY += ballSpeedY;
    if (ballX + ballSpeedX <= 0 || ballX + ballRadius + ballSpeedX > canvas.width) {
        ballSpeedX = -ballSpeedX;
    }
    if (ballY + ballSpeedY <= 0) {
        ballSpeedY = -ballSpeedY;
    }
    else if (ballY - 2 * ballRadius > canvas.height) {
        gameOver(intervalID);
    }
}
function renderPaddle(ctx) {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = catppuccin[3];
    ctx.fill();
    ctx.closePath();
}
function movePaddle() {
    if (rightPressed && paddleX + paddleWidth + 7 <= canvas.width) {
        paddleX += 7;
    }
    else if (leftPressed && paddleX - 7 >= 0) {
        paddleX -= 7;
    }
}
function init() {
    canvas.width = 800;
    canvas.height = 600;
    ballX = canvas.width / 2;
    ballY = canvas.height - 30;
    paddleX = (canvas.width - paddleWidth) / 2;
    initBricks();
}
function draw(intervalID) {
    if (!canvas.getContext) {
        console.error("Canvas context is not supported.");
        return;
    }
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    renderBall(ctx);
    renderPaddle(ctx);
    renderBricks(ctx);
    moveBall(intervalID);
    movePaddle();
    collisionDetection();
}
function keydDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}
function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}
function gameOver(intervalID) {
    alert("Game Over!");
    document.location.reload();
    clearInterval(intervalID);
}
// Initialize
init();
var intervalID = 0;
window.onload = function () {
    intervalID = setInterval(function () {
        draw(intervalID);
    }, 10);
};
document.addEventListener("keydown", keydDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
