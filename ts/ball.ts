import { Entities, EntShape } from "./entity.js"

export class Ball {
    entities: Entities;

    constructor(x: number, y: number, speedX: number, speedY: number, radius: number) {
        this.entities = {
            x: new Float64Array([x]),
            y: new Float64Array([y]),
            speedX: new Float64Array([speedX]),
            speedY: new Float64Array([speedY]),
            width: radius,
            height: 0,
            status: [true],
            entShape: EntShape.Circle,
        };
    }

    bounceToWalls(canvasWidth: number, canvasHeight: number): boolean {
        if (this.entities.x[0] + this.entities.speedX[0] <= 0 || 
            this.entities.x[0] + this.entities.width + this.entities.speedX[0] >= canvasWidth) {
            this.entities.speedX[0] = -(this.entities.speedX[0]);
        }
        if (this.entities.y[0] + this.entities.speedY[0] <= 0) {
            this.entities.speedY[0] = -(this.entities.speedY[0]);
        } else if (this.entities.y[0] + this.entities.width >= canvasHeight) {
            return true;
        }
        return false;
    }
}
