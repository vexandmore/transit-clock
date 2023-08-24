export class Timestamp {
    public hours: number;
    public minutes: number;
    public seconds: number;
    
    constructor(hours: number, minutes: number, seconds: number) {
        if (hours < 0 || minutes < 0 || seconds < 0) {
            throw new Error("Hours, minutes, and seconds must be >=0");
        }
        this.hours = hours;
        this.minutes = minutes;
        this.seconds = seconds;
    }

    public static FromString(value: string): Timestamp {
        let hours = Number(value.substring(0, 2));
        let minutes = Number(value.substring(3, 5));
        let seconds = Number(value.substring(6, 8));
        return new Timestamp(hours, minutes, seconds);
    }

    public toString(): string {
        return ("0" + this.hours).slice(-2)   + ":" + 
        ("0" + this.minutes).slice(-2) + ":" + 
        ("0" + this.seconds).slice(-2);
    }

    public plus(other: Timestamp): void {
        let result = new Timestamp(this.hours,this.minutes,this.seconds);
        result.hours += other.hours;
        result.minutes += other.minutes;
        result.seconds += other.seconds;
        if (result.seconds > 60) {
            result.minutes += Math.floor(result.seconds / 60);
            result.seconds = result.seconds % 60;
        }
        if (result.minutes > 60) {
            result.hours += Math.floor(result.minutes / 60);
            result.minutes = result.minutes % 60;
        }
    }

    public minus(other: Timestamp) {
        let result = new Timestamp(this.hours,this.minutes,this.seconds);
        result.hours -= other.hours;
        result.minutes -= other.minutes;
        result.seconds -= other.seconds;

        if (result.seconds < 0) {
            let minutesToTake = Math.ceil(Math.abs(result.seconds / 60));
            result.minutes -= minutesToTake;
            result.seconds += (minutesToTake * 60);
        }
        if (result.minutes < 0) {
            let hoursToTake = Math.ceil(Math.abs(result.minutes / 60));
            result.hours -= hoursToTake;
            result.minutes += (hoursToTake * 60);
        }
        if (result.hours < 0) {
            throw new Error("other timestamp " + other.toString() + " is greater than " + this.toString());
        }
        return result;
    }

    public compare(other: Timestamp): number {
        if (this.hours > other.hours) {return 1;}
        if (this.hours < other.hours) {return -1;}

        if (this.minutes > other.minutes) {return 1;}
        if (this.minutes < other.minutes) {return -1;}

        if (this.seconds > other.seconds) {return 1;}
        if (this.seconds < other.seconds) {return -1;}

        return 0;
    }
}