import React, { Component } from "react";
import './App.css';
import {
  Route,
  Link,
  NavLink,
  HashRouter
} from "react-router-dom";
import Timer from "./Timer";
import Planner from "./Planner";
import Dashboard from "./Dashboard";
import Settings from "./Settings";
import SignIn from "./SignIn";



class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    }
  }

  componentDidMount() {
    this.setState({
      loading: false
    }, () => {console.log("loaded")})
    
  }
  render() {
    if (this.state.loading === true) {
      console.log("sdfsdfsdf")
      return(
        <div>loading...</div>
      )
    }
    return (
      <HashRouter>
        <div >
          <ul className="nav">
              <li><NavLink to="/auth">login</NavLink></li>
              <li><NavLink to="/settings">settings</NavLink></li>
              <li><NavLink to="/dashboard">dashboard</NavLink></li>
              <li><NavLink to="/planner">planner</NavLink></li>
              <li><NavLink to="/focus-timer">focus timer</NavLink></li>
          </ul>
          <div className="logo"><Link to="/">tiviti</Link></div>
          <div className="content">
          
            <Route path="/focus-timer" component={Timer}/>
            <Route path="/planner" component={Planner}/>
            <Route path="/dashboard" component={Dashboard}/>
            <Route path="/settings" component={Settings}/>
            <Route path="/auth" component={SignIn}/>
          </div>
        </div>
      </HashRouter>
    );
  }
}
 
export default App;