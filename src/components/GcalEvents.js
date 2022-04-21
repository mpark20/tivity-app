const GcalEvents = (props) => {
        console.log(props.events);
        return (
            <>
            {props.events.map((event, index) =>(
                    <li key={index}>{event}</li>
            ))}
            </>
        );
}
export default GcalEvents;
