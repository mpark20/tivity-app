import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import './App.css';
import { getAuth } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import "./firebase";

const Dashboard = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const db = getDatabase();
  const heading = document.getElementById("dash-heading");
  var headingContent = "hello user";
  const message = document.getElementById("unlogged");

  if (user) {
    if (message && heading) {
      message.style.display = "none";
      heading.style.marginBottom = "30px";
    }
    headingContent = user.displayName + "'s dashboard";
  } 
  

  return (
    <>
    <div className="page-container">
      <h1 id="dash-heading">{headingContent}</h1>
      <p id="unlogged"><NavLink to="/auth" style={{textDecoration: "underline"}}>log in </NavLink>to view your stats</p>
      <div className="dash">
        <h4>total minutes: </h4>
      </div>
      <div className="dash">
        <h4>number of sessions: </h4>
      </div>
      <div className="dash">
        <h4>average minutes per session: </h4>
      </div>
    </div>
    </>
  )
  
}
 
export default Dashboard;