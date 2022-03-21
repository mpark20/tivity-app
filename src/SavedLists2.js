import { getAuth } from "firebase/auth";
import { getDatabase, ref, onValue, remove } from "firebase/database";
import { useEffect, useState } from "react";
import Loading from "./components/Loading";

const SavedLists2 = (props) => {
    const auth = getAuth();  
    const db = getDatabase();  
    const [user, setUser] = useState(auth.currentUser);
    const [savedLists, setSavedLists] = useState(readSavedLists());
    const [loading, setLoadingState] = useState(true); 
    
   

    useEffect(() => {
        setTimeout(()=>{
           setUser(auth.currentUser); 
           setLoadingState(false); 
           //showImptBtn(); 
           if (props.origin === "timer") {
                const btns = document.getElementsByClassName("impt-btn");
                const contents = document.getElementsByClassName("list-contents"); 
                for (let i=0; i<btns.length; i++) {
                    btns[i].style.display = "block"; 
                    contents[i].style.display = "block";
                }
    
            }
        }, 500)
        
    }, [savedLists, user]); 
    
    

    function readSavedLists() {
        var lists = []; 
        if (user) {
            var node = ref(db, "users/" + user.uid + "/savedLists"); 
            onValue(node, (snapshot) => {
                snapshot.forEach(function(childSnapshot) { 
                    var item = childSnapshot.val();
                    item.key = childSnapshot.key;
                    lists.push(item);       //.unshift() instead of .push()
                });
            })
            
            return lists; 
        }
        return lists; 
        
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
        var temp = []; 
        for (let i=0; i<list.tasks.length; i++) {
            temp[i] = list.tasks[i].title; 
        }
        var tasks = JSON.stringify(temp );
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
    
    function deleteList(key) {
        setSavedLists(savedLists.filter((list) => list.key !== key));
        var node = ref(db, "users/" + user.uid + "/savedLists/" + key); 
        remove(node);
    }
   // function showImptBtn() {
        
    
   // }
    
    if (loading) {
        return(
            <Loading/>
        )
    }
    if (user) {   
        
        if (savedLists.length === 0) {
            return(
                <div className="page-container">
                    <h2>saved lists</h2>
                    <div>you currently don't have any lists saved.</div>
                </div>
            )
        }
        
        return(
            <div className="page-container">
                <h2>saved lists</h2>
                {savedLists.map((list, index) => (
                    <div key={list.key}>
                        <button key={list.key + "_x"} className="x-btn" onClick={() => deleteList(list.key)}>x</button>
                        <button key={list.key+"_import"} className="btn impt-btn" onClick={() => props.import(list.tasks)}>import</button>
                        <div key={list.key+"_title"} className="list-date" onClick={() => showList(index)}>{list.date}</div>
                        <div key={list.key+"_date"} className="list-title" onClick={() => showList(index)}>{list.key.substring(list.key.indexOf("_")+1)}</div>
                        <div key={list.key+"_items"} className="list-contents">{listItems(list)}</div>
                        
                    </div>
                ))}
            </div>
        )
    }  
    else {
        return (
            <div className="page-container">
                <h2>saved lists</h2>
                <a href="/#/auth" style={{textDecoration:"underline"}}>log in</a> to view saved lists
            </div>
        )
    }
}
export default SavedLists2; 