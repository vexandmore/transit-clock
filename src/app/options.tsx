"use client"
import styles from './options.module.css'
import {useState, useEffect} from 'react';

export default function Options() {
    const [showModal, setShowModal] = useState(false);

    return (
        <div className={styles.optionConainer}>
            <button className={styles.modeSelector} onClick={() => {setShowModal(true)}}><img src="/icons8-brightness-50.png" width="30px"></img></button>
            <ConfigModal show={showModal} onClose={() => {setShowModal(false)}}/>
        </div>
    );
}

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

    public static isLightMode(start: TimeOfDay, end: TimeOfDay, now: Date): boolean {
        const currentTime = new TimeOfDay(now.getHours().toString() + ":" + now.getMinutes().toString());

        if (start.compareTo(end) <= 0) {
            return start.compareTo(currentTime) <= 0 && currentTime.compareTo(end) <= -1;
        } else {
            return !(end.compareTo(currentTime) <= -1 && currentTime.compareTo(start) <= 0);
        }
    }

    public toString(): string {
        return this.hour + ":" + this.minute;
    }
}

function ConfigModal(props: {show: boolean, onClose: () => void}) {
    const [automaticDarkMode, setautomaticDarkMode] = useState(false);
    const [lightModeStart, setLightModeStart] = useState("");
    const [darkModeStart, setDarkModeStart] = useState("");
    const [isLightMode, setIsLightMode] = useState(true);

    useEffect(() => {
        // Run this function once on startup
        setautomaticDarkMode(localStorage.getItem("automaticDarkMode") === "true");
        setLightModeStart(localStorage.getItem("lightModeStart") || "");
        setDarkModeStart(localStorage.getItem("darkModeStart") || "");
        setIsLightMode(localStorage.getItem("isLightMode") === "true");
        handleDisplayMode();
    }, []);

    useEffect(() => {
        const timerId = setInterval(() => {
            if (automaticDarkMode) {
                handleDisplayMode();
            }
        }, 1000 * 1);
        return function cleanup() {
            clearInterval(timerId);
        }
    });

    
    function apply() {
        localStorage.setItem("automaticDarkMode", automaticDarkMode.toString());
        localStorage.setItem("lightModeStart", lightModeStart.toString());
        localStorage.setItem("darkModeStart", darkModeStart.toString());
        localStorage.setItem("isLightMode", isLightMode.toString());
        
        handleDisplayMode();
        props.onClose();
    }

    
    function handleDisplayMode() {
        if (automaticDarkMode) {
            if (TimeOfDay.isLightMode(new TimeOfDay(lightModeStart), new TimeOfDay(darkModeStart), new Date(), true, false)) {
                document.documentElement.setAttribute("data-theme", "light");
            } else {
                document.documentElement.setAttribute("data-theme", "dark");
            }
        } else {
            document.documentElement.setAttribute("data-theme", isLightMode ? "light" : "dark");
        }
    }
    
    if (!props.show) {
        return null;
    }

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}> Settings </h2>
                </div>
                <div className={styles.modalBody}>
                    <form className={styles.settingsForm}>
                        <label htmlFor="auto-mode">Automatic night mode?</label>
                        <input type="checkbox" checked={automaticDarkMode} id="auto-mode" onChange={evt => setautomaticDarkMode(evt.target.checked)}></input>

                        {automaticDarkMode ? 
                            (
                            <>
                            <br/>
                            <label htmlFor="startLight">Start light mode</label>
                            <input id="startLight" value={lightModeStart}  type="time" onChange={evt => setLightModeStart(evt.target.value)}></input>
                            <br/>
                            <label htmlFor="startDark">Start dark mode</label>
                            <input id="startDark" value={darkModeStart}  type="time" onChange={evt => setDarkModeStart(evt.target.value)}></input>
                            </>
                            ) : 
                            (<>
                            <br/>
                            <label htmlFor="manualMode">Light mode?</label>
                            <input type="checkbox" checked={isLightMode} id="manualMode" onChange={evt => setIsLightMode(evt.target.checked === true)}></input>
                            </>
                            )
                        }
                    </form>
                </div>
                <div className={styles.modalFooter}>
                    <button className={styles.modalButton} onClick={props.onClose}>Close</button>
                    <button className={styles.modalButton} onClick={apply}>Apply</button>
                </div>
            </div>
        </div>
    );
}