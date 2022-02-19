import { useState, useEffect } from 'react'

const Calendar = () => {
    const monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
    const dt = new Date();
    const [year, setYear] = useState(dt.getFullYear()); 
    //var month = dt.getMonth()+1; 
    //var daysInMonth = new Date(year, month, 0).getDate();
    var days = []
    const [month, setMonth] = useState(dt.getMonth()+1)
    const [daysInMonth, setDaysInMonth] = useState(new Date(year, month, 0).getDate());
    const [currMonth, setCurrMonth] = useState(monthNames[(month-1)%12])

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
        shiftDays();
        setDaysInMonth(date.getDate());
        setCurrMonth(monthNames[(month-1)%12]);
        var y = date.getFullYear();
        console.log(y);
    }, [month])
    
    shiftDays(); 

    function shiftDays() {
        for (let d=1; d<=daysInMonth; d++) {
            let date = new Date(year, month-1, d)
            let doW = date.getDay()
            let day = {dayOfWk: doW, count: d, key: date}
            days.push(day)
        }
        var firstDoW = days[0].dayOfWk; 
        //var lastDoW = days[days.length-1].dayOfWk
        console.log(firstDoW)
        for (let i=0; i<firstDoW; i++) {
            let daysInPrevMonth = new Date(year, month-1, 0).getDate();
            let date = new Date(year, month-2, daysInPrevMonth-i);
            days.unshift({dayOfWk: firstDoW-i, count: daysInPrevMonth-i, key: date})
        }
    }

    function nextMonth() {
        setMonth(month+1); 
        
    }
    function prevMonth() {
        setMonth(month-1);
    }

    function addEvent() {
        document.getElementById('add-event').style.display = 'block';
    }
    function closeAddEvent() {
        document.getElementById('add-event').style.display = 'none';
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
            
            {days.map((day) => (
                <div key={day.key} onClick={addEvent} className="cal-box">{day.count}</div>
            ))}
            </div>
            
        </div>
        <div id="add-event">
            <div style={{margin: '18px'}}>
            <form>
                <input type="text" className="text-field" placeholder="event name..."/>
            </form>
            <button onClick={closeAddEvent} className="btn white">close</button>
            </div>
        </div>
        </>
    )
}
export default Calendar