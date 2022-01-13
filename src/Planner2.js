import React, { Component } from "react";
import SavedLists2 from "./components/SavedLists2";
import { getAuth, onAuthStateChanged } from "@firebase/auth";
import { getDatabase, ref, set, onValue } from "firebase/database";
import './App.css';
import TaskList from './components/TaskList';

class Planner2 extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tasks: [],
        }
        this.db = getDatabase(); 
        this.auth = getAuth(); 
        this.user = this.auth.currentUser; 
        this.newList = this.newList.bind(this);
        this.addTask = this.addTask.bind(this);
        this.deleteTask = this.addTask.bind(this);
        this.clear = this.addTask.bind(this);
        this.addTask = this.addTask.bind(this);
        this.nameList = this.nameList.bind(this);
        this.saveList = this.saveList.bind(this);
        this.cancelSaveList = this.cancelSaveList.bind(this);
        this.savedCount = 0; 
        
    }
    newList() {
        const add = document.getElementById("add-list");
        const btn = document.getElementById("new-entry");
        if (add.style.display === "none") {
            add.style.display = "block";
            btn.innerHTML = "x close"
        }
        else {
            add.style.display = "none"
            btn.innerHTML = "+ new list"
        }
    }     
    
    addTask() {
        var task = document.getElementById("task").value;
        //var duration = document.getElementById("time").value;
        var index = Date.now(); 
        if (task !== "") {
          this.setState({
            tasks: [...this.state.tasks, {title: task, id: index}],
          }, () => {
            console.log(this.state.tasks);  
            document.getElementById("save-list").classList.remove("inactive");
          }); 
          document.getElementById("task").value = "";
        }
        
      }
      clear() { 
        this.setState({
            tasks: [],
        }); 
        console.log("cleared")
      }
      deleteTask(id) {
        const tasks = this.state.tasks;
        if (tasks.length > 0) {
          this.setState({ 
            tasks: tasks.filter((task) => task.id !== id),
          });
        }
        console.log("removed task id: "+id);
        
      }
      nameList() {
        console.log(this.state.tasks); 
        if (this.state.tasks.length > 0) {
          document.getElementById("name-list").style.display = "block";
          document.getElementById("exit-save").innerHTML = "cancel"
        }
      }
    
      saveList() {
        this.listName = document.getElementById("list-name").value;
        if (this.listName.indexOf("_")!= -1) {
          this.listName.replace("_", " "); 
        }
        console.log(this.listName);
        let tasks = this.state.tasks.length;
        var list = [];  
        for (let i=0; i<tasks; i++) {
          list[i] = this.state.tasks[i].title; 
        }
        var dateTime = Date.now(); 
        var listId = dateTime + "_" + this.listName;
        
        if (this.user) {
          var node = ref(this.db, 'users/' + this.user.uid + '/savedLists/' + listId);
          set(node, list); 
          document.getElementById("save-message").innerHTML = "list saved"
          document.getElementById("exit-save").innerHTML = "done"
        }
        else {
          console.log("please log in to save lists to your planner.")
        } 
        window.location.reload();
        this.savedCount += 1;  
      }
      cancelSaveList() {
        document.getElementById("list-name").value = ""; 
        document.getElementById("name-list").style.display = "none";
        document.getElementById("exit-save").innerHTML = "cancel"
        document.getElementById("save-message").innerHTML = ""
      }
      render() {
          return(
            <>
            <div className="page-container" >
                <h2>my to-do lists</h2>
                <div className="btn-container" ><button onClick={this.newList} className="btn" id="new-entry">+ new list</button></div>
                <div id="add-list" style={{display:"none", margin: "30px 0px"}}>
                    <div id="task-list">
                        <TaskList tasks={this.state.tasks} delete={this.deleteTask} origin="planner"/>
                    </div>
                    <form autoComplete="off"> 
                        <input type="text" placeholder="task name..." id="task" required />
                    </form>
                    <br/><br/>
                    <div className="btn-container">
                        <button onClick={this.addTask} className="btn" id="add-task">+ task</button>
                        <button onClick={this.clear} className="btn white" style={{backgroundColor:"#ededed"}}>clear</button>
                        <button onClick={this.nameList} className="btn white inactive" style={{backgroundColor:"#ededed"}} id="save-list">save list to planner</button>
                        {/*<AddToCalendar tasks={this.state.tasks}/>*/}
                    </div>
                    <div id="name-list" style={{display:"none"}}>
                        <form>
                        <input type="text" className="text-field" id="list-name" placeholder="enter list name..."/>
                        </form>
                        <div className="btn-container">
                        <button onClick={this.saveList} className="btn white">OK</button>
                        <button onClick={this.cancelSaveList} className="btn white" id="exit-save">cancel</button>
                        </div>
                        <div className="message" id="save-message" style={{marginTop: "0"}}></div>
                    </div>
                </div>
                
                <SavedLists2 key={this.savedCount}/>
            </div>
            
          </>
          )
      }
}
export default Planner2;