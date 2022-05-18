import { useState, useEffect } from 'react'
import Day from './components/Day'
import Loading from './components/Loading'
import { getAuth } from "firebase/auth";
import { getDatabase, ref, onValue, set, remove } from "firebase/database";
import GoogleCal from './components/GoogleCal';

const Calendar = () => {
    const auth = getAuth();  
    const db = getDatabase();  
    const [user, setUser] = useState(auth.currentUser);
    const [loading, setLoadingState] = useState(true);
    const monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
    const dt = new Date();
    const [year, setYear] = useState(dt.getFullYear()); 
    const [month, setMonth] = useState(dt.getMonth()+1);
    const [daysInMonth, setDaysInMonth] = useState(new Date(year, month, 0).getDate());
    const [currMonth, setCurrMonth] = useState(monthNames[(month-1)%12]);
    const [days, setDays] = useState(countDays())
    //var days = []; 
    const [events, setEvents] = useState(readSavedEvents());

    useEffect(() => {
        setDaysInMonth(new Date(year, month, 0).getDate());
        setCurrMonth(monthNames[(month-1)%12]);
        setDays(countDays())
        console.log(month, currMonth)
        setTimeout(() => {
            setLoadingState(false);
            setUser(auth.currentUser);
            checkEvents(); 
        }, 1000)
        
    }, [month, events])

    
    function readSavedEvents() {
        var savedEvents = []; 
        if (user) {
            var node = ref(db, "users/" + user.uid + "/events"); 
            onValue(node, (snapshot) => {
                snapshot.forEach((childSnapshot)=> { 
                    var item = childSnapshot.val();
                    item.key = childSnapshot.key;
                    savedEvents.push(item);       
                });
            })
            //console.log(savedEvents); 
            
            return savedEvents; 
        }
        return savedEvents; 
    }
    function countDays() {
        var dayList = []
        var firstDoW = new Date(year, month-1, 1).getDay(); 
        var monthDays = new Date(year, month, 0).getDate(); 
        console.log(currMonth+' '+ daysInMonth)
        for (let i=0; i<firstDoW; i++) {
            let daysInPrevMonth = new Date(year, month-1, 0).getDate();
            let c = daysInPrevMonth-firstDoW+1+i;
            let date = new Date(year, month-2, c);
            dayList.push({dayOfWk: i, count: c, key: date});  
            //setDays([...days, {dayOfWk: i, count: c, key: date}])
        }
        for (let d=1; d<=monthDays; d++) {
            let date = new Date(year, month-1, d);
            let doW = date.getDay();
            let day = {dayOfWk: doW, count: d, key: date};
            dayList.push(day);
            //setDays([...days, day])
        }
        return dayList; 
    }
    
    function checkEvents() {
        var tempDays = countDays(); 
        var boxes = document.getElementsByClassName('day-count'); 
        for (let i=0; i<tempDays.length; i++) {
            tempDays[i].events = [];
            for (let j=0; j<events.length; j++) {
                if (tempDays[i]==null || boxes[i]==null) {
                    //return null; 
                }
                else if (tempDays[i].key == events[j].date) {
                    document.getElementsByClassName('day-count')[i].style.color = '#ffa1a1';
                    tempDays[i].events.push(events[j]); 
                    //console.log(tempDays[i].events);
                }
                //setDays(tempDays);
            }
            if (tempDays[i].events.length == 0 && document.getElementsByClassName('day-count')[i]) {
                document.getElementsByClassName('day-count')[i].style.color = 'gray';
            }
        }
        
    }
    function nextMonth() {
        var tempMonth = month + 1;
        if (tempMonth > 12) {
            tempMonth = tempMonth % 12; 
            setYear(year+1);
        }
        setMonth(tempMonth);
    }
    function prevMonth() {
        var tempMonth = month - 1;  
        if (tempMonth < 1) {
            tempMonth = 12; 
            setYear(year-1);
        }
        setMonth(tempMonth);
    }

    function showAddEvent(index) {
        document.getElementsByClassName('add-event')[index].style.display = 'block';
    }

    function closeAddEvent(index) {
        document.getElementsByClassName('add-event')[index].style.display = 'none';
        document.getElementsByClassName('events-list')[index].style.display = 'none';
        
    }
    function closeList(index) {
        document.getElementsByClassName('events-list')[index].style.display = 'none';
    }
    function addEvent(day, n, t) {
        //var d = day.key; 
        //console.log(d.toString()); fixed: date object must be converted to string
        if (t == '') {
            t = '(all day)'
        }
        //var ev = {date: d.toString(), time: t}
        var ev = {date: day, time: t}
        if (user) {
            if (t === '(all day)') {
                var dt = day.split('00:00:00')[0] + ' ' + t + ':00' + ' GMT-0700'; 
            }
            else {
                var dt = day;
            }
            console.log(dt);
            var node = ref(db, 'users/' + user.uid + '/events/'+n+'_'+new Date(dt).getTime()) 
            set(node, ev)
            setEvents(readSavedEvents()) //rereads events since the database has been updated
        }
        var nameFields = document.getElementsByClassName('event-name');
        var timeFields = document.getElementsByClassName('event-time');
        for (let i=0; i<nameFields.length; i++) {
            nameFields[i].value = ''; 
            timeFields[i].value = '';
        }
        
    }
    function deleteEvent(key) {
        console.log('remove ' + key);
        setEvents(events.filter((item) => item.key !== key));
        var node = ref(db, "users/" + user.uid + "/events/" + key); 
        remove(node);
    }
    function showEvents(index) {
        document.getElementsByClassName('events-list')[index].style.display = 'block'; 
        
    }
    function eventList(day, index) { 
        var list = []; 
        var count = 0; 
        //console.log(events.length)
        for (let j=0; j<events.length; j++) {
            if (events[j].date == days[index].key) {
                //var ev = events[j].time + ' ' + events[j].key; 
                //list[count] = ev.substring(0, ev.indexOf('_'));
                list[count] = events[j];
                count++; 
            }
        }

       
        if (list.length == 0) {
            return(
                <div key={day.key+"_noEvents"}>
                    <h4 key={day.key+"_noEventsDate"}>{day.key.toLocaleDateString()}</h4>
                    no events
                </div>
            )
        }
        return(
            <div  key={day.key+"_eventList"}>
                <h4 key={day.key+"_eventsList1"}>{day.key.toLocaleDateString()}</h4>
                {list.map((item, i)=>(
                    <div key={day.key+"_"+i}>
                        <button key={day.key + "_x"} className="x-btn" onClick={() => deleteEvent(item.key)}>x</button>
                        <div key={day.key+'_name'} className='event-title'>{item.time}{' '}{item.key.substring(0, item.key.indexOf('_'))}</div>
                        
                    </div>
                ))}
            </div>
        )
    }
    
    return(
        <div className='flex-container'>
        <div className="page-container">
            
            <h2>{currMonth} {year}</h2>
            <GoogleCal addEvent={addEvent}/>
            <div className='btn-container'>
                <button className='btn white' onClick={prevMonth}>prev</button>
                <button className='btn white' onClick={nextMonth}>next</button>
            </div>
            <div>
             
            <div className="weekday">sun</div>
            <div className="weekday">mon</div>
            <div className="weekday">tue</div>
            <div className="weekday">wed</div>
            <div className="weekday">thu</div>
            <div className="weekday">fri</div>
            <div className="weekday">sat</div>
            
            {days.map((day, index) => (
                <>
                <div key={day.key+'box'} className="cal-box" onClick={() => showEvents(index)}>
                    <div className='day-count' key={day.key+'count'}>{day.count}</div>
                    <button key={day.key+'btn1'} className='x-btn add-event-btn' onClick={() => showAddEvent(index, day)}>+</button>
                </div>

                <div className='events-list' key={day.key+'list'}>
                    <button onClick={() => closeList(index)} className="btn white" key={day.key+'close'} style={{float: 'right'}}>x</button>
                    <div key={day.key+'list-items'}>{eventList(day, index)}</div>
                </div>

                <Day day={day} index={index} close={() => closeAddEvent(index)} add={addEvent} key={day.key}/>
                </>
            ))}
            </div>
            
        </div>
        
        </div>
    )
}
export default Calendar