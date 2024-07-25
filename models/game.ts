export class Game {
    location: string;
    startTime: string;
    durationInHours: number;

    constructor(location: string, startTime: string, durationInHours: number) {
        this.location = location;
        this.startTime = startTime;
        this.durationInHours = durationInHours;
    }
}