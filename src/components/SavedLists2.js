import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, onValue, remove } from "firebase/database";
import { useEffect, useState } from "react";
import Loading from "./Loading";

const SavedLists2 = (props) => {
    const auth = getAuth(); 
    const user = auth.currentUser; 
    const db = getDatabase(); 
    var lists = [];  
    
    const [savedLists, setSavedLists] = useState([]);
    const [loading, setLoadingState] = useState(true); 

    useEffect(() => {
        setTimeout(()=> {
            setSavedLists(lists);
            setLoadingState(false);
        }, 1000); 
    }, [props.key]); 

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
            var key = lists[i].key; 
            var ms = key.substring(0, key.indexOf("_")); //remove user title from key
            var title = key.substring(key.indexOf("_")+1); 
            var d = new Date(parseInt(ms)); //convert number portion of key to date time
            var ds = d.toString()
            lists[i].date = ds.substring(0, ds.indexOf("G")); //removes time zone 
            lists[i].title = title; 
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
        var tl = "<ul>"; 
        tasks = tasks.replace(/"/g, '')
        tasks = tasks.replace('[', '')
        tasks = tasks.replace(']', '')
        var tasksArr = tasks.split(","); 
        return (
            <>
            {tasksArr.map((task, index)=>(
                <div key={list.key+"_"+index}>{task}</div>
            ))}
            </>
        );  
         
    }
    function confirmDelete() {

    }
    function deleteList(key) {
        setSavedLists(lists.filter((list) => list.key !== key));
        var node = ref(db, "users/" + user.uid + "/savedLists/" + key); 
        remove(node);
    }

    if (loading) {
        return(
            <Loading/>
        )
    }
    if (user) {   
        
        if (savedLists.length === 0) {
            return(
                <>
                <div>you currently don't have any lists saved.</div>
                </>
            )
        }
        return(
            <>
            {savedLists.map((list, index) => (
                <div key={list.key}>
                    <button key={list.key + "_x"} className="x-btn" onClick={() => deleteList(list.key)}>x</button>
                    <div key={list.key+"_title"} className="list-title" onClick={() => showList(index)}>{list.title}</div>
                    <div key={list.key+"_date"} className="list-date">{list.date}</div>
                    <div key={list.key+"_items"} className="list-contents">{listItems(list)}</div>
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