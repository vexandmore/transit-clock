"use client"

import styles from './clock.module.css'
import ClockDisplay from './clock'
import Options from './options'
import Footer from './footer'
import './globals.css';
import {useState} from 'react';
import Transit from './transit'
import {TransitConfig} from './ConfigClasses'

export default function Home() {
  const [transitConfig, setTransitConfig] = useState(new TransitConfig());

  return (
    <main className={styles.main}>
      <Options setTransitConfig={setTransitConfig}/>
      <ClockDisplay/>
      <Transit transitConfig={transitConfig}/>
      <Footer/>
    </main>
  )
}
