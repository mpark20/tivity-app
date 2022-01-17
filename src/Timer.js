import React, { Component } from "react";
import './App.css';
import TaskList from "./components/TaskList"
import Countdown from "./components/Countdown"
//import AddToCalendar from "./components/AddToCalendar"
import { getDatabase, set, ref, onValue } from "firebase/database"; 
import { getAuth, onAuthStateChanged } from "firebase/auth";

class Timer extends Component {
  constructor(props) {
    super(props); 
    this.state = {
      tasks: [],
      timeLeft: {h:"00", m:"00", s:"00"},
    } 
    this.totalTime = 0; 
    this.addTask = this.addTask.bind(this);
    this.clear = this.clear.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
    this.setTimer = this.setTimer.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.intervals = 0;
    this.timer = 0;
    this.breakLength = props.breakLength; 
    this.isBreak = false; 
    this.insertBreaks = true;
    this.changeBreakOption = this.changeBreakOption.bind(this);
    this.tick = this.tick.bind(this);
    this.formatted = this.formatted.bind(this);
    //this.adjustIDs = this.adjustIDs.bind(this);
    this.pauseTimer = this.pauseTimer.bind(this);
    this.pauses = 0; 
    this.resumeTimer = this.resumeTimer.bind(this);
    this.clearTimer = this.clearTimer.bind(this);
    this.saveList = this.saveList.bind(this);
    this.setBreakLength = this.setBreakLength.bind(this);
    this.nameList = this.nameList.bind(this);
    this.listName = ""; 
    this.cancelSaveList = this.cancelSaveList.bind(this);
    this.auth = getAuth(); 
    this.db = getDatabase(); 
    this.user = this.auth.currentUser;

    onAuthStateChanged(this.auth, (user) => {
      if (this.user) {
        console.log("user!!");
        var node = ref(this.db, "users/" + this.user.uid + "/settings/breakLength");
        onValue(node, (snapshot) => {
            this.setBreakLength(snapshot.val());  
        })
      }
    })
    
    
  }
  setBreakLength(bl) {
    this.breakLength = bl;
    console.log(bl)
  }
  formatted(num) {
    var doubleDigit = ("0" + num).slice(-2);
    return doubleDigit; 
  }
  addTask() {
    var task = document.getElementById("task").value;
    var duration = document.getElementById("time").value;
    var index = Date.now(); 
    if (task !== "" && duration !== "") {
      this.setState({
      tasks: [...this.state.tasks, {title: task, time: duration, id: index}],
      timeLeft: {...this.state.timeLeft}
      }, () => {
        console.log(this.state.tasks); 
        this.setTimer(this.state.tasks[0].time); 
        document.getElementById("task-label").innerHTML = this.state.tasks[0].title;
        document.getElementById("save-list").classList.remove("inactive");
      }); 

      document.getElementById("task").value = "";
      document.getElementById("time").value = "";
    }
    
  }
  clear() { 
    this.setState({
      tasks: [],
      timeLeft: {h: "00", m: "00", s: "00"},
    });
    this.totalTime = 0; 
    this.pauses = 0;   
    document.getElementsByClassName("timer-container")[0].removeAttribute("id"); 
    document.getElementById("summary").style.opacity = "0";
  }
  deleteTask(id) {
    const tasks = this.state.tasks;
    if (tasks.length > 0) {
      this.setState({ 
        tasks: tasks.filter((task) => task.id !== id),
      }, ()=>{this.adjustIDs(id)});
    }
    console.log("removed task id: "+id);
    
  }
  /*adjustIDs(id) {
    if (this.state.tasks.length > 0) {
      document.getElementById("save-list").classList.remove("inactive");
    }
    var tasks = this.state.tasks;
    tasks = tasks.slice(0, id);
    var newTasks = [];
    for (let i=id; i<this.state.tasks.length; i++) { // for tasks that had IDs greater than the removed task...
      var task = this.state.tasks[i].title;
      var duration = this.state.tasks[i].time;
      var newId = this.state.tasks[i].id - 1;
      newTasks.push({title: task, time: duration, id: newId});
    }
    tasks.concat(newTasks);
    this.setState({ 
      tasks: tasks,
      timeLeft: {...this.state.timeLeft},
    }, ()=>{console.log(this.state.tasks)})
  }*/
  setTimer(minutes) {
    var hr = this.formatted(Math.floor(minutes / 60)); //# of whole hours
    var min = this.formatted(Math.floor(minutes % 60)); //# of leftover minutes once converted into hours
    var sec = "00";
    this.setState({
      tasks: [...this.state.tasks],
      timeLeft: {h: hr, m: min, s: sec},
    })
    
  }
  startTimer() {
    //this.setTimer(parseInt(this.state.tasks[this.intervals].time));
    if ((parseInt(this.state.timeLeft.h) > 0 || parseInt(this.state.timeLeft.m) > 0)) {
      document.getElementsByClassName("timer-container")[0].setAttribute("id", "myDIV");
      this.totalTime += 1; 
      this.timer = setInterval(this.tick, 10);
    } 
  }
  tick() {
    
    // Check if we're at zero.
    if (parseInt(this.state.timeLeft.h) === 0 && parseInt(this.state.timeLeft.m) === 0 && parseInt(this.state.timeLeft.s) === 0) { 
      console.log(this.state.timeLeft)
      if (!this.isBreak) {  //if the interval that just finished was not a break, the next one will be.
        alert(this.state.tasks[this.intervals].title + ": time's up")
        this.intervals += 1;
        if (this.insertBreaks && this.intervals < this.state.tasks.length) {
          this.isBreak = true; 
        }
      }
      else {  //if the interval that just finished was a break, the next one will not be.
        alert(this.breakLength + "min break has finished")
        this.isBreak = false;
      }
      if (this.intervals < this.state.tasks.length) {
        if (this.isBreak) {
          this.setTimer(this.breakLength);
          document.getElementById("task-label").innerHTML = "break";
        }
        else {
          this.setTimer(parseInt(this.state.tasks[this.intervals].time));
          document.getElementById("task-label").innerHTML = this.state.tasks[this.intervals].title;
        }
        
      }
      else {
        clearInterval(this.timer); 
        this.intervals = 0; 
        document.getElementById("task-label").innerHTML = "";
        document.getElementsByClassName("timer-container")[0].removeAttribute("id"); 
        document.getElementById("summary").style.opacity = "1";;
      }
    }
    else {
      console.log(this.state.timeLeft)
      var hr = parseInt(this.state.timeLeft.h);
      var min = parseInt(this.state.timeLeft.m);
      var sec = parseInt(this.state.timeLeft.s);
      if (sec === 0 && (min > 0 || hr > 0)) {
        sec = 60;
        min--;
      }  
      if (min === 0 && hr > 0) {
        min = 60;
        hr--; 
      }
      this.setState({
        tasks: [...this.state.tasks],
        timeLeft: {h: this.formatted(hr), m: this.formatted(min), s: this.formatted(sec - 1)}
      });
      if(!this.isBreak){this.totalTime += 1}
    }
    
  }
  pauseTimer() {
    this.pauses += 1; 
    clearInterval(this.timer);
    console.log("paused")
    document.getElementById("pause").style.display = "none";
    document.getElementById("resume").style.display = "block";
  }
  resumeTimer() {
    this.timer = setInterval(this.tick, 10);
    document.getElementById("resume").style.display = "none";
    document.getElementById("pause").style.display = "block";
  }
  clearTimer() {
    this.setState({
      tasks: [...this.state.tasks],
      timeLeft: {h: "00", m: "00", s: "00"}
    });
    clearInterval(this.timer); 
    document.getElementById("pause").style.display = "";
    document.getElementById("resume").style.display = "none";
    document.getElementsByClassName("timer-container")[0].removeAttribute("id");
    this.totalTime = 0;
    this.pauses = 0;   
  }
  changeBreakOption() {
    this.insertBreaks = !this.insertBreaks;
    console.log(this.insertBreaks);
  }
  nameList() {
    if (this.state.tasks.length > 0) {
      document.getElementById("name-list").style.display = "block";
      document.getElementById("exit-save").innerHTML = "cancel"
    }
  }

