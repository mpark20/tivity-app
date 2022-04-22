import { useState, useEffect } from 'react'
import { getAuth } from "@firebase/auth";
//import { getDatabase, ref, set, onValue, remove } from "firebase/database";
import Loading from './Loading';

const GoogleCal = ( props ) => {
    require('dotenv').config({ path: '../../.env'}); 
    var gapi = window.gapi; 

    //const db = getDatabase(); 
    const auth = getAuth();
    //const [user, setUser] = useState(auth.currentUser);

    const CLIENT_ID = process.env.REACT_APP_GOOGLE_CALENDAR_CLIENT_ID;
    const API_KEY = process.env.REACT_APP_GOOGLE_CALENDAR_API_KEY; 
    const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
    const SCOPES = "https://www.googleapis.com/auth/calendar";
    //const [loading, setLoadingState] = useState(true); 

    /*useEffect(() => { 
        setTimeout(()=>{
            setLoadingState(false);
            setUser(auth.currentUser);
        }, 1000)
    }, [user]);*/

    
    function handleClientLoad() {
        gapi.load('client:auth2', initClient);
    }

    function initClient() {
        gapi.client.init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            discoveryDocs: DISCOVERY_DOCS,
            scope: SCOPES
        })
        gapi.client.load('calendar', 'v3', () => console.log('done'));
        gapi.auth2.getAuthInstance().signIn() 
        .then(() => {
            listUpcomingEvents(); 
            //setTimeout(() => {logout()}, 3000000) // auto logout after 50 minutes
        })
    }
    
    /*function addEvents() {
        var today = new Date()
        var tmrw = new Date(today)
        tmrw.setDate(tmrw.getDate() + 1)
        
        var events = ""; 
        var tasks = props.tasks; 

        for (let i=0; i<tasks.length; i++) {
            events += tasks[i].title + " \n"
        }
        var event = {
            'summary': "Today's Tasks",
            'description': events,
            'start': {
              'date': today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate(),
              //'timeZone': 'America/Los_Angeles'
            },
            'end': {
                'date': tmrw.getFullYear()+'-'+(tmrw.getMonth()+1)+'-'+tmrw.getDate(),
            },
            
        }
        
          
        var request = gapi.client.calendar.events.insert({
            'calendarId': 'primary',
            'resource': event
        });
          
        request.execute((event) => {
            document.getElementById("event-link").setAttribute('href', event.htmlLink)
            document.getElementById("event-link").innerHTML = "event added to calendar"; 
        });
    }*/
    function listUpcomingEvents() {
        gapi.client.calendar.events.list({
          'calendarId': 'primary',
          'timeMin': (new Date()).toISOString(),
          'showDeleted': false,
          'singleEvents': true,
          'maxResults': 10,
          'orderBy': 'startTime'
        })
        .then(function(response) {
            var events = response.result.items;
            var recents = []; 
            document.getElementById('cal-message').innerHTML = "";

            if (events.length > 0) {
                for (let i = 0; i < events.length; i++) {
                    var event = events[i];
                    var dateTime = event.start.dateTime;
                    var ms = new Date(dateTime).getTime(); 
                    var now = Date.now(); 

                    if (dateTime) {
                        var date = dateTime.split('T')[0]; 
                        var time = dateTime.split('T')[1].substring(0,5);
                        //console.log(new Date(date+"T00:00:00").toString())
                        //if (ms-now <= 604800000) { //only get events in the next week
                            //appendPre("<li>"+event.summary + ' (' + date +', '+time + ')'+"</li>")
                            //recents.push(event.summary + ' (' + date +', '+time + ')');
                            //console.log(new Date(date) + " " + time + " " + i)
                            props.addEvent(new Date(date+"T00:00:00").toString(), event.summary, time)
                        //}
                    }
                    else {
                        var date = event.start.date;
                        //ms = new Date(date+" 00:00:00").getTime(); 
                        //if (ms-now <= 604800000) {
                            //appendPre("<li>"+event.summary + ' (' + date + ')'+"</li>")
                            //recents.push(event.summary + ' (' + date + ')'); 
                        //}
                        props.addEvent(new Date(date+"T00:00:00").toString(), event.summary, '(all day)')
                    }
                    
                    if (recents.length == 0) {
                        document.getElementById("cal-message").innerHTML = 'no events scheduled this week.';
                    }
                    //tempSave(recents);
                    /*document.getElementById("cal-message").style.display = "block";
                    document.getElementById("hide").style.display = "block";
                    document.getElementById("gcal").style.display = "none";*/
                }
                //eventList = document.getElementById("cal-message").innerHTML; 
            } else {
                appendPre('no events scheduled.');
                
            }
        });
        
    }
    /*function tempSave(events) {
        if (user) {
            var node = ref(db, 'users/' + user.uid + '/gcalEvents');
            set(node, events); 
        }
        setTimeout(() => {remove(node)}, 3000000) // clear info after 50 minutes
    }*/
    function hideEvents() {
        document.getElementById("cal-message").style.display = "none";
        document.getElementById("hide").style.display = "none";
        document.getElementById("gcal").style.display = "block";
    }
  
    function appendPre(message) {
        document.getElementById('cal-message').innerHTML += message;
    }
    /*if (loading) {
        return(
          <Loading/>
        )
    }*/
    return(
        <>
            <div id="cal-message"></div>
            <div className="btn-container">
                <button onClick={handleClientLoad} className="btn" style={{backgroundColor: '#ffa1a1'}} id="gcal">sync with Google Calendar</button>
                
            </div>
            <a id="event-link"></a>
        </>
    )
    
}
export default GoogleCal; 