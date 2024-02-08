import { Ball } from "./ball.js"
import { Bricks } from "./brick.js"

export function BallBounceToWalls(ball: Ball, canvasWidth: number, canvasHeight: number): boolean {
    if (ball.entities.x[0] + ball.entities.speedX[0] <= 0 || 
        ball.entities.x[0] + ball.entities.width + ball.entities.speedX[0] >= canvasWidth) {
        ball.entities.speedX[0] = -(ball.entities.speedX[0]);
    }
    if (ball.entities.y[0] + ball.entities.speedY[0] <= 0) {
        ball.entities.speedY[0] = -(ball.entities.speedY[0]);
    } else if (ball.entities.y[0] + ball.entities.width >= canvasHeight) {
        return true;
    }
    return false;
}

export function BricksCollisionDetection(bricks: Bricks, ball: Ball, score: number): number {
    for (let c = 0; c < bricks.columnCount; ++c) {
        for (let r = 0; r < bricks.rowCount; ++r) {
            const idx = bricks.rowCount * c + r;
            if (bricks.entities.status[idx] === true && ball.entities.y[0] - ball.entities.width <= 
                    bricks.entities.y[idx] + bricks.entities.height &&
                    ball.entities.y[0] + ball.entities.width >= bricks.entities.y[idx] && 
                    ball.entities.x[0] + ball.entities.width >= bricks.entities.x[idx] &&
                    ball.entities.x[0] <= bricks.entities.x[idx] + bricks.entities.width) {
                ball.entities.speedY[0] = -(ball.entities.speedY[0]);
                bricks.entities.status[idx] = false;
                score++;
            }
        }
    }
    return score;
}
