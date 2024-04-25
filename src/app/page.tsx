"use client"

import styles from './clock.module.css'
import ClockDisplay from './clock'
import Options from './options'
import Footer from './footer'
import './globals.css';
import {useState, useEffect} from 'react';
import Transit from './transit'
import {TransitConfig, BasicTransitConfig, TimeOfDay} from './ConfigClasses'


export default function Home() {
  const [transitConfig, setTransitConfig] = useState(new TransitConfig());

  // Load config from localstorage on startup
  useEffect(() => {
    const basicConfig = BasicTransitConfig.getFromLocalStorageOrDefault();
    const transitConfig = TransitConfig.fromBasicConfigOrDefault(basicConfig);
    setTransitConfig(transitConfig);
  }, []);
  
  useEffect(() => {
    setTheme(transitConfig);
    const timerId = setInterval(() => {
      setTheme(transitConfig);
    }, 1000 * 1);
    return function cleanup() {
      clearInterval(timerId);
    }
  }, [transitConfig]);

  function setTheme(transitConfig: TransitConfig) {
    if (transitConfig.automaticDarkMode) {
      if (isLightMode(transitConfig.lightModeStart, transitConfig.darkModeStart, new Date())) {
        document.documentElement.setAttribute("data-theme", "light");
      } else {
        document.documentElement.setAttribute("data-theme", "dark");
      }
    } else {
      document.documentElement.setAttribute("data-theme", transitConfig.isManualLightMode ? "light" : "dark");
    }
  }

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
      <Options transitConfig={transitConfig} setTransitConfig={setTransitConfig}/>
      <ClockDisplay/>
      <Transit transitConfig={transitConfig}/>
      <Footer/>
    </main>
  )
}
