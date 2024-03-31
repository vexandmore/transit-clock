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
  public automaticDarkMode: boolean;
  public lightModeStart: string;
  public darkModeStart: string;
  public isManualLightMode: boolean;

  constructor() {
    this.coords = new Coordinates(0, 0);
    this.radius = 0;
    this.endpoint = "";
    this.blocklist = "";
    this.automaticDarkMode = false;
    this.lightModeStart = "";
    this.darkModeStart = "";
    this.isManualLightMode = false;
  }
}