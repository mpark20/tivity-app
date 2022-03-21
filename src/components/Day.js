const Day = (props) => {
    
    return(
        <div className="add-event" key={props.day.key+'events'}>
            <div style={{margin: '18px'}} key={props.day.key+'events_a'}>
            <h3 key={props.day.key+'events_b'}>{props.day.key.toLocaleDateString()}</h3> 
            <form key={props.day.key+'events_c'}>
                <input type="text" className="text-field event-name" placeholder="event name..." key={props.day.key+'events_c1'}/>
            </form>
            <form key={props.day.key+'events_d'}>
                <input type="time" className="text-field event-time" placeholder="time..." key={props.day.key+'events_d1'}/>
            </form>
            <button onClick={() => props.add(props.day, document.getElementsByClassName('event-name')[props.index].value, document.getElementsByClassName('event-time')[props.index].value)} className="btn" key={props.day.key+'events_e'}>enter</button>
            <button onClick={props.close} className="btn white" key={props.day.key+'events_f'}>close</button>
            </div>
        </div>
    )
}
export default Day