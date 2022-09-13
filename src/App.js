import React, { Component } from "react";
import './App.css';
import {
  Route,
  Link,
  NavLink,
  Switch,
  HashRouter
} from "react-router-dom";
import Landing from "./Landing";
import Timer from "./Timer";
/*import Planner from "./Planner";*/
import TodoList from "./TodoList";
import Calendar from "./Calendar"
import Settings from "./Settings";
import Settings2 from "./Settings2";
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
    this.checkTheme = this.checkTheme.bind(this);
    this.logout = this.logout.bind(this); 
    this.toggleNav = this.toggleNav.bind(this); 
    this.closeNav = this.closeNav.bind(this);
    this.hideNav = this.hideNav.bind(this);
    //this.navWidth = window.innerWidth > 700 ? '20%' : '100%';
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
        if (localStorage.getItem('theme') == null) {
          localStorage.setItem('theme', 'blue');
          console.log('test')
        }
        if (localStorage.getItem('breakLength') == null) {
          localStorage.setItem('breakLength', 5);
          console.log('test')
        }
        this.setState({
          loading: false,
          user: this.auth.currentUser, 
          theme: localStorage.getItem('theme'),
          breakLength: localStorage.getItem('breakLength'),
          navOpen: this.state.navOpen,
        })
        console.log(localStorage.getItem('breakLength'), localStorage.getItem('theme'));
        this.checkTheme();
    }

  }
  snapshotToArray(snapshot) {
    var settings = [];
    
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
    this.checkTheme(); 
    
    
  }
  checkTheme() {
    var body = document.querySelector('body'); 

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
    var content = document.getElementsByClassName('content');
    if (this.state.navOpen) {
      this.setState({
        loading: this.state.loading,
        user: this.auth.currentUser,
        theme: this.state.theme,
        breakLength: this.state.breakLength,
        navOpen: false,
      })
      if (window.innerWidth > 700) {
        for (let i=0; i<content.length; i++) {
          content[i].style.margin = '0 1px 0 0';
        }
      }
      
    }
    else {
      this.setState({
        loading: this.state.loading,
        user: this.auth.currentUser,
        theme: this.state.theme,
        breakLength: this.state.breakLength,
        navOpen: true,
      })
      if (window.innerWidth > 700) {
        for (let i=0; i<content.length; i++) {
          content[i].style.margin = '0 1px 0 20%';
        }
      }
      
    }
  }
  closeNav() {
    var x = window.matchMedia('max-width: 700px')
    if (x.matches) {
      this.setState({
        loading: this.state.loading,
        user: this.auth.currentUser,
        theme: this.state.theme,
        breakLength: this.state.breakLength,
        navOpen: false,
      })
    }
  }
  hideNav() {
    console.log('hideNav')
    this.setState({
      loading: this.state.loading,
      user: this.auth.currentUser,
      theme: this.state.theme,
      breakLength: this.state.breakLength,
      navOpen: false,
    })
    
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
            <div id='navbar' style={{width: this.state.navOpen ? 'inherit' : '0'}}>
              
              <div className="logo" style={{display: this.state.navOpen ? 'block' : 'none'}}>
                <p style={{display:'inline'}}>tivity</p>
                <div className='x-icon' onClick={this.toggleNav} style={{display: this.state.navOpen ? 'block' : 'none'}}>&#xab;</div>
              </div>
              
              <ul className="nav" style={{display: this.state.navOpen ? 'block' : 'none'}}>
                  {this.state.user ? <li><p style={{color: this.state.theme==='dark' ? 'white': 'black'}}>hello, {this.state.user.displayName}!</p></li> : <></>}
                  <li onClick={this.closeNav}>{this.state.user ? <></> : <NavLink exact to="/">home</NavLink>}</li>
                  <li onClick={this.closeNav}>{this.state.user ? <NavLink to="/todo">todo list</NavLink>: <></>}</li>
                  {/*<li>{this.state.user ? <NavLink to="/planner">planner</NavLink>: <></>}</li>*/}
                  <li onClick={this.closeNav}>{this.state.user ? <NavLink to="/calendar">calendar</NavLink>: <></>}</li>
                  <li onClick={this.closeNav}><NavLink to="/focus-timer">focus timer</NavLink></li>
                  <li onClick={this.closeNav}>{this.state.user ? <NavLink to="/dashboard">dashboard</NavLink>: <></>}</li>
                  <li onClick={this.closeNav}>{this.state.user ? <NavLink to="/settings">settings</NavLink>: <NavLink to="/guest-settings">settings</NavLink>}</li>
                  <li onClick={this.closeNav}>{this.state.user ? <></> : <NavLink to="/login">log in</NavLink>}</li>
                  
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
            <Route path="/settings" component={()=> <Settings origin='returning' user={this.state.user} theme={this.state.theme} breakLength={this.state.breakLength}/>}/>
            <Route path="/guest-settings" component={()=> <Settings2 origin='guest' theme={this.state.theme} breakLength={this.state.breakLength}/>}/>
            <Route path="/login" component={()=> <SignIn user={this.state.user} light={this.light}/>}/>
            <Route path="/focus-timer" component={()=> <Timer user={this.state.user} breakLength={this.state.breakLength} />}/>
            <Route exact path="/" component={()=> <Landing hideNav={this.hideNav}/>}/>
            </Switch>
          </div>
        </div>
      </HashRouter>
    );
  }
}
 
export default App;