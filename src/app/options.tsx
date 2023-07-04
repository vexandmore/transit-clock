"use client"
import styles from './options.module.css'
import {useState} from 'react';
import Image from 'next/image';

export enum DisplayMode {
    light,
    dark
}

export default function Options() {
    const [theme, setTheme] = useState(DisplayMode.light);

    function toggle() {
        if (theme === DisplayMode.light) {
            document.documentElement.setAttribute('data-theme', 'dark');
            setTheme(DisplayMode.dark);
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            setTheme(DisplayMode.light);
        }
    }
    return (
        <div className={styles.optionConainer}>
            <button className={styles.modeSelector} onClick={toggle}><img src="/icons8-brightness-50.png" width="30px"></img></button>
        </div>
    );
}
