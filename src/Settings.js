import { getAuth, onAuthStateChanged } from "firebase/auth";
import './App.css';
import Account from "./components/Account";
import Display from "./components/Display";
import { useEffect, useState } from "react";

const Settings = () => {
  const auth = getAuth();
  const user = auth.currentUser; 

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) { 
        document.getElementById("not-logged-in").style.display = "none";
      } else { 
        document.getElementById("not-logged-in").style.display = "block"; 
      }
    });
  }, []);

  return (
    <div className="page-container">  
      <h1>settings</h1>
      <div id="not-logged-in" ><p><a href="/#/auth" style={{textDecoration: "underline"}}>log in</a> to view your user stats</p></div>
      <Account/>
      <Display/>
    </div>
  )
  
  
}
 
export default Settings;