export enum EntShape {
    Circle,
    Rectangle,
}

// Entities is a class that holds basic data that a entity should have
// But here we are using the concept of AoS (at least trying), so
// here we don't have a Entity holding x,y, but we have a "Entities"
// class holding arrays x and y values. All the entities should 
// have a instance of this class as a member, because we are using
// composition over inheritance here.
//
// Maybe this is just over-engineering, but this is my pet project :)
export interface Entities {
    x: Float64Array;
    y: Float64Array;
    speedX: Float64Array;
    speedY: Float64Array;
    // width stores the width of a rectangle, or a radius if the entShape
    // is circle.
    width: number;
    // height stores the height of a rectangle, or 0 if the entShape
    // is circle.
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
