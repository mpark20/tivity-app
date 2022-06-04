
import { getAuth } from "firebase/auth";
import { getDatabase, ref, onValue, remove } from "firebase/database";
import { useEffect, useState } from "react";
import Loading from "./components/Loading";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import TaskList from "./components/TaskList";

const Planner = (props) => {
    const auth = getAuth();  
    const db = getDatabase();  
    const [user, setUser] = useState(auth.currentUser);
    const [savedLists, setSavedLists] = useState([]); 
    const [loading, setLoadingState] = useState(true);

    useEffect(() => {
        let isMounted = true
        readSavedLists()
        .then((data) => {
            if (isMounted) {
                console.log(data)
                setSavedLists(data);
            } 
        })
        return() => {isMounted = false}
    }, [])
    useEffect(() => {
        console.log('planner rendered')
        setLoadingState(false); 
        /*console.log(firstRender.current)
        if (firstRender.current) {
            readSavedLists()
            firstRender.current = false
        }
        else {
            setLoadingState(false); 
            console.log(savedLists); 
        }*/
        

        /*const timer = setTimeout(()=>{
            setUser(auth.currentUser); 
            setLoadingState(false); 
        }, 1000)
        return() => {clearTimeout(timer)}*/
    }, [savedLists, user]); 
    
    
    
    function readSavedLists() {
        return new Promise((resolve, reject) => {
            if (user) {
                var node = ref(db, "users/" + user.uid + "/savedLists"); 
                onValue(node, (snapshot) => {
                    var lists = []
                    snapshot.forEach(function(childSnapshot) { 
                        var item = childSnapshot.val();
                        item.key = childSnapshot.key;
                        lists.unshift(item);       //.unshift() instead of .push()
                        console.log('getting saved lists')
                    })
                    resolve(lists);
                })
            }
             
        })
        /*console.log('reading saved lists...')
        var lists = []; 
        if (user) {
            var node = ref(db, "users/" + user.uid + "/savedLists"); 
            onValue(node, (snapshot) => {
                console.log(snapshot.val())
                snapshot.forEach(function(childSnapshot) { 
                    var item = childSnapshot.val();
                    item.key = childSnapshot.key;
                    lists.push(item);       //.unshift() instead of .push()
                    console.log('getting saved lists')
                });
            })
            console.log('finished getting lists');
        }
        setSavedLists(lists);
        //return lists; */
        
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
       
        /*var tasks = JSON.stringify(temp );
        tasks = tasks.replace(/"/g, '')
        tasks = tasks.replace('[', '')
        tasks = tasks.replace(']', '')
        var tasksArr = tasks.split(","); */
        return (
                    
            <> 
            {list.tasks.map((task, index)=>(
                <Draggable key={task.id} draggableId={task.id+''} index={index}>
                {(provided) => (
                    <div className='list-contents' id={task.id+''} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        <label><input type='checkbox'/>{task.title}</label>
                    </div>
                )}
                </Draggable>
            ))}
            </>
            
        );  
         
    }
    
    function deleteList(key) {
        setSavedLists(savedLists.filter((list) => list.key !== key));
        var node = ref(db, "users/" + user.uid + "/savedLists/" + key); 
        remove(node);
        
    }
    function handleOnDragStart(result, index) {
        //document.getElementById(result.draggableId).style.backgroundColor = '#ededed'
        var dropReg = document.getElementsByClassName('droppable')[index]
        dropReg.style.backgroundColor = '#f7f7f7';
        dropReg.style.padding = '8px'
    }
    function handleOnDragEnd(result, index) {
        //document.getElementById(result.draggableId).style.backgroundColor = 'transparent'
        var dropReg = document.getElementsByClassName('droppable')[index]
        dropReg.style.backgroundColor = 'initial';
        dropReg.style.padding = 'initial'
        if (!result.destination) {
            return;
        }
        const items = savedLists[index].tasks;
        console.log(items)
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        
    }
    
    if (loading) {
        return(
            <Loading/>
        )
    } 
        
    if (user) {

        
        if (savedLists.length === 0) {
            return(
                <div className='flex-container'>
                <div className="page-container">
                    <h2>saved lists</h2>
                    <div>you currently don't have any lists saved.</div>
                </div>
                </div>
            )
        }
        
        return(
            <div className='flex-container'>
            <div style={{width: "90%", margin: "10px auto"}}>
                <h2>my planner</h2>
                
                {savedLists.map((list, index) => (
                    <div key={list.key}>
                        <button key={list.key + "_x"} className="x-btn" onClick={() => deleteList(list.key)}>x</button>
                        <button key={list.key+"_import"} className="btn impt-btn" style={{display: props.origin==='timer' ? 'block':'none'}} onClick={() => props.import(list.tasks)}>import</button>
                        <div key={list.key+"_title"} className="list-date" onClick={() => showList(index)}>{list.date}</div>
                        <div key={list.key+"_date"} className="list-title" onClick={() => showList(index)}>{list.key.substring(list.key.indexOf("_")+1)}</div>
                        <DragDropContext onDragStart={(result) => {handleOnDragStart(result, index)}} onDragEnd={(result) => {handleOnDragEnd(result, index)}}>
                            <Droppable droppableId="droppable">
                                {(provided) => (
                                    <div className='droppable' {...provided.droppableProps} ref={provided.innerRef}>
                                        {listItems(list)}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                        
                        
                    </div>
                ))}
            </div>
            </div>
        )
    }
    else {
        return(
            <div className='flex-container'>
                <div className="page-container">
                    <h2>saved lists</h2>
                    <div>please log in to access your planner.</div>
                </div>
            </div>
        )
    }
    
}
export default Planner; 