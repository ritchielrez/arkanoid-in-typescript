import { Entities, EntShape } from "./entity.js"
import { Ball } from "./ball.js"

export class Paddle {
    entities: Entities;

    constructor(x: number, y: number, speedX: number, speedY: number, width: number, height: number) {
        this.entities = {
            x: new Float64Array([x]),
            y: new Float64Array([y]),
            speedX: new Float64Array([speedX]),
            speedY: new Float64Array([speedY]),
            width: width,
            height: height,
            status: [true],
            entShape: EntShape.Rectangle,
        };
    }

    move(leftKeyPressed: boolean, rightKeyPressed: boolean, canvasWidth: number) {
        if (rightKeyPressed && this.entities.x[0] + this.entities.width + 
            this.entities.speedX[0] <= canvasWidth) {
            this.entities.x[0] += this.entities.speedX[0];
        } else if (leftKeyPressed && this.entities.x[0] - this.entities.speedX[0] >= 0) {
            this.entities.x[0] -= this.entities.speedX[0];
        }
    }

    collisionDetection(ball: Ball) {
        if (ball.entities.y[0] + ball.entities.width >= this.entities.y[0] 
                && ball.entities.x[0] + ball.entities.width >= this.entities.x[0] &&
                ball.entities.x[0] - ball.entities.width <= this.entities.x[0] + this.entities.width && 
                Math.sign(ball.entities.speedY[0]) !== -1) {
            ball.entities.speedY[0] = -(ball.entities.speedY[0]);
        }
    }
}