  saveList() {
    this.listName = document.getElementById("list-name").value;
    if (this.listName.indexOf("_")!== -1) {
      this.listName.replace("_", " "); 
    }
    console.log(this.listName);
    
    var dateTime = Date.now(); 
    var listId = dateTime + "_" + this.listName;
    
    if (this.user) {
      var node = ref(this.db, 'users/' + this.user.uid + '/savedLists/' + listId);
      set(node, this.state.tasks); 
      document.getElementById("save-message").innerHTML = "list saved"
      document.getElementById("exit-save").innerHTML = "done"
    }
    else {
      console.log("please log in to save lists to your planner.")
    } 
    
    
  }
  cancelSaveList() {
    document.getElementById("list-name").value = ""; 
    document.getElementById("name-list").style.display = "none";
    document.getElementById("exit-save").innerHTML = "cancel"
    document.getElementById("save-message").innerHTML = ""
  }
  render() {
    
    return (
      <div className="timer-container" > 
          

          <div className="split">
            <div style={{width: "80%", margin: "10px auto"}}>
              <h2>task list</h2>
              <div id="task-list">
                <TaskList tasks={this.state.tasks} delete={this.deleteTask} origin="timer"/>
              </div>
              <form autoComplete="off" onLoad={this.enterToClick}> 
                  <input type="text" placeholder="task name..." id="task" required />
                  <input type="number" step="15" placeholder="minutes" id="time" required/>
              </form>
              <br/><br/>
              <div className="btn-container">
                <button onClick={this.addTask} className="btn" id="add-task">enter</button>
                <button onClick={this.clear} className="btn white" style={{backgroundColor:"#ededed"}}>clear</button>
                <button onClick={this.nameList} className="btn white inactive" style={{backgroundColor:"#ededed"}} id="save-list">save to planner</button>
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
              <form>
                <input type="checkbox" placeholder="insert breaks" onChange={this.changeBreakOption} id="break-opt" style={{margin: "0 3px"}} defaultChecked></input>
                <label htmlFor="break-opt" style={{fontSize: "14px"}}>insert breaks</label>
              </form>
              <div className="message" id="summary">
                <button onClick={this.clear} className="x-btn">x</button>
                <h3 style={{display:"inline"}}>session summary</h3>
                <p>duration: {((this.totalTime)/60.0).toFixed(1)} min</p>
                <p>pauses: {this.pauses}</p>
                <p># of tasks: {this.state.tasks.length}</p>
              </div>
            </div>
          </div>
          <div className="divide"/>
          <div className="split" >  
            <Countdown state={this.state} startTimer={this.startTimer} pauseTimer={this.pauseTimer} resumeTimer={this.resumeTimer} clearTimer={this.clearTimer}/>
          </div>

          
        </div>
    );
  }
}


export default Timer;