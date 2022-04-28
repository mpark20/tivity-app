import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import './App.css';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";
import "./firebase";
import Loading from "./components/Loading";

const Dashboard = () => {
  const auth = getAuth();
  const [user, setUser] = useState(auth.currentUser); 
  const db = getDatabase();
  var headingContent = "hello user";
  const [mins, setMins] = useState(readStats()[0])
  const [sessions, setSessions] = useState(readStats()[1]); 
  const [loading, setLoadingState] = useState(true);

  useEffect(() => { 
    const timer = setTimeout(()=>{
        setUser(auth.currentUser); 
        setMins(readStats()[0])
        setSessions(readStats()[1])
        setLoadingState(false); 
    }, 1000)
    return() => {clearTimeout(timer)}
}, [user]);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      headingContent = user.displayName + "'s dashboard";
    } 
  })

  
  
  function readStats() {
    var m = '0'; 
    var s = '0'; 
      if (user) {
          var node1 = ref(db, "users/" + user.uid + "/stats/minutes"); 
          onValue(node1, (snapshot) => {
              m = snapshot.val()+''; 
          })
          var node2 = ref(db, "users/" + user.uid + "/stats/sessions"); 
          onValue(node2, (snapshot) => {
              s = snapshot.val()+''; 
          })
         
          return [m.substring(0,3), s];
      }
      return ['0', '0'];
  }
 
  
  if (loading) {
    return(
      <Loading/>
    )
  }
  return (
    <>
    <div className='flex-container'>
    <div className="page-container">
      <h1 id="dash-heading" style={{marginBottom: '30px'}}>{user ? user.displayName+"'s dashboard" : "hello user"}</h1>
      <p id="unlogged" style={{display: user ? 'none' : 'block'}}><NavLink to="/auth" style={{textDecoration: "underline"}}>log in </NavLink>to view your stats</p>
      <div className="dash">
        <h4>total minutes: <br/>{mins}</h4>
      </div>
      <div className="dash">
        <h4>number of sessions: <br/>{sessions}</h4>
      </div>
      <div className="dash">
        <h4>average minutes per session: </h4>
      </div>
      
    </div>
    </div>
    </>
  )
  
}
 
export default Dashboard;