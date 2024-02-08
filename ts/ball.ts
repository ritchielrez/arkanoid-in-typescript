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
}
