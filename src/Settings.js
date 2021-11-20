import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { getAuth } from "firebase/auth"
import { getDatabase } from "firebase/database";
import './App.css';
import Account from "./components/Account";

const Settings = () => {
  const auth = getAuth(); 
  const user = auth.currentUser; 
  const db = getDatabase();
 
  if (user) {
    var dn = user.displayName;  
    var uid = user.uid; 
    var email = user.email; 
    
  }
  else {
    var dn = ""; 
    var uid = ""; 
    var email = ""; 
  }
  window.onload = () => {
    if (user) {
      document.getElementById("not-logged-in").style.display = "none";
    }
  };
  
  return (
    <div className="page-container"> 
      <h1>settings</h1>
      <div id="not-logged-in" ><p><a href="/#/auth" style={{textDecoration: "underline"}}>log in</a> to view your user stats</p></div>
      <Account dn={dn} uid={uid} email={email}/>
    </div>
  )
}
 
export default Settings;