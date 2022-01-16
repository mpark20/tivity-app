import { useState, useEffect } from 'react'
import { getAuth, onAuthStateChanged } from "@firebase/auth";
import { getDatabase, ref, set, onValue, push, remove } from "firebase/database";
import './App.css';
import TaskList from './components/TaskList';
import Loading from './components/Loading';

const Planner = () => {
    const db = getDatabase(); 
    const auth = getAuth();
    const user = auth.currentUser;
    const [tasks, setTasks] = useState([])   
    const [loading, setLoadingState] = useState(true);
    var todos = []; 

    if (user) {
        var node = ref(db, "users/" + user.uid + "/todos"); 
        onValue(node, (snapshot) => {
            snapshotToArray(snapshot)
        })
    }
    useEffect(() => {  
        readTasks(); 
        console.log(tasks);
        setLoadingState(false);
    }, [tasks]);
    function readTasks() {
        //var temp = [];
        onAuthStateChanged(auth, (user) => {
            if (user) {
                var node = ref(db, "users/" + user.uid + "/todos"); 
                onValue(node, (snapshot) => {
                    snapshotToArray(snapshot)
                })
            }
        }) 
        //setTimeout(()=>{return temp}, 500)
    }
    function snapshotToArray(snapshot) {
        snapshot.forEach((childSnapshot) => { 
            var item = childSnapshot.val();
            item.key = childSnapshot.key;
            todos.push(item);
        });
        
    };
    
    

    function addTask() {
        var title = document.getElementById("task").value;
        var index = Date.now(); 
        var task = {title: title, id: index};
        if (task !== "") {
            todos.push(task);
            setTasks(todos);
            document.getElementById("save-list").classList.remove("inactive");
            document.getElementById("task").value = "";
            if (user) {
                var node = ref(db, 'users/' + user.uid + '/todos');
                push(node, task); 
            }
        }
    }
  function clear() { 
    setTasks([]);
    document.getElementById("task").value = "";
    var node = ref(db, "users/" + user.uid + "/todos/"); 
    remove(node); 
  }
  function deleteTask(id) {
    if (tasks.length > 0) { 
      setTasks(tasks.filter((task) => task.id !== id))
    }
    else {
        document.getElementById("save-list").classList.add("inactive");
    }
    console.log(tasks);
  }
  function nameList() {
    if (tasks.length > 0) {
      document.getElementById("name-list").style.display = "block";
      document.getElementById("exit-save").innerHTML = "cancel"
    }
  }
  function saveList() {
    var listName = document.getElementById("list-name").value;
    if (listName.indexOf("_")!== -1) {
      listName.replace("_", " "); 
    }
    console.log(listName);
    var list = [];  
    for (let i=0; i<tasks.length; i++) {
      list[i] = tasks[i].title; 
    }
    var dateTime = Date.now(); 
    var listId = dateTime + "_" + listName;
    
    if (user) {
      var node = ref(db, 'users/' + user.uid + '/savedLists/' + listId);
      set(node, list); 
      document.getElementById("save-message").innerHTML = "list saved"
      document.getElementById("exit-save").innerHTML = "done"
    }
    else {
      console.log("please log in to save lists to your planner.")
    } 
    cancelSaveList(); 
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
  if (loading) {
    return(
      <Loading/>
    )
  }

  return (
    <>
      
      <div className="split">
        <div style={{width: "90%", margin: "10px auto"}}>
          <h2 style={{marginBottom: "2px"}}>add a task</h2>
          
          <form autoComplete="off"> 
              <input type="text" placeholder="task name..." id="task" required />
          </form>
          <br/><br/>
          <div className="btn-container">
            <button onClick={addTask} className="btn" id="add-task">enter</button>
            {/*<AddToCalendar tasks={tasks}/>*/}
          </div>
          
        </div>
      </div>
      <div className="divide"></div>
      <div className="split">        
        <div id="task-list" style={{width: "80%", margin: "10px auto"}}>
          <h2>my to-do list</h2>
          <TaskList tasks={tasks} delete={deleteTask} origin="planner"/>
          <div className="btn-container">
              <button onClick={nameList} className="btn white" style={{backgroundColor:"#ededed"}} id="save-list">save to planner</button>
              <button onClick={clear} className="btn white" style={{backgroundColor:"#ededed"}}>clear</button>
          </div>
          
          <div id="name-list" style={{display:"none"}}>
            <form>
              <input type="text" className="text-field" id="list-name" placeholder="enter list name..."/>
            </form>
            <div className="btn-container">
              <button onClick={saveList} className="btn white">OK</button>
              <button onClick={cancelSaveList} className="btn white" id="exit-save">cancel</button>
            </div>
            <div className="message" id="save-message" style={{marginTop: "0"}}></div>
          </div>
        </div>
        
      </div>
    </>
  );
}
 
export default Planner;