import { useState, useEffect } from 'react'
import Day from './components/Day'
import { getAuth } from "firebase/auth";
import { getDatabase, ref, onValue, set, remove } from "firebase/database";

const Calendar = () => {
    const auth = getAuth();  
    const db = getDatabase();  
    const [user, setUser] = useState(auth.currentUser);

    const monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
    const dt = new Date();
    const [year, setYear] = useState(dt.getFullYear()); 
    var days = []
    const [month, setMonth] = useState(dt.getMonth()+1);
    const [daysInMonth, setDaysInMonth] = useState(new Date(year, month, 0).getDate());
    const [currMonth, setCurrMonth] = useState(monthNames[(month-1)%12]);
    const [events, setEvents] = useState(readSavedEvents());

    useEffect(() => {
        if (month > 12) {
            setMonth(month % 12);
            setYear(year+1);
        }
        if (month < 1) {
            setMonth(12)
            setYear(year-1)
        }
        var date = new Date(year, month, 0); 
        shiftDays(()=>{
            checkEvents();
        });
        setDaysInMonth(date.getDate());
        setCurrMonth(monthNames[(month-1)%12]);
        var y = date.getFullYear();
        console.log(y);
    }, [month])
    
    shiftDays(()=>{
        checkEvents();
    }); 
     
    function readSavedEvents() {
        var savedEvents = []; 
        if (user) {
            var node = ref(db, "users/" + user.uid + "/events"); 
            onValue(node, (snapshot) => {
                snapshot.forEach((childSnapshot)=> { 
                    var item = childSnapshot.val();
                    item.key = childSnapshot.key;
                    savedEvents.push(item);       //.unshift() instead of .push()
                });
            })
            return savedEvents; 
        }
        return savedEvents; 
    }
    function shiftDays() {
        for (let d=1; d<=daysInMonth; d++) {
            let date = new Date(year, month-1, d);
            let doW = date.getDay();
            let day = {dayOfWk: doW, count: d, key: date, events: []};
            days.push(day);
        }
        var firstDoW = days[0].dayOfWk; 
        //var lastDoW = days[days.length-1].dayOfWk
        console.log(firstDoW);
        var i = 0;
        while (i < firstDoW) {
            let daysInPrevMonth = new Date(year, month-1, 0).getDate();
            let date = new Date(year, month-2, daysInPrevMonth-i);
            days.unshift({dayOfWk: firstDoW-i, count: daysInPrevMonth-i, key: date, events: []}); 
            i++; 
        }
        
        /*for (let i=0; i<firstDoW; i++) {
            let daysInPrevMonth = new Date(year, month-1, 0).getDate();
            let date = new Date(year, month-2, daysInPrevMonth-i);
            days.unshift({dayOfWk: firstDoW-i, count: daysInPrevMonth-i, key: date, events: []})
        }*/
    }
    function checkEvents() {
        var boxes = document.getElementsByClassName('day-count'); 
        for (let c=0; c<boxes.length; c++) {
            if (days[c].events.length > 0) {
                boxes[c].style.color = 'red';
            }
        }
        //console.log(days[0].events.length);
    }
    function nextMonth() {
        setMonth(month+1); 
        
    }
    function prevMonth() {
        setMonth(month-1);
    }

    function showAddEvent(index) {
        //document.getElementById('add-event').style.display = 'block';
        document.getElementsByClassName('add-event')[index].style.display = 'block';
    }
    function closeAddEvent(index) {
        document.getElementsByClassName('add-event')[index].style.display = 'none';
        document.getElementsByClassName('events-list')[index].style.display = 'none';
    }
    function closeList(index) {
        document.getElementsByClassName('events-list')[index].style.display = 'none';
    }
    function addEvent(day, item) {
        var ev = {name: item, time: day.key.toLocaleTimeString()}
        day.events.push(ev); 
        console.log(day.events)
        //add a time of day property
        if (user) {
            var node = ref(db, 'users/' + user.uid + '/events/'+day.key+'/'+Date.now());
            set(node, ev)
        }
        var fields = document.getElementsByClassName('event-name');
        for (let i=0; i<fields.length; i++) {
            fields[i].value = ""; 
        }
    }
    function showEvents(index) {
        document.getElementsByClassName('events-list')[index].style.display = 'block'; 
       
    }
    function eventList(day) {
        console.log(day.events); 
        return(
            <>
            {day.events.map((event, i)=>(
                <div key={day.key+"_"+i}>{event}</div>
            ))}
            </>
        )
    }
    return(
        <>
        <div className="page-container">
            <h2>{currMonth} {year}</h2>
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
                    <button key={day.key+'btn1'} className='x-btn add-event-btn' onClick={() => showAddEvent(index)}>+</button>
                </div>

                <div className='events-list' key={day.key+'list'}>
                    {eventList(day)}
                    <button onClick={() => closeList(index)} className="btn white" key={day.key+'list.close'}>x</button>
                </div>

                <Day day={day} index={index} close={() => closeAddEvent(index)} add={addEvent} key={day.key}/>
                </>
            ))}
            </div>
            
        </div>
        
        </>
    )
}
export default Calendar