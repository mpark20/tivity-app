
const SavedLists = (props) => {
    if (props.loggedIn && props.lists) {
        var length = props.lists.length; 
        for (let i=0; i<length; i++) {
            var ms = parseInt(props.lists[i].key); 
            var d = new Date(ms); 
            props.lists[i].date = d.toString(); 
        }
        function showList(list) {
            var tasks = JSON.stringify(list);
            tasks = tasks.replace(/"/g, '')
            tasks = tasks.replace(',', ' ')
            tasks = tasks.replace('[', '')
            tasks = tasks.replace(']', '')
            return tasks; 
        }
        return(
            <>
            {props.lists.map((list) => (
                <div key={list.key}>
                    <div key={list.key+"d"}>{list.date}</div>
                    <div key={list.key+"c"} id="list-contents">{showList(list)}</div>
                </div>
            ))}
            </>
        )
    }
    else {
        return (
            <div><a href="/#/auth">log in</a> to view saved lists</div>
        )
    }
    
}

export default SavedLists; 