export class Coordinates {
  public latitude: number = 0;
  public longitude: number = 0;

  constructor(latitude: number, longitude: number) {
    this.latitude = latitude;
    this.longitude = longitude;
  }
}

// Represents a time of day (no information about date)
export class TimeOfDay {
  public hour: number = 0;
  public minute: number = 0;

  constructor(time?: string) {
    if (time !== undefined) {
      const splitted = time.split(':');
      if (splitted.length >= 1) {
        this.hour = Number(splitted[0]);
      } 
      if (splitted.length >= 2) {
        this.minute = Number(splitted[1]);
      }
    }
  }

  public compareTo(other: TimeOfDay): number {
    if (this.hour !== other.hour) {
      return this.hour - other.hour;
    }
    if (this.minute !== other.minute) {
      return this.minute - other.minute;
    }
    return 0;
  }

  public toString(): string {
    return this.hour + ":" + this.minute;
  }

  public to24hrString(): string {
    let out: string = "";
    if (this.hour < 10) {
      out += "0" + this.hour;
    } else {
      out += this.hour.toString();
    }
    out += ":";

    if (this.minute < 10) {
      out += "0" + this.minute;
    } else {
      out += this.minute.toString();
    }
    return out;
  }
}


// Represents transit config as used by the rest of the app
export class TransitConfig {
  public coords: Coordinates = new Coordinates(0,0);
  public radius: number = 0;
  public endpoint: string = "";
  public blocklist: string = "";
  public automaticDarkMode: boolean = false;
  public lightModeStart: TimeOfDay = new TimeOfDay("00:00");
  public darkModeStart: TimeOfDay = new TimeOfDay("00:00");
  public isManualLightMode: boolean = false;

  constructor() {
  }

  public static fromBasicConfigOrDefault(basicConfig: BasicTransitConfig): TransitConfig {
    let config = new TransitConfig();

    try {
      config.coords = new Coordinates(Number(basicConfig.latitude), Number(basicConfig.longitude));
    } catch (e) {
      config.coords = new Coordinates(Number(defaultConfig.latitude), Number(defaultConfig.longitude));
    }

    try {
      config.radius = Number(basicConfig.radius);
    } catch (e) {
      config.radius = Number(defaultConfig.radius);
    }

    config.endpoint = basicConfig.endpoint;
    config.blocklist = basicConfig.blocklist;
    config.automaticDarkMode = basicConfig.automaticDarkMode;
    try {
      config.lightModeStart = new TimeOfDay(basicConfig.lightModeStart);
    } catch (e) {
      config.lightModeStart = new TimeOfDay(defaultConfig.lightModeStart);
    }

    try {
      config.darkModeStart = new TimeOfDay(basicConfig.darkModeStart);
    } catch (e) {
      config.darkModeStart = new TimeOfDay(defaultConfig.darkModeStart);
    }
    
    config.isManualLightMode = basicConfig.isManualLightMode;

    return config;
  }

  public static fromBasicConfig(basicConfig: BasicTransitConfig): TransitConfig {
    let config = new TransitConfig();

    config.coords = new Coordinates(Number(basicConfig.latitude), Number(basicConfig.longitude));
    config.radius = Number(basicConfig.radius);
    config.endpoint = basicConfig.endpoint;
    config.blocklist = basicConfig.blocklist;
    config.automaticDarkMode = basicConfig.automaticDarkMode;
    config.lightModeStart = new TimeOfDay(basicConfig.lightModeStart);
    config.darkModeStart = new TimeOfDay(basicConfig.darkModeStart);
    config.isManualLightMode = basicConfig.isManualLightMode;

    return config;
  }
}

function toBool(val: string): boolean|null {
  if (val === "true") {
    return true;
  } else if (val === "false") {
    return false;
  } else {
    return null;
  }
}

