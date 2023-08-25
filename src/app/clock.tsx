"use client"
import styles from './clock.module.css'
import {useEffect, useState} from 'react';

export default function ClockDisplay() {
    const [date, setDate] = useState(getTimeString());

    useEffect(() => {
        const timerId = setInterval(() => {setDate(getTimeString());}, 1000);
        return function cleanup() {
            clearInterval(timerId);
        }
    });

    return (
        <>
        <h1 className={styles.clock} suppressHydrationWarning>{date}</h1>
        </>
    );
}

function getTimeString(): string {
    return new Date().toLocaleTimeString([], {hour: 'numeric', minute: 'numeric'});
}