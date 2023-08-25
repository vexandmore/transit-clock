export class Coordinates {
    public latitude: number = 0;
    public longitude: number = 0;
  
    constructor(latitude: number, longitude: number) {
      this.latitude = latitude;
      this.longitude = longitude;
    }
  }
  
  export class TransitConfig {
    public coords: Coordinates;
    public radius: number;
    public endpoint: string;
    public blocklist: string;
  
    constructor() {
      this.coords = new Coordinates(0,0);
      this.radius = 0;
      this.endpoint = "";
      this.blocklist = "";  
    }
  }