// Represents the transit config directly how it is manipulated (strings and bools)
// Is POD for simplicity
export class BasicTransitConfig {
  public latitude: string;
  public longitude: string;
  public radius: string;
  public endpoint: string;
  public blocklist: string;
  public automaticDarkMode: boolean;
  // These two values are always in hh:mm 24hr format, due to the limitations of <input type="time">
  public lightModeStart: string;
  public darkModeStart: string;
  
  public isManualLightMode: boolean;

  constructor(latitude?: string, longitude?: string, radius?: string, endpoint?: string,
              blocklist?: string, automaticDarkMode?: boolean,
              lightModeStart?: string, darkModeStart?: string, isManualLightNode?: boolean) {
    this.latitude = latitude ?? "";
    this.longitude = longitude ?? "";
    this.radius = radius ?? "";
    this.endpoint = endpoint ?? "";
    this.blocklist = blocklist ?? "";
    this.automaticDarkMode = automaticDarkMode ?? false;
    this.lightModeStart = lightModeStart ?? "";
    this.darkModeStart = darkModeStart ?? "";
    this.isManualLightMode = isManualLightNode ?? false;
  }

  // Loads the config from local storage, missing parameters are replaced with default values above.
  public static getFromLocalStorageOrDefault(): BasicTransitConfig {
    const config = new BasicTransitConfig();
    config.automaticDarkMode = toBool(localStorage.getItem("automaticDarkMode") || "") || defaultConfig.automaticDarkMode;
    config.lightModeStart = localStorage.getItem("lightModeStart") || defaultConfig.lightModeStart;
    config.darkModeStart = localStorage.getItem("darkModeStart") || defaultConfig.darkModeStart;
    config.isManualLightMode = toBool(localStorage.getItem("isManualLightMode") || "") || defaultConfig.automaticDarkMode
    config.latitude = localStorage.getItem("latitude") || defaultConfig.latitude;
    config.longitude = localStorage.getItem("longitude") || defaultConfig.longitude;
    config.radius = localStorage.getItem("radius") || defaultConfig.radius;
    config.endpoint = localStorage.getItem("endpoint")?.toString() || defaultConfig.endpoint;
    config.blocklist = localStorage.getItem("blocklist")?.toString() || defaultConfig.blocklist;

    return config;
  }

  public static setToLocalStorage(config: BasicTransitConfig): void {
    localStorage.setItem("automaticDarkMode", config.automaticDarkMode.toString());
    localStorage.setItem("lightModeStart", config.lightModeStart.toString());
    localStorage.setItem("darkModeStart", config.darkModeStart.toString());
    localStorage.setItem("isManualLightMode", config.isManualLightMode.toString());

    localStorage.setItem("latitude", config.latitude);
    localStorage.setItem("longitude", config.longitude);
    localStorage.setItem("radius", config.radius);
    localStorage.setItem("endpoint", config.endpoint);
    localStorage.setItem("blocklist", config.blocklist);
  }

  public static fromTransitConfig(config: TransitConfig): BasicTransitConfig {
    let basicConfig: BasicTransitConfig = new BasicTransitConfig();
    basicConfig.latitude = config.coords.latitude.toString();
    basicConfig.longitude = config.coords.longitude.toString();
    basicConfig.radius = config.radius.toString();
    basicConfig.endpoint = config.endpoint;
    basicConfig.blocklist = config.blocklist;
    basicConfig.automaticDarkMode = config.automaticDarkMode;
    basicConfig.lightModeStart = config.lightModeStart.to24hrString();
    basicConfig.darkModeStart = config.darkModeStart.to24hrString();
    basicConfig.isManualLightMode = config.isManualLightMode;
    
    return basicConfig;
  }
}

// Default config includes coordinates in montreal for demo purposes.
const defaultConfig: BasicTransitConfig = 
    new BasicTransitConfig("45.502944", "-73.570421", "100", "http://127.0.0.1:3000", "", true, "07:00", "19:00", false);
