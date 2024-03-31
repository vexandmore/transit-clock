"use client"

import styles from './clock.module.css'
import ClockDisplay from './clock'
import Options from './options'
import Footer from './footer'
import './globals.css';
import {useState, useEffect} from 'react';
import Transit from './transit'
import {TransitConfig} from './ConfigClasses'

class TimeOfDay {
  public hour: number = 0;
  public minute: number = 0;

  constructor(time?: string) {
      if (time !== undefined) {
          const splitted = time.split(':');
          if (splitted.length > 0) {
              this.hour = Number(splitted[0]);
          }
          if (splitted.length > 1) {
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
}

export default function Home() {
  const [transitConfig, setTransitConfig] = useState(new TransitConfig());
  
  useEffect(() => {
    const timerId = setInterval(() => {
      if (transitConfig.automaticDarkMode) {
        if (isLightMode(new TimeOfDay(transitConfig.lightModeStart), new TimeOfDay(transitConfig.darkModeStart), new Date())) {
          document.documentElement.setAttribute("data-theme", "light");
        } else {
          document.documentElement.setAttribute("data-theme", "dark");
        }
      } else {
        document.documentElement.setAttribute("data-theme", transitConfig.isManualLightMode ? "light" : "dark");
      }
    }, 1000 * 1);
    return function cleanup() {
      clearInterval(timerId);
    }
  }, [transitConfig]);


  function isLightMode(start: TimeOfDay, end: TimeOfDay, now: Date): boolean {
    const currentTime = new TimeOfDay(now.getHours().toString() + ":" + now.getMinutes().toString());

    if (start.compareTo(end) <= 0) {
        return start.compareTo(currentTime) <= 0 && currentTime.compareTo(end) <= -1;
    } else {
        return !(end.compareTo(currentTime) <= -1 && currentTime.compareTo(start) <= 0);
    }
  }


  return (
    <main className={styles.main}>
      <Options setTransitConfig={setTransitConfig}/>
      <ClockDisplay/>
      <Transit transitConfig={transitConfig}/>
      <Footer/>
    </main>
  )
}
