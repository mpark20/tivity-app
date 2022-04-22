import React, { Component } from "react";
import './App.css';
import {
  Route,
  Link,
  NavLink,
  Switch,
  HashRouter
} from "react-router-dom";
import Timer from "./Timer";
import SavedLists2 from "./SavedLists2";
import TodoList from "./TodoList";
import Calendar from "./Calendar"
import Settings from "./Settings";
import SignIn from "./SignIn";
import Loading from "./components/Loading"
import { getDatabase, ref, onValue } from "firebase/database";
import { getAuth } from "firebase/auth";


class App extends Component {
  constructor(props) {
    super(props);
    this.snapshotToArray = this.snapshotToArray.bind(this);
    //this.theme = 'blue';
    //this.dark = false; 
    //this.light = true; 
    //this.breakLength = 5;
    this.auth = getAuth(); 
    this.db = getDatabase(); 
    this.updateUser = this.updateUser.bind(this); 
    this.loading = true; 
    this.login = "login";
    this.state = {
      loading: true,
      user: this.auth.currentUser,
      theme: 'blue',
    }
    /*
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
    this.timer = setTimeout(this.updateUser, 1000);
  }
  componentWillUnmount() {
    clearTimeout(this.timer); 
  }
  updateUser() {
    this.setState({
      loading: false,
      user: this.auth.currentUser, 
      theme: this.state.theme,
    })
    
    if (this.state.user) { 
      var node = ref(this.db, "users/" + this.state.user.uid + "/settings");
      onValue(node, (snapshot) => {
          this.snapshotToArray(snapshot);
      })
    } else { 
        document.querySelector('body').classList.remove("dark"); 
        document.querySelector('body').classList.remove("red");
    }

  }
  snapshotToArray(snapshot) {
    var settings = [];
    var body = document.querySelector('body'); 
    snapshot.forEach(function(childSnapshot) {
        var option = childSnapshot.val();
        settings.push(option); 
    });
    //this.breakLength = parseInt(settings[0]);
    //this.theme = settings[1];
    this.setState({
      loading: false,
      user: this.auth.currentUser,
      theme: settings[1],
      breakLength: parseInt(settings[0]),
    })
    
    //this.dark = settings[1]; 
    //this.light = settings[2];  
    
    /*if (this.light===true || this.light === "true") {
        body.classList.remove("dark"); 
        console.log("light") 
    }
    else {
        body.classList.add("dark");
        console.log("dark"); 
    } */
    if (this.state.theme === 'blue') {
      body.classList.remove("dark");
      body.classList.remove('red');
      console.log('b')
    }
    else if (this.state.theme === 'red') {
      body.classList.add('red');
      body.classList.remove("dark");
      console.log('r')
    }
    else if (this.state.theme === 'dark') {
      body.classList.add("dark");
      body.classList.remove('red');
    }
    
  }
  render() {
    if (this.state.loading === true) {
      
      return(
        <Loading/>
      )
    }
    
    return (
      <HashRouter>
        <div>
          <div className='navbar'>
            <div className="logo"><Link to="/">tivity</Link></div>
            <ul className="nav">
                <li><NavLink to="/todo">todo list</NavLink></li>
                <li><NavLink to="/planner">planner</NavLink></li>
                <li><NavLink to="/calendar">calendar</NavLink></li>
                <li><NavLink exact to="">focus timer</NavLink></li>
                {/*}<li><NavLink to="/dashboard">dashboard</NavLink></li>{*/}
                <li><NavLink to="/settings">settings</NavLink></li>
                <li><NavLink to="/auth">{this.login}</NavLink></li>
            </ul>
          </div>
          <div className="content">
            <Switch>
            <Route path="/todo" component={()=> <TodoList/>}/>
            <Route path="/planner" component={()=> <SavedLists2/>}/>
            <Route path="/calendar" component={()=> <Calendar/>}/>
            <Route path="/settings" component={()=> <Settings user={this.state.user} theme={this.state.theme} breakLength={this.state.breakLength}/>}/>
            <Route path="/auth" component={()=> <SignIn user={this.state.user} light={this.light}/>}/>
            <Route exact path="/" component={()=> <Timer user={this.state.user} breakLength={this.state.breakLength} />}/>
            </Switch>
          </div>
        </div>
      </HashRouter>
    );
  }
}
 
export default App;