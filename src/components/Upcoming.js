const Upcoming = (props) => {
    return(
        <>
        {props.events.slice(0).reverse().map((event) => (
            <div key={event.key}>
                <div key={event.key + "title"}>{new Date(event.date).toISOString().split('T')[0]}: {event.key.substring(0, event.key.indexOf('_'))}</div>
            </div>
        ))}
        </>
    )
}
export default Upcoming