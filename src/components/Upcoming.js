const Upcoming = (props) => {
    return(
        <>
        {props.events.map((event) => (
            <div key={event.key}>
                <div id='task-title' key={event.key + "title"}>{new Date(event.date).toISOString().split('T')[0]}: {event.key.substring(0, event.key.indexOf('_'))}</div>
               
            </div>
        ))}
        </>
    )
}
export default Upcoming