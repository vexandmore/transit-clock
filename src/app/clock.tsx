"use client"
import styles from './page.module.css'
import {useEffect, useState} from 'react';


export default function ClockDisplay() {
    const [date, setDate] = useState("");

    useEffect(() => {
        const timerId = setInterval(refreshClock, 1000);
        return function cleanup() {
        clearInterval(timerId);
        }
    });

    function refreshClock(): void {
        setDate(new Date().toLocaleTimeString([], {hour: 'numeric', minute: 'numeric'}));
    }

    return (
        <>
        <h1 className={styles.clock}>{date}</h1>
        </>
    );
}
