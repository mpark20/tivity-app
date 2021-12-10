import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";
import { useEffect, useState } from "react";

const SavedLists2 = () => {
    const auth = getAuth(); 
    const user = auth.currentUser; 
    const db = getDatabase(); 
    var lists = [];  
    
    const [savedLists, setSavedLists] = useState([]);

    useEffect(() => {
        setTimeout(()=> {
            setSavedLists(lists);
        }, 1000); 
    }, []); 

    onAuthStateChanged(auth, (user) => {
        if (user) {
            var node = ref(db, "users/" + user.uid + "/savedLists"); 
            onValue(node, (snapshot) => {
                snapshotToArray(snapshot)
            })
        }
    })
    function snapshotToArray(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var item = childSnapshot.val();
            item.key = childSnapshot.key;
            lists.push(item);
        });
        for (let i=0; i<lists.length; i++) {
            var ms = parseInt(lists[i].key); 
            var d = new Date(ms); 
            lists[i].date = d.toString(); 
        }
    }
    
    function showList(index) {
        var item = document.getElementsByClassName("list-contents")[index]
        if (item.style.display === "none") {
            item.style.display = "block";
        }
        else {
            item.style.display = "none"
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
            {savedLists.map((list, index) => (
                <div key={list.key}>
                    <div key={list.key+"d"} style={{textDecoration: "underline"}} onClick={() => showList(index)}>{list.date}</div>
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
export default SavedLists2; 