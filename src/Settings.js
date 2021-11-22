import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { getAuth, deleteUser, signOut } from "firebase/auth"
import { getDatabase, set, ref, remove } from "firebase/database";
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
      document.getElementById("deleteUser").style.display = "block"; 
    }
    else {
      document.getElementById("deleteUser").style.display = "none"; 
      
    }
  };
  
  function deleteAcct() {
    deleteUser(user)
    .then(() => {
      var node = ref(db, 'users/' + user.uid);
      remove(node); 
      console.log("account deleted"); 
      signOut(auth).then(() => {
        window.location.reload();
      }).catch((error) => {
        console.log(error); 
      });  
    })
    .catch((error) => {
      console.log(error); 
    });
  }
  return (
    <div className="page-container"> 
      <h1>settings</h1>
      <div id="not-logged-in" ><p><a href="/#/auth" style={{textDecoration: "underline"}}>log in</a> to view your user stats</p></div>
      <Account dn={dn} uid={uid} email={email}/>
      <button class="btn white" id="deleteUser" onClick={deleteAcct}>delete account</button>
    </div>
  )
}
 
export default Settings;