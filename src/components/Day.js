const Day = (props) => {
    
    return(
        <div className="add-event" key={props.day.key+'events'}>
            <div style={{margin: '18px'}} key={props.day.key+'events.a'}>
            <h3 key={props.day.key+'events.b'}>{props.day.key+'events.b'}</h3> 
            <form key={props.day.key+'events.c'}>
                <input type="text" className="text-field event-name" placeholder="event name..." key={props.day.key+'events.d'}/>
            </form>
            <button onClick={() => props.add(props.day, document.getElementsByClassName('event-name')[props.index].value)} className="btn" key={props.day.key+'events.e'}>enter</button>
            <button onClick={props.close} className="btn white" key={props.day.key+'events.f'}>close</button>
            </div>
        </div>
    )
}
export default Day