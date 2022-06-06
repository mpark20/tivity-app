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
/*import Planner from "./Planner";*/
import TodoList from "./TodoList";
import Calendar from "./Calendar"
import Settings from "./Settings";
import SignIn from "./SignIn";
import Dashboard from "./Dashboard";
import Loading from "./components/Loading"
import { getDatabase, ref, onValue } from "firebase/database";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import Logout from "./components/Logout";

class App extends Component {
  constructor(props) {
    super(props);
    this.snapshotToArray = this.snapshotToArray.bind(this);
    this.auth = getAuth(); 
    this.db = getDatabase(); 
    this.updateUser = this.updateUser.bind(this);
    this.logout = this.logout.bind(this); 
    this.toggleNav = this.toggleNav.bind(this); 
    this.state = {
      loading: true,
      user: getAuth().currentUser,
      theme: 'blue',
      navOpen: true,
    }
    
    onAuthStateChanged(getAuth(), (user) => {
      this.updateUser();
    })
  }
  componentDidMount() {
    this.timer = setTimeout(this.updateUser, 1000);
    //this.updateUser(); 
  }
  componentWillUnmount() {
    clearTimeout(this.timer); 
  }
  updateUser() {
    this.setState({
      loading: false,
      user: this.auth.currentUser, 
      theme: this.state.theme,
      navOpen: this.state.navOpen,
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
      navOpen: this.state.navOpen,
    })
    
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
  logout() {
    signOut(this.auth).then(() => {
      this.setState({
        loading: this.state.loading,
        user: null,
        theme: this.state.theme,
        breakLength: this.state.breakLength,
        navOpen: this.state.navOpen,
      })
      document.querySelector("body").classList.remove("dark");
      document.querySelector("body").classList.remove("red");
      window.location.href = "#/login";
    }).catch((error) => {
        console.log(error); 
    });   
  }
  toggleNav() {
    if (this.state.navOpen) {
      this.setState({
        loading: this.state.loading,
        user: this.auth.currentUser,
        theme: this.state.theme,
        breakLength: this.state.breakLength,
        navOpen: false,
      })
    }
    else {
      this.setState({
        loading: this.state.loading,
        user: this.auth.currentUser,
        theme: this.state.theme,
        breakLength: this.state.breakLength,
        navOpen: true,
      })
    }
  }
  render() {
    
    if (this.state.loading) {
      return(
        <Loading/>
      )
    }
    return (
      <HashRouter>
        <div>
          
          <div className='nav-container'>
            <div id='navbar' style={{width: this.state.navOpen ? '100%' : '0'}}>
              
              <div className="logo" style={{display: this.state.navOpen ? 'block' : 'none'}}>
                <p style={{display:'inline'}}>tivity</p>
                <div className='x-icon' onClick={this.toggleNav} style={{display: this.state.navOpen ? 'block' : 'none'}}>&#xab;</div>
              </div>
              
              <ul className="nav" style={{display: this.state.navOpen ? 'block' : 'none'}}>
                  {this.state.user ? <li><p style={{color: this.state.theme==='dark' ? 'white': 'black'}}>hello, {this.state.user.displayName}!</p></li> : <></>}
    
                  <li>{this.state.user ? <NavLink to="/todo">todo list</NavLink>: <></>}</li>
                  {/*<li>{this.state.user ? <NavLink to="/planner">planner</NavLink>: <></>}</li>*/}
                  <li>{this.state.user ? <NavLink to="/calendar">calendar</NavLink>: <></>}</li>
                  <li><NavLink exact to="/">focus timer</NavLink></li>
                  <li>{this.state.user ? <NavLink to="/dashboard">dashboard</NavLink>: <></>}</li>
                  <li>{this.state.user ? <NavLink to="/settings">settings</NavLink>: <></>}</li>
                  <li>{this.state.user ? <></> : <NavLink to="/login">log in</NavLink>}</li>
                  
              </ul>
            </div>
          </div>
          <div className='navBar2' >
            <Logout logout={this.logout}/>
            <div className='menu-icon' onClick={this.toggleNav} style={{visibility: this.state.navOpen ? 'hidden' : 'visible'}}>&#9776;</div>
            
          </div>
          <div className="content">
          
            <Switch>
            <Route path="/todo" component={()=> <TodoList theme={this.state.theme}/>}/>
            {/*<Route path="/planner" component={()=> <Planner user={this.state.user}/>}/>*/}
            <Route path="/calendar" component={()=> <Calendar/>}/>
            <Route path="/dashboard" component={()=> <Dashboard/>}/>
            <Route path="/settings" component={()=> <Settings user={this.state.user} theme={this.state.theme} breakLength={this.state.breakLength}/>}/>
            <Route path="/login" component={()=> <SignIn user={this.state.user} light={this.light}/>}/>
            <Route exact path="/" component={()=> <Timer user={this.state.user} breakLength={this.state.breakLength} />}/>
            </Switch>
          </div>
        </div>
      </HashRouter>
    );
  }
}
 
export default App;