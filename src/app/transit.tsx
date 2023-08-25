"use client"
import styles from './transit.module.css'
import {useEffect, useState} from 'react';
import { TransitConfig } from './ConfigClasses'

function getDateFromDepartureTime(departure_time: string): Date {
    let hours = Number(departure_time.substring(0, 2));
    let minutes = Number(departure_time.substring(3, 5));
    let seconds = Number(departure_time.substring(6, 8));
    let currentDate = new Date();

    if (hours < 24) {
        currentDate.setHours(hours);
        currentDate.setMinutes(minutes);
        currentDate.setSeconds(seconds);
    } else {
        // according to GTFS standard, 24, 25, etc hours is valid (instead of 0 hours, 1 hours the next day)
        
        if (currentDate.getHours() > 12) {
            // must be times for tomorrow morning, add a day to timestamp
            currentDate.setUTCSeconds(currentDate.getUTCSeconds() + 60 * 60 * 24);
        }
        // Otherwise, must be times for this morning (eg it's now midnight and this is a time for 00:10 this morning)
        currentDate.setHours(hours % 24);
        currentDate.setMinutes(minutes);
        currentDate.setSeconds(seconds);
    }
    return currentDate;
}

export default function TransitDisplay(props: {transitConfig: TransitConfig}) {
    let [upcomingDepartures, setUpcomingDepartures] = useState([] as any[]);
    let [transitTimes, setTransitTimes] = useState([] as JSX.Element[]);
    const config = props.transitConfig;
    // Get local departures every 5min
    let updateSchedule = () => {
        fetch(`${config.endpoint}/transit?latitude=${config.coords.latitude}&longitude=${config.coords.longitude}&radius=${config.radius}`)
        .then(res => res.json())
        .then((result) => {
            // console.log(result.stopTimes);
            setUpcomingDepartures(result.stopTimes);
        },
         (error) => {
            console.log("error: " + error);
            upcomingDepartures = [];
         });
    };

    let refreshTimes = () => {
        // console.log("refreshing times " + upcomingDepartures.length);
        const blocklistItems = config.blocklist.split(",");

        if (upcomingDepartures.length > 0) {
            const newTransitTimes: JSX.Element[] = [];
            for (const departure of upcomingDepartures) {
                if (blocklistItems.includes(departure.route_short_name + "/" + departure.trip_headsign)) {
                    continue;
                }

                let timeString = "";
                let departureDate = getDateFromDepartureTime(departure.departure_time);
                let now = new Date();
                let differenceSeconds = (departureDate.getTime() - now.getTime()) / 1000;
                if (differenceSeconds > 60 * 20) {
                    // If departure is in more than 20min, show timestamp
                    timeString = departure.departure_time.substring(0, 5);
                } else {
                    if (differenceSeconds < 60) {
                        continue;
                    }
                    // If departure is in less than 20min, show minutes left
                    let minLeft = Math.floor(differenceSeconds / 60);
                    timeString = minLeft + " min";
                }
                // console.log("adding a new time");
                newTransitTimes.push(
                    <TransitTime lineName={departure.route_short_name.toString()} timeIndicator={timeString}
                    bgColor={departure.route_color} textColor={departure.route_text_color} headsign={departure.trip_headsign}
                    key={departure.trip_id + departure.departure_time}/>);
            }
            // console.log("setting times " + newTransitTimes.length);
            setTransitTimes(newTransitTimes);
        }
    };

    useEffect(() => {
        // Call right away, then with 2min delay
        updateSchedule();
        const ajaxTimerId = setInterval(updateSchedule, 1000 * 60 * 2);

        return function cleanup() {
            clearInterval(ajaxTimerId);
        }
    }, [config]);

    useEffect(() => {
        // Call right away, then with 20 sec delay
        refreshTimes();
        const refreshTimerId = setInterval(refreshTimes, 1000 * 20);

        return function cleanup() {
            clearInterval(refreshTimerId);
        }
    }, [upcomingDepartures]);

    if (transitTimes.length === 0) {
        return (<p suppressHydrationWarning>Unable to fetch schedule</p>);
    } else {
        return (<div key='transitContainer' className={styles.transitContainer} suppressHydrationWarning>{transitTimes}</div>);
    }
}

function TransitTime(props: {lineName: string, timeIndicator: string, bgColor: string, textColor: string, headsign: string}) {
    return (
        <span className={styles.transitDeparture}>
            <span className={styles.routeNumber} style={{color: "#" + props.textColor, backgroundColor: "#" + props.bgColor}}>{props.lineName}</span>
            <span className={styles.headsign}>{props.headsign}</span>
            <span>{props.timeIndicator}</span>
        </span>
    );
}