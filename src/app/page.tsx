"use client"

import styles from './clock.module.css'
import ClockDisplay from './clock'
import Options from './options'
import Footer from './footer'
import './globals.css';
import {useEffect, useState} from 'react';
import {Coordinates} from './coordinates'


export default function Home() {
  const [coords, setCoords] = useState(new Coordinates(0,0));
  const [radius, setRadius] = useState(600);
  return (
    <main className={styles.main}>
      <Options setCoords={setCoords} setRadius={setRadius}/>
      <ClockDisplay/>
      <Footer/>
    </main>
  )
}
