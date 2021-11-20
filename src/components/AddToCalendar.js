import React from 'react';
import { google } from "calendar-link"

const AddToCalendar = (props) => {
    var today = new Date(); 
    var date = today.getFullYear()+"-"+(today.getMonth()+1)+"-"+today.getDate(); 
    var time1 = today.getHours()+":"+today.getMinutes(); 
    var title1; 
    var duration1;
    if (props.tasks.length> 0) {
        title1 = props.tasks[0].title;
        duration1 = props.tasks[0].time;
    }
    else {
        title1 = ""
        duration1 = 0; 
    }
    const event = {
        startDate: date,
        startTime: time1,
        endDate: date,
        allDayEvent: false,
        duration: [duration1, "minutes"],
        title: title1,
        description: "bleh",
        location: "home",
        busy: true,
        guests: []
    };
    const link = google(event); 
    
    return(
        <div>
            <button className="btn white">
                <a href={link} target="_blank" rel="noreferrer">add to google calendar</a>
            </button>
        </div>
    );
}

export default AddToCalendar; 