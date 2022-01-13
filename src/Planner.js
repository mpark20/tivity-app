import { useState } from 'react'
import SavedLists2 from "./components/SavedLists2";
import { getAuth, onAuthStateChanged } from "@firebase/auth";
import { getDatabase, ref, set, onValue } from "firebase/database";
import './App.css';
import TaskList from './components/TaskList';

const Planner = () => {
  const [tasks, setTasks] = useState([])
  const db = getDatabase(); 
  const auth = getAuth(); 
  const [user, setUser] = useState(auth.currentUser); 

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUser(auth.currentUser);
    } 
  })

  function addTask() {
    var task = document.getElementById("task").value;
    //var duration = document.getElementById("time").value;
    var index = Date.now(); 
    if (task !== "") {
      setTasks([...tasks, {title: task, id: index}]);
      document.getElementById("save-list").classList.remove("inactive");
      document.getElementById("task").value = "";
      console.log(tasks);
    }
    
  }
  function clear() { 
    setTasks([]);
  }
  function deleteTask(id) {
    if (tasks.length > 0) {
      var newTasks = tasks.filter((task) => task.id !== id)
      setTasks([newTasks])
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
  }
  function cancelSaveList() {
    document.getElementById("list-name").value = ""; 
    document.getElementById("name-list").style.display = "none";
    document.getElementById("exit-save").innerHTML = "cancel"
    document.getElementById("save-message").innerHTML = ""
  }
  

  return (
    <div>
      
      <div className="split">
        <div style={{width: "90%", margin: "10px auto"}}>
          <h2 style={{marginBottom: "2px"}}>task list</h2>
          <div id="task-list">
          <TaskList tasks={tasks} delete={deleteTask} origin="planner"/>  
          </div>
          <form autoComplete="off"> 
              <input type="text" placeholder="task name..." id="task" required />
          </form>
          <br/><br/>
          <div className="btn-container">
            <button onClick={addTask} className="btn" id="add-task">enter</button>
            <button onClick={clear} className="btn white" style={{backgroundColor:"#ededed"}}>clear</button>
            <button onClick={nameList} className="btn white inactive" style={{backgroundColor:"#ededed"}} id="save-list">save to planner</button>
            {/*<AddToCalendar tasks={tasks}/>*/}
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
      <div className="divide"></div>
      <div className="split">
        <h2>my saved lists</h2>
        <SavedLists2/>
      </div>
    </div>
  );
}
 
export default Planner;