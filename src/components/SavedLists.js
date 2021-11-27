
const SavedLists = (props) => {
    return(
        <>
        {props.lists.map((list) => (
            <div key={list.id}>
                <div key={list.id}>{list.id}:</div>
            </div>
        ))}
        </>
    )
}

export default SavedLists; 