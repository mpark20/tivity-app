import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import './App.css';
import { 
  getAuth, 
  onAuthStateChanged,
} from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import "./firebase";

const Dashboard = () => {
  const auth = getAuth();
  const user = auth.currentUser; 
  const db = getDatabase(); 
  var displayName = "user";
  
  
  if (user) {
    const uid = user.uid;
    displayName = user.displayName; 
  } else { 
  }
  

  return (
    <>
    <h1>hello {displayName}</h1>
    <div id="not-logged-in"><p><NavLink to="/auth" style={{textDecoration: "underline"}}>log in </NavLink>to view your stats</p></div>
    <div class="container">
      <div class="dash">
        <h4>total minutes: </h4>
      </div>
      <div class="dash">
        <h4>number of sessions: </h4>
      </div>
      <div class="dash">
        <h4>average minutes per session: </h4>
      </div>
    </div>
    </>
  )
  
}
 
export default Dashboard;