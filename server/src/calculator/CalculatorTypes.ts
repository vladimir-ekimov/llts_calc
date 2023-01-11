//FIXME: A better file structure is necessary

// Just a point in time - not necessarily with measured value
export interface Point {
    timestamp: Date;
    value?: number;
}

// A point in time with a measured value guaranteed to be present
export interface MeasuredPoint extends Point {
    timestamp: Date;
    value: number;
}

// Just a time period representation using two points for start and end
export interface TimePeriod {
    start: Point;
    end: Point;
}

// A time period with measured start and stop allowing for amplitude calculation
export class MeasuredTimePeriod implements TimePeriod {
    start: MeasuredPoint
    end: MeasuredPoint

    constructor(start: MeasuredPoint, end: MeasuredPoint) {
        this.start = start
        this.end = end
    }

    getDelta(): number {
        return Math.abs(this.start.value - this.end.value)
    }
}

export class TurningPoint implements MeasuredPoint {
    timestamp: Date
    value: number
    isMin: boolean

    //FIXME: Seems redundant
    constructor(point: MeasuredPoint, isMin: boolean) {
        this.timestamp = point.timestamp
        this.value = point.value
        this.isMin = isMin
    }
}
