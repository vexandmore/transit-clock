"use client"

import styles from './clock.module.css'
import ClockDisplay from './clock'
import Options from './options'
import Footer from './footer'
import './globals.css';
import {useEffect, useState} from 'react';

//import TransitDisplay from './transit'

export class Coordinates {
  public latitude: number = 0;
  public longitude: number = 0;

  constructor(latitude: number, longitude: number) {
    this.latitude = latitude;
    this.longitude = longitude;
  }
}

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
