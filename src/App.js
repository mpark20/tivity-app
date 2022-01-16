import React, { Component } from "react";
import './App.css';
import {
  Route,
  Link,
  NavLink,
  HashRouter
} from "react-router-dom";
import Timer from "./Timer";
import SavedLists2 from "./SavedLists2";
import TodoList from "./TodoList";
import Dashboard from "./Dashboard";
import Settings from "./Settings";
import SignIn from "./SignIn";
import Loading from "./components/Loading"
import { getDatabase, ref, onValue } from "firebase/database";
import { getAuth } from "firebase/auth";


class App extends Component {
  constructor(props) {
    super(props);
    this.snapshotToArray = this.snapshotToArray.bind(this);
    this.dark = false; 
    this.light = true; 
    this.breakLength = 5;
    this.auth = getAuth(); 
    this.db = getDatabase();
    this.updateUser = this.updateUser.bind(this); 
    this.loading = true;
    this.user = this.auth.currentUser; 
    this.login = "login";
    
    /*this.state = {
      loading: true,
      user: this.auth.currentUser 
    }
    onAuthStateChanged(this.auth, (user) => {
      if (this.user) { 
        var node = ref(this.db, "users/" + this.user.uid + "/settings");
        onValue(node, (snapshot) => {
            this.snapshotToArray(snapshot);
        })
      } else { 
          document.querySelector('body').classList.remove("dark"); 
          console.log("light")
      }
    })
     
    this.loading = false*/
  }
  componentDidMount() {
    this.loading = false; 
    setTimeout(this.updateUser, 1000);
    
  }
  updateUser() {
    this.loading = false;
    this.setState({
      loading: false,
      user: this.auth.currentUser
    }, () => { 
      if (this.user) { 
        var node = ref(this.db, "users/" + this.user.uid + "/settings");
        onValue(node, (snapshot) => {
            this.snapshotToArray(snapshot);
        })
        this.login = "logout"
      } else { 
          document.querySelector('body').classList.remove("dark"); 
          console.log("light")
          this.login = "login"
      } 
      
    })

  }
  snapshotToArray(snapshot) {
    var settings = [];
    var body = document.querySelector('body'); 
    snapshot.forEach(function(childSnapshot) {
        var option = childSnapshot.val();
        settings.push(option); 
    });
    this.breakLength = settings[0];
    this.dark = settings[1]; 
    this.light = settings[2];  
    
    if (this.light===true) {
        body.classList.remove("dark"); 
        console.log("light") 
    }
    else {
        body.classList.add("dark");
        console.log("dark"); 
    } 
  
  }
  render() {
    if (this.loading === true) {
      console.log("loading")
      return(
        <Loading/>
      )
    }
    
    return (
      <HashRouter>
        <div >
          <ul className="nav">
              <li><NavLink to="/auth">{this.login}</NavLink></li>
              <li><NavLink to="/settings">settings</NavLink></li>
              <li><NavLink to="/dashboard">dashboard</NavLink></li>
              <li><NavLink to="/focus-timer">focus timer</NavLink></li>
              <li><NavLink to="/planner">planner</NavLink></li>
              <li><NavLink to="/todo-list">todo list</NavLink></li>
          </ul>
          <div className="logo"><Link to="/">tiviti</Link></div>
          <div className="content">
            <Route path="/todo-list" component={()=> <TodoList/>}/>
            <Route path="/planner" component={()=> <SavedLists2/>}/>
            <Route path="/focus-timer" component={()=> <Timer user={this.user} breakLength={this.breakLength}/>}/>
            
            <Route path="/dashboard" component={()=> <Dashboard user={this.user} light={this.light}/>}/>
            <Route path="/settings" component={()=> <Settings user={this.user} light={this.light} breakLength={this.breakLength}/>}/>
            <Route path="/auth" component={()=> <SignIn user={this.user} light={this.light}/>}/>
          </div>
        </div>
      </HashRouter>
    );
  }
}
 
export default App;