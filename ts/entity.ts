export enum EntShape {
    Circle,
    Rectangle,
}

export interface Entities {
    x: Float64Array;
    y: Float64Array;
    speedX: Float64Array;
    speedY: Float64Array;
    width: number;
    height: number;
    status: boolean[];
    entShape: EntShape;
}

export function EntitiesRender(entities: Entities[], ctx: CanvasRenderingContext2D, fillStyle: string[]) {
    entities.forEach((entity, idx) => {
        ctx.fillStyle = fillStyle[idx];
        switch(entity.entShape) {
            case(EntShape.Circle):
                entity.x.forEach((_, idx) => {
                    if(entity.status[idx] === true) {
                        ctx.beginPath();
                        ctx.arc(entity.x[idx], entity.y[idx], entity.width, 0, Math.PI * 2);
                        ctx.fill();
                    }
                });
            break;
            case(EntShape.Rectangle):
                entity.x.forEach((_, idx) => {
                    if(entity.status[idx] === true) {
                        ctx.beginPath();
                        ctx.rect(entity.x[idx], entity.y[idx], entity.width, entity.height);
                        ctx.fill();
                    }
                });
            break;
        }
    });
}

export function EntitiesUpdate(x: Float64Array, y: Float64Array, speedX: Float64Array, speedY: Float64Array) {
    x.forEach((_, idx) => {
        x[idx] += speedX[idx];
    });
    y.forEach((_, idx) => {
        y[idx] += speedY[idx];
    });
}