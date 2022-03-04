
const GoogleCal = ( props ) => {
    require('dotenv').config({ path: '../../.env'}); 
    var gapi = window.gapi; 
    const CLIENT_ID = process.env.REACT_APP_GOOGLE_CALENDAR_CLIENT_ID;
    const API_KEY = process.env.REACT_APP_GOOGLE_CALENDAR_API_KEY; 
    const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
    const SCOPES = "https://www.googleapis.com/auth/calendar";

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
            //addEvents(); 
            listUpcomingEvents(); 
        })
    }
    function addEvents() {
        var today = new Date()
        var tmrw = new Date(today)
        tmrw.setDate(tmrw.getDate() + 1)
        
        var events = ""; 
        var tasks = props.tasks; 

        //today = today.toString(); 
        //tmrw = tmrw.toString(); 
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
        /*var event = {
            'summary': 'Google I/O 2015',
            'location': '800 Howard St., San Francisco, CA 94103',
            'description': 'A chance to hear more about Google\'s developer products.',
            'start': {
              'dateTime': today,
              'timeZone': 'America/Los_Angeles'
            },
            'end': {
              'dateTime': today,
              'timeZone': 'America/Los_Angeles'
            },
            
            'reminders': {
              'useDefault': false,
              'overrides': [
                {'method': 'email', 'minutes': 24 * 60},
                {'method': 'popup', 'minutes': 10}
              ]
            }
        };*/
          
        var request = gapi.client.calendar.events.insert({
            'calendarId': 'primary',
            'resource': event
        });
          
        request.execute((event) => {
            document.getElementById("event-link").setAttribute('href', event.htmlLink)
            document.getElementById("event-link").innerHTML = "event added to calendar"; 
        });
    }
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
            document.getElementById('cal-message').innerHTML = "";

            if (events.length > 0) {
                for (let i = 0; i < events.length; i++) {
                    var event = events[i];
                    var dateTime = event.start.dateTime;
                    var ms = new Date(dateTime).getTime(); 
                    var now = Date.now(); 

                    if (dateTime) {
                        var date = dateTime.substring(0, dateTime.indexOf("T")); 
                        var time = dateTime.substring(dateTime.indexOf("T")+1, dateTime.indexOf("T")+6);
                        if (ms-now <= 604800000) { //only get events in the next week
                            appendPre("<li>"+event.summary + ' (' + date +', '+time + ')'+"</li>")
                            //eventList.push(event.summary + ' (' + date +', '+time + ')');
                        }
                    }
                    else {
                        var date = event.start.date;
                        ms = new Date(date+" 00:00:00").getTime(); 
                        if (ms-now <= 604800000) {
                            appendPre("<li>"+event.summary + ' (' + date + ')'+"</li>")
                            //eventList.push(event.summary + ' (' + date + ')');
                        }
                    }
                    document.getElementById("cal-message").style.display = "block";
                    document.getElementById("hide").style.display = "block";
                    document.getElementById("gcal").style.display = "none";
                }
                //eventList = document.getElementById("cal-message").innerHTML; 
            } else {
                appendPre('No events scheduled this week.');
            }
        });
    }
    function hideEvents() {
        document.getElementById("cal-message").style.display = "none";
        document.getElementById("hide").style.display = "none";
        document.getElementById("gcal").style.display = "block";
    }
  
    function appendPre(message) {
        document.getElementById('cal-message').innerHTML += message;
    }
    return(
        <>
            <h2 style={{marginBottom: "2px"}}>upcoming events</h2>
            <div id="cal-message"></div>
            <div className="btn-container">
                <button onClick={handleClientLoad} className="btn red" id="gcal">load from Google Calendar</button>
                <button onClick={hideEvents} style={{display:"none"}} className="btn white" id="hide">hide</button>
            </div>
            <a id="event-link"></a>
        </>
    )
}
export default GoogleCal; 