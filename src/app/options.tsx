"use client"
import styles from './options.module.css'
import { BasicTransitConfig, TransitConfig } from './ConfigClasses'
import { Coordinates } from './coordinates'
import { useState, useEffect } from 'react';

// Used to pass the setters down
type Setter<T> = React.Dispatch<React.SetStateAction<T>>;

export default function Options(props: { transitConfig: TransitConfig, setTransitConfig: Setter<TransitConfig> }) {
    const [showModal, setShowModal] = useState(false);
    const [displayedConfig, setDisplayedConfig] = useState(new BasicTransitConfig());

    function displayModal() {
        setShowModal(true);
        // On display, reset values to the correct config
        setDisplayedConfig(BasicTransitConfig.fromTransitConfig(props.transitConfig));
    }

    function hideModal() {
        setShowModal(false);
    }

    function apply() {
        try {
            let transitConfig = TransitConfig.fromBasicConfig(displayedConfig);
            BasicTransitConfig.setToLocalStorage(displayedConfig);
            props.setTransitConfig(transitConfig);
            setShowModal(false);
        } catch (e) {
            alert("Error in configuration");
            return;
        }
    }

    if (showModal) {
        return (
            <div className={styles.optionConainer}>
                <input type="image" className={styles.modeSelector} onClick={() => {displayModal}} src="/icons8-gear-50-filled.png" />
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}> Settings </h2>
                        </div>
                        <div className={styles.modalBody}>

                            <h3 className={styles.modalTitle}>Light/Dark Mode</h3>
                            <hr />
                            <form className={styles.settingsForm}>
                                <label htmlFor="auto-mode">Automatic night mode?</label>
                                <input type="checkbox" checked={displayedConfig.automaticDarkMode} id="auto-mode" onChange={evt => setDisplayedConfig({ ...displayedConfig, automaticDarkMode: evt.target.checked })}></input>

                                {displayedConfig.automaticDarkMode ?
                                    (
                                        <>
                                            <br />
                                            <label htmlFor="startLight">Start light mode</label>
                                            <input id="startLight" value={displayedConfig.lightModeStart} type="time" onChange={evt => setDisplayedConfig({ ...displayedConfig, lightModeStart: evt.target.value })}></input>
                                            <br />
                                            <label htmlFor="startDark">Start dark mode</label>
                                            <input id="startDark" value={displayedConfig.darkModeStart} type="time" onChange={evt => setDisplayedConfig({ ...displayedConfig, darkModeStart: evt.target.value })}></input>
                                        </>
                                    ) :
                                    (<>
                                        <br />
                                        <label htmlFor="manualMode">Light mode?</label>
                                        <input type="checkbox" checked={displayedConfig.isManualLightMode} id="manualMode" onChange={evt => setDisplayedConfig({ ...displayedConfig, isManualLightMode: evt.target.checked === true })}></input>
                                    </>
                                    )
                                }
                            </form>

                            <h3 className={styles.modalTitle}>Transit departures</h3>
                            <hr />
                            <form className={styles.settingsForm}>
                                <label htmlFor="radius">Distance from location to look for bus routes (m)</label>
                                <input id="radius" value={displayedConfig.radius} onChange={evt => setDisplayedConfig({ ...displayedConfig, radius: evt.target.value })}></input>
                                <br />
                                <label htmlFor="latitude">Latitude</label>
                                <input type="text" id="latitude" value={displayedConfig.latitude} onChange={evt => setDisplayedConfig({ ...displayedConfig, latitude: evt.target.value })}></input>
                                <br />
                                <label htmlFor="longitude">Longitude</label>
                                <input id="longitude" value={displayedConfig.longitude} onChange={evt => setDisplayedConfig({ ...displayedConfig, longitude: evt.target.value })}></input>
                                <br />
                                <label htmlFor="endpoint">Endpoint</label>
                                <input id="endpoint" value={displayedConfig.endpoint} onChange={evt => setDisplayedConfig({ ...displayedConfig, endpoint: evt.target.value })}></input>
                                <br />
                                <label htmlFor="blocklist">Line Blocklist (enter number/direction or just number, separate by commas):</label>
                                <input id="blocklist" value={displayedConfig.blocklist} onChange={evt => setDisplayedConfig({ ...displayedConfig, blocklist: evt.target.value })}></input>
                            </form>

                        </div>
                        <div className={styles.modalFooter}>
                            <button className={styles.modalButton} onClick={hideModal}>Close</button>
                            <button className={styles.modalButton} onClick={apply}>Apply</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div className={styles.optionConainer}>
                <input type="image" className={styles.modeSelector} onClick={displayModal} src="/icons8-gear-50-filled.png" />
            </div>
        );
    }
}

