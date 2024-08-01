export class Game {
    id: number;
    location: string;
    startTime: string;
    durationInHours: number;

    constructor(id: number, location: string, startTime: string, durationInHours: number) {
        this.id = id;
        this.location = location;
        this.startTime = startTime;
        this.durationInHours = durationInHours;
    }
}