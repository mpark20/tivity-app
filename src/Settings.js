import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { getAuth, deleteUser, signOut, onAuthStateChanged } from "firebase/auth"
import { getDatabase, ref, remove } from "firebase/database";
import './App.css';
import Account from "./components/Account";

const Settings = () => {
  const auth = getAuth(); 
  const user = auth.currentUser; 
  const db = getDatabase();
  var dn; 
  var uid; 
  var email; 

  if (user) {
    dn = user.displayName;  
    uid = user.uid; 
    email = user.email; 
    console.log("user!")
  } else { 
    console.log("no user"); 
    dn = ""; 
    uid = ""; 
    email = "";
  }
  
  onAuthStateChanged(auth, (user) => {
    var nl = document.getElementById("not-logged-in");
    var du = document.getElementById("deleteUser");
    if (user) {
      nl.style.display = "none"; 
      console.log("user!"); 
    } else {
      du.style.display = "none"; 
      console.log("no user");
    }
  });

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
      <button className="btn white" id="deleteUser" onClick={deleteAcct}>delete account</button>
    </div>
  )
}
 
export default Settings;