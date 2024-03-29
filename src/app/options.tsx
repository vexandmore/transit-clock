"use client"
import styles from './options.module.css'
import {TransitConfig} from './ConfigClasses'
import {Coordinates} from './coordinates'
import {useState, useEffect} from 'react';

// Used to pass the setters down
type Setter<T> =  React.Dispatch<React.SetStateAction<T>>;

export default function Options(props: {setTransitConfig: Setter<TransitConfig>}) {
    const [showModal, setShowModal] = useState(false);
    return (
        <div className={styles.optionConainer}>
            <input type="image" className={styles.modeSelector} onClick={() => {setShowModal(true)}} src="/icons8-gear-50-filled.png"/>
            <ConfigModal show={showModal} onClose={() => {setShowModal(false)}} setTransitConfig={props.setTransitConfig} />
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

    public toString(): string {
        return this.hour + ":" + this.minute;
    }
}

function ConfigModal(props: {show: boolean, onClose: () => void, setTransitConfig: Setter<TransitConfig>}) {
    const [automaticDarkMode, setautomaticDarkMode] = useState(false);
    const [lightModeStart, setLightModeStart] = useState("");
    const [darkModeStart, setDarkModeStart] = useState("");
    const [isManualLightMode, setIsManualLightMode] = useState(true);

    const [localRadius, setLocalRadius] = useState("500");
    const [localLatitude, setLocalLatitude] = useState("0.0");
    const [localLongitude, setLocalLongitude] = useState("0.0");
    const [localEndpoint, setLocalEndpoint] = useState("http://192.168.0.0:3001");
    const [localBlocklist, setLocalBlocklist] = useState("");

    useEffect(() => {
        // Run this function once on startup
        setautomaticDarkMode(localStorage.getItem("automaticDarkMode") === "true");
        setLightModeStart(localStorage.getItem("lightModeStart") || "");
        setDarkModeStart(localStorage.getItem("darkModeStart") || "");
        setIsManualLightMode(localStorage.getItem("isManualLightMode") === "true");

        const config = new TransitConfig();
        const coords = new Coordinates(Number(localStorage.getItem("latitude") || "0"), Number(localStorage.getItem("longitude") || "0"));
        setLocalLatitude(coords.latitude.toString());
        setLocalLongitude(coords.longitude.toString());
        config.coords = coords;

        const radius = Number(localStorage.getItem("radius") || "500");
        setLocalRadius(radius.toString());
        config.radius = radius;

        const endpoint = localStorage.getItem("endpoint")?.toString() || "";
        setLocalEndpoint(endpoint);
        config.endpoint = endpoint;

        const blocklist = localStorage.getItem("blocklist")?.toString() || "";
        setLocalBlocklist(blocklist);
        config.blocklist = blocklist;

        props.setTransitConfig(config);

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
    }, []);

    
    function apply() {
        localStorage.setItem("automaticDarkMode", automaticDarkMode.toString());
        localStorage.setItem("lightModeStart", lightModeStart.toString());
        localStorage.setItem("darkModeStart", darkModeStart.toString());
        localStorage.setItem("isManualLightMode", isManualLightMode.toString());

        localStorage.setItem("latitude", localLatitude);
        localStorage.setItem("longitude", localLongitude);
        localStorage.setItem("radius", localRadius);
        localStorage.setItem("endpoint", localEndpoint);
        localStorage.setItem("blocklist", localBlocklist);

        // Bubble up config that is used by other parts of the application
        const newConfig = new TransitConfig();
        newConfig.coords = new Coordinates(Number(localLatitude), Number(localLongitude));
        newConfig.radius = Number(localRadius);
        newConfig.endpoint = localEndpoint;
        newConfig.blocklist = localBlocklist;
        props.setTransitConfig(newConfig);

        handleDisplayMode();
        props.onClose();
    }

    
    function handleDisplayMode() {
        if (automaticDarkMode) {
            if (isLightMode(new TimeOfDay(lightModeStart), new TimeOfDay(darkModeStart), new Date())) {
                document.documentElement.setAttribute("data-theme", "light");
            } else {
                document.documentElement.setAttribute("data-theme", "dark");
            }
        } else {
            document.documentElement.setAttribute("data-theme", isManualLightMode ? "light" : "dark");
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

                    <h3 className={styles.modalTitle}>Light/Dark Mode</h3>
                    <hr/>
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
                            <input type="checkbox" checked={isManualLightMode} id="manualMode" onChange={evt => setIsManualLightMode(evt.target.checked === true)}></input>
                            </>
                            )
                        }
                    </form>

                    <h3 className={styles.modalTitle}>Transit departures</h3>
                    <hr/>
                    <form className={styles.settingsForm}>
                        <label htmlFor="radius">Distance from location to look for bus routes (m)</label>
                        <input id="radius" value={localRadius} onChange={evt => setLocalRadius(evt.target.value)}></input>
                        <br/>
                        <label htmlFor="latitude">Latitude</label>
                        <input type="text" id="latitude" value={localLatitude} onChange={evt => setLocalLatitude(evt.target.value)}></input>
                        <br/>
                        <label htmlFor="longitude">Longitude</label>
                        <input id="longitude" value={localLongitude} onChange={evt => setLocalLongitude(evt.target.value)}></input>
                        <br/>
                        <label htmlFor="endpoint">Endpoint</label>
                        <input id="endpoint" value={localEndpoint} onChange={evt => setLocalEndpoint(evt.target.value)}></input>
                        <br/>
                        <label htmlFor="blocklist">Line Blocklist (enter number/direction or just number, separate by commas):</label>
                        <input id="blocklist" value={localBlocklist} onChange={evt => setLocalBlocklist(evt.target.value)}></input>
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