const Upcoming = (props) => {
    return(
        <>
        {props.events.slice(0).reverse().map((event) => (
            <div className='event-title' key={event.key}>
                <div>{new Date(event.date).toISOString().split('T')[0]}, {event.time}:</div>     
                <div>{event.key.substring(0, event.key.indexOf('_'))}</div>
            </div>
        ))}
        </>
    )
}
export default Upcoming