import { useState, useEffect } from 'react'
import { getAuth, onAuthStateChanged } from "@firebase/auth";
import { getDatabase, ref, set, onValue, remove, child } from "firebase/database";
import './App.css';
import TaskList from './components/TaskList';
import Loading from './components/Loading';
import Upcoming from './components/Upcoming';

const Planner = () => {
  const db = getDatabase(); 
  const auth = getAuth();
  const [user, setUser] = useState(auth.currentUser);
  const [tasks, setTasks] = useState(readTasks())   // user's tasks on their todo list
  const [loading, setLoadingState] = useState(true);
  const [recentEvents, setRecentEvents] = useState(upcomingEvents()); 

  
  useEffect(() => { 
      const timer = setTimeout(() => {
          setLoadingState(false);
          setUser(auth.currentUser);
          
      }, 1000)
      return() => {clearTimeout(timer)}
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
      var temp = [];
      if (user) { 
        var node = ref(db, "users/" + user.uid + "/todos"); 
        onValue(node, (snapshot) => {
            snapshot.forEach((childSnapshot) => { 
                var item = childSnapshot.val();
                temp.push(item);
            });
            
        })
        
        return temp; 
      }
      else {
          
          return temp; 
      }
  }
  

  function addTask() {
      var title = document.getElementById("task").value;
      var task = {title: title, time: 25, id: Date.now()};
      if (title !== "") {
          setTasks([...tasks, task]);
          if (user) {document.getElementById("save-list").classList.remove("inactive")}
          document.getElementById("task").value = "";
          if (user) {
              var node = ref(db, 'users/' + user.uid + '/todos/task'+ task.id);
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
      setTasks(tasks.filter((task) => task.id !== id))
      if (user) {
        var node = ref(db, "users/" + user.uid + "/todos/task" + id); 
        remove(node);
      }
      else {
        document.getElementById("save-list").classList.add("inactive");
      }
    }
    
    console.log(tasks);
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
        })  
        
        return recents; 
      }
      else {
          
          return recents; 
      }
  }

  if (loading) {
    return(
      <Loading/>
    )
  }
  return (
    <div className='flex-container'>
      <div className="split">        
        <div id="task-list" style={{width: "90%", margin: "10px auto"}}>
          <h2>my to-do list</h2>
          <>{emptyList()}</>
          <TaskList tasks={tasks} delete={deleteTask} origin="planner"/>
          <div className="btn-container">
              <button onClick={nameList} className="btn white" style={{backgroundColor:"#ededed"}} id="save-list">save to planner</button>
              <button onClick={clear} className="btn white" style={{backgroundColor:"#ededed"}}>clear</button>
          </div>
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
          <h2>upcoming events</h2>
          <Upcoming events={recentEvents}/>
        </div>
        
      </div>

      <div className="divide"></div>

      <div className="split" onKeyPress={handleKeyPress}>
        <div style={{width: "90%", margin: "10px auto"}}>
          <h2 style={{marginBottom: "2px"}}>add a task</h2>
          
          <form autoComplete="off" noValidate> 
              <input type="text" placeholder="task name..." id="task"  required />
          </form>
          <br/><br/>
          <div className="btn-container">
            <button onClick={addTask} className="btn" id="add-task">enter</button>
          </div>
          
        </div>
      </div>
      
      


    </div>
  );
}
 
export default Planner;