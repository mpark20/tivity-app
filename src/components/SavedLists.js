import { getAuth, onAuthStateChanged } from 'firebase/auth';
const SavedLists = (props) => {
    const auth = getAuth(); 
    const user = auth.currentUser; 
    
    if (props.lists) {
        var length = props.lists.length;
        for (let i=0; i<length; i++) {
            var ms = parseInt(props.lists[i].key); 
            var d = new Date(ms); 
            props.lists[i].date = d.toString(); 
        }
    }
    function listItems(list) {
        var tasks = JSON.stringify(list);
        tasks = tasks.replace(/"/g, '')
        tasks = tasks.replace('[', '')
        tasks = tasks.replace(']', '')
        var tasksArr = tasks.split(","); 
        tasks = ""; 
        for (let i=0; i<tasksArr.length; i++) {
            tasks += tasksArr[i] + " ";   
        }
        return tasks; 
    }
    if (user) {
        return(
            <>
            {props.lists.map((list, index) => (
                <div key={list.key}>
                    <div key={list.key+"d"} style={{textDecoration: "underline"}} onClick={() => props.showList(index)}>{list.date}</div>
                    <div key={list.key+"c"} className="list-contents">{listItems(list)}</div>
                </div>
            ))}
            </>
        )
    }  
    else {
        return (
            <div><a href="/#/auth" style={{textDecoration:"underline"}}>log in</a> to view saved lists</div>
        )
    }
}
export default SavedLists; 