import { useState, useEffect } from 'react'
import { getAuth, onAuthStateChanged } from "@firebase/auth";
import { getDatabase, ref, set, onValue, remove, child, orderByChild } from "firebase/database";
import './App.css';
import TaskList from './components/TaskList';
import Loading from './components/Loading';
import Upcoming from './components/Upcoming';
import Planner from './Planner';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

const TodoList = () => {
  const db = getDatabase(); 
  const auth = getAuth();
  const [user, setUser] = useState(auth.currentUser);
  const [tasks, setTasks] = useState([]);  // user's tasks on their todo list
  const [loading, setLoadingState] = useState(true);
  const [recentEvents, setRecentEvents] = useState([]); 
  const [deleted, isDeleted] = useState(false);

  useEffect(() => {
    let isMounted = true //isMoutned=true when component mounts
    
      readTasks()
      .then((tempTasks) => {
        if (isMounted) {setTasks(tempTasks)} //setState called only if component has been mounted
        
      })
      upcomingEvents()
      .then((recents) => {
        if (isMounted) {setRecentEvents(recents)}
        
      })
    
    return() => {isMounted = false} //cleanup function: isMounted=false when component unmounts
  }, [])
  useEffect(() => { 
    console.log('todo list rendered')
    setUser(auth.currentUser);

    setLoadingState(false);
    if (tasks.length > 15) {
      isDeleted(false);
      return;
    }
    if (deleted) {
      reorder(tasks)
      isDeleted(false);
      console.log('reordered')
    }
    /*const timer = setTimeout(() => {
        setLoadingState(false);
        setUser(auth.currentUser);
        
    }, 1000)
    return() => {clearTimeout(timer)}*/
  }, [tasks, recentEvents, user]);  
  
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      document.getElementById("save-list").classList.add("inactive");
    }
   
  })
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addTask();  
    }
  };

  function readTasks() {
    /*var temp = [];
    if (user) { 
      var node = ref(db, "users/" + user.uid + "/todos"); 
      onValue(node, (snapshot) => {
          snapshot.forEach((childSnapshot) => { 
              var item = childSnapshot.val();
              temp.push(item);
          });
          
      }) 
    }
    return temp; */
    return new Promise((resolve, reject) => {
      var tempTasks = [];
      if (user) { 
        var node = ref(db, "users/" + user.uid + "/todos"); 
        onValue(node, (snapshot) => {
          snapshot.forEach((childSnapshot) => { 
              var item = childSnapshot.val();
              tempTasks.push(item);
          });
          resolve(tempTasks);  
        }) 
      }
      // resolve(tempTasks) used to be here, but it kept resolving an empty array.
       
    })

  }
  

  function addTask() {
      var title = document.getElementById("task").value;
      var index = tasks.length; 
      var task = {title: title, time: 25, id: Date.now()};
      if (title !== "") {
          setTasks([...tasks, task]);
          if (user) {document.getElementById("save-list").classList.remove("inactive")}
          document.getElementById("task").value = "";
          if (user) {
              var node = ref(db, 'users/' + user.uid + '/todos/'+ index+'_'+task.id);
              set(node, task); 
          }
      }
  }
  function clear() { 
    setTasks([]);
    document.getElementById("task").value = "";
    if (user) {
        var node = ref(db, "users/" + user.uid + "/todos/"); 
        remove(node);
    }
     
  }
  function deleteTask(id) {
    if (tasks.length > 0) { 
      isDeleted(true);
      setTasks(tasks.filter((task) => task.id !== id))
      
      /*if (user) {
        var node = ref(db, "users/" + user.uid + "/todos/"); 
        onValue(node, (snapshot) => {
          snapshot.forEach((childSnapshot) => { 
              var key = childSnapshot.key
              if (key.includes(id)) {
                var childNode = ref(db, "users/" + user.uid + "/todos/" + key); 
                remove(childNode);
                return;
              }
          })
        }) 
        
      }*/
      
    }
    else {
        document.getElementById("save-list").classList.add("inactive");
      }
  }
  function nameList() {
    if (user) {
      if (tasks.length > 0) {
        document.getElementById("name-list").style.display = "block";
        document.getElementById("exit-save").innerHTML = "cancel" 
      }
    }
    else {
        document.getElementById("user-message").innerHTML = "please log in to save lists to your planner."
        
    } 
  }
  function saveList() { 
    var listName = document.getElementById("list-name").value;
    if (listName === "undefined") {
        listName = " "; 
    }
    if (listName.indexOf("_")!== -1) {
      listName.replace("_", " "); 
    }

    var ms = Date.now();    
    var listId = ms + "_" + listName;       //create unique key
    var date = (new Date(parseInt(ms))).toString(); 
    date = date.substring(0, date.indexOf("G"));    //get date & time

    console.log(listName);

    var list = []; 
    list = {tasks: tasks, date: date}
    
    if (user) {
      var node = ref(db, 'users/' + user.uid + '/savedLists/' + listId);
      set(node, list); 
      document.getElementById("save-message").innerHTML = "list saved"
      document.getElementById("exit-save").innerHTML = "done"
    }
    else {
      document.getElementById("save-message").innerHTML = "please log in to save lists to your planner."
    } 
    
    cancelSaveList(); 
    clear(); 
    setLoadingState(true)
    setTimeout(() => {setLoadingState(false)}, 1000)
  }
  function cancelSaveList() {
    if (document.getElementById("exit-save").innerHTML ===  "done") {
      setTasks([]);
    }
    document.getElementById("list-name").value = ""; 
    document.getElementById("name-list").style.display = "none";
    document.getElementById("exit-save").innerHTML = "cancel"
    document.getElementById("save-message").innerHTML = ""
  }
  function emptyList() {
      if (tasks.length === 0) {
          return(
              <div style={{margin: "10px 0", fontSize: "14px", animation: "fadeIn 500ms"}}>your todo list is empty: add tasks using the textbox.</div>
          )
      }
  }
  function upcomingEvents() {
    return new Promise((resolve, reject) => {
      var now = Date.now(); 
      var recents = []; 
      if (user) { 
        var node = ref(db, "users/" + user.uid + "/events"); 
        onValue(node, (snapshot) => {
          snapshot.forEach((childSnapshot) => { 
              var item = childSnapshot.val();
              item.key = childSnapshot.key; 
              var ms = new Date(item.date).getTime(); 
              if ((ms-now) >= 0 && (ms-now) < 1209600000) {
                recents.push(item); 
              }
          })
          resolve(recents)
        })  
      }
    })
    /*var now = Date.now(); 
    var recents = []; 
      if (user) { 
        var node = ref(db, "users/" + user.uid + "/events"); 
        onValue(node, (snapshot) => {
            snapshot.forEach((childSnapshot) => { 
                var item = childSnapshot.val();
                item.key = childSnapshot.key; 
                var ms = new Date(item.date).getTime(); 
                if ((ms-now) >= 0 && (ms-now) < 1209600000) {
                  recents.push(item); 
                }
            })
        })  
      }
      return recents; */
  }

  function handleOnDragEnd(result) {
    if (!result.destination) return;
    const items = tasks;
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    reorder(items);
    
  }
  function reorder(items) {
    if (user) {
      var node = ref(db, 'users/' + user.uid + '/todos');
      remove(node)
      .then(() => {
        for (let i=0; i<items.length && items.length < 15; i++) {
          var child = ref(db, 'users/' + user.uid + '/todos/'+i+'_'+items[i].id)
          var item = {title: items[i].title, time: items[i].time, id: items[i].id}
          set(child, item); 
        }
      }).catch((err) => {console.log(err)})
    }
  }
  if (loading) {
    return(
      <Loading/>
    )
  }
  return (
    <div className='flex-container'>
      <div className="split" id='split1' onKeyPress={handleKeyPress} > 
              
        <div id="task-list" style={{width: "90%", margin: "10px auto"}}>
          <h2>my to-do list</h2>
          <>{emptyList()}</>
          <DragDropContext onDragEnd={handleOnDragEnd}> 
            <Droppable droppableId='droppable'>
            {(provided) => (
                <div id='droppable' {...provided.droppableProps} ref={provided.innerRef}>
                  <TaskList tasks={tasks} delete={deleteTask} origin="planner"/>
                  {provided.placeholder}
                </div>
            )}
            </Droppable>
          </DragDropContext>
          
          <div className="message" id="user-message" style={{marginTop: "0", fontSize: "12px", fontStyle: "italic"}}></div>
          <div id="name-list" style={{display:"none", animation: "fadeIn 500ms"}}>
            <form>
              <input type="text" className="text-field" id="list-name" placeholder="add a note..."/>
            </form>
            <div className="btn-container">
              <button onClick={saveList} className="btn white">OK</button>
              <button onClick={cancelSaveList} className="btn white" id="exit-save">cancel</button>
            </div>
            <div className="message" id="save-message" style={{marginTop: "0"}}></div>
          </div>
        </div>

        <div style={{width: "90%", margin: "10px auto"}}>
          <form autoComplete="off"  noValidate> 
              <input type="text" placeholder="add a task..." id="task"  required />
          </form>
          
          <br/><br/>
          <div className="btn-container">
            <button onClick={addTask} className="btn" id="add-task" >enter</button>
            <button onClick={nameList} className={tasks.length===0 ? "btn white inactive":"btn white"} style={{backgroundColor:"#ededed"}} id="save-list">save to planner</button>
            <button onClick={clear} className="btn white" style={{backgroundColor:"#ededed"}}>clear</button>
          </div>

          <h2>upcoming events</h2>
          <Upcoming events={recentEvents}/>
        </div> 
        
      </div>

      <div className="divide"></div>

      <div className="split" >
        <Planner origin="todos"/>
      </div>
      


    </div>
  );
}
 
export default TodoList;