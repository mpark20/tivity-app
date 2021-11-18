import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { getAuth } from "firebase/auth"
import { getDatabase, ref, set } from "firebase/database";
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
    if (user == null) {
      const p = document.createElement("p");
      p.innerHTML = "log in to view user settings"
      const div = document.getElementById("not-logged-in");
      div.appendChild(p);
      console.log('test')
    }
    
  };
  
  return (
    <div className="page-container"> 
      <h1>settings</h1>
      <div id="not-logged-in" ></div>
      <Account dn={dn} uid={uid} email={email}/>
    </div>
  )
}
 
export default Settings;