// function ConfigModal(props: {show: boolean, onClose: () => void, transitConfig: TransitConfig, setTransitConfig: Setter<TransitConfig>}) {
//     // Represents the options in the modal directly; initialized with current options
    
//     const [displayedConfig, setDisplayedConfig] = useState(BasicTransitConfig.fromTransitConfig(props.transitConfig));

//     function apply() {
//         try {
//             let transitConfig = TransitConfig.fromBasicConfig(displayedConfig);
//             BasicTransitConfig.setToLocalStorage(displayedConfig);
//             props.setTransitConfig(transitConfig);
//             props.onClose();
//         } catch (e) {
//             alert("Error in configuration");
//             return;
//         }
//     }
    
//     if (!props.show) {
//         return null;
//     }

//     return (
//         <div className={styles.modal}>
//             <div className={styles.modalContent}>
//                 <div className={styles.modalHeader}>
//                     <h2 className={styles.modalTitle}> Settings </h2>
//                 </div>
//                 <div className={styles.modalBody}>

//                     <h3 className={styles.modalTitle}>Light/Dark Mode</h3>
//                     <hr/>
//                     <form className={styles.settingsForm}>
//                         <label htmlFor="auto-mode">Automatic night mode?</label>
//                         <input type="checkbox" checked={displayedConfig.automaticDarkMode} id="auto-mode" onChange={evt => setDisplayedConfig({...displayedConfig, automaticDarkMode: evt.target.checked})}></input>

//                         {displayedConfig.automaticDarkMode ?
//                             (
//                             <>
//                             <br/>
//                             <label htmlFor="startLight">Start light mode</label>
//                             <input id="startLight" value={displayedConfig.lightModeStart}  type="time" onChange={evt => setDisplayedConfig({...displayedConfig, lightModeStart: evt.target.value})}></input>
//                             <br/>
//                             <label htmlFor="startDark">Start dark mode</label>
//                             <input id="startDark" value={displayedConfig.darkModeStart}  type="time" onChange={evt => setDisplayedConfig({...displayedConfig, darkModeStart: evt.target.value})}></input>
//                             </>
//                             ) : 
//                             (<>
//                             <br/>
//                             <label htmlFor="manualMode">Light mode?</label>
//                             <input type="checkbox" checked={displayedConfig.isManualLightMode} id="manualMode" onChange={evt => setDisplayedConfig({...displayedConfig, isManualLightMode: evt.target.checked === true})}></input>
//                             </>
//                             )
//                         }
//                     </form>

//                     <h3 className={styles.modalTitle}>Transit departures</h3>
//                     <hr/>
//                     <form className={styles.settingsForm}>
//                         <label htmlFor="radius">Distance from location to look for bus routes (m)</label>
//                         <input id="radius" value={displayedConfig.radius} onChange={evt => setDisplayedConfig({...displayedConfig, radius: evt.target.value})}></input>
//                         <br/>
//                         <label htmlFor="latitude">Latitude</label>
//                         <input type="text" id="latitude" value={displayedConfig.latitude} onChange={evt => setDisplayedConfig({...displayedConfig, latitude: evt.target.value})}></input>
//                         <br/>
//                         <label htmlFor="longitude">Longitude</label>
//                         <input id="longitude" value={displayedConfig.longitude} onChange={evt => setDisplayedConfig({...displayedConfig, longitude: evt.target.value})}></input>
//                         <br/>
//                         <label htmlFor="endpoint">Endpoint</label>
//                         <input id="endpoint" value={displayedConfig.endpoint} onChange={evt => setDisplayedConfig({...displayedConfig, endpoint: evt.target.value})}></input>
//                         <br/>
//                         <label htmlFor="blocklist">Line Blocklist (enter number/direction or just number, separate by commas):</label>
//                         <input id="blocklist" value={displayedConfig.blocklist} onChange={evt => setDisplayedConfig({...displayedConfig, blocklist: evt.target.value})}></input>
//                     </form>

//                 </div>
//                 <div className={styles.modalFooter}>
//                     <button className={styles.modalButton} onClick={props.onClose}>Close</button>
//                     <button className={styles.modalButton} onClick={apply}>Apply</button>
//                 </div>
//             </div>
//         </div>
//     );
// }