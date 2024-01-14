"use client"
import styles from './clock.module.css'
import {useEffect, useState} from 'react';

export default function ClockDisplay() {
    const [time, setTime] = useState(getTimeString());
    const [date, setDate] = useState(getDateString());

    useEffect(() => {
        const timerId = setInterval(() => {
            setTime(getTimeString());
            setDate(getDateString());
        }, 1000);
        return function cleanup() {
            clearInterval(timerId);
        }
    });

    return (
        <>
        <div className={styles.clockDate} suppressHydrationWarning>{date}</div>
        <h1 className={styles.clock} suppressHydrationWarning>{time}</h1>
        </>
    );
}

function getTimeString(): string {
    return new Date().toLocaleTimeString([], {hour: 'numeric', minute: 'numeric'});
}

function getDateString(): string {
    return new Date().toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'});
}