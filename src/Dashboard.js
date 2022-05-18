import React, { useEffect, useState, useRef } from "react";
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
  const [mins, setMins] = useState(0)
  const [sessions, setSessions] = useState(0); 
  const [loading, setLoadingState] = useState(true);

  useEffect(() => {
    readStats()
    .then((data) => {
      setMins(data[0])
      setSessions(data[1]);
    })
  }, [])

  useEffect(() => { 
    setLoadingState(false);
    
    /*const timer = setTimeout(()=>{
        setUser(auth.currentUser); 
        setMins(readStats()[0])
        setSessions(readStats()[1])
        setLoadingState(false); 
    }, 1000)
    return() => {clearTimeout(timer)}*/
}, [sessions]);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      headingContent = user.displayName + "'s dashboard";
    } 
  })

  function readStats() {
    return new Promise((resolve, reject) => {
      
      if (user) {
        var node1 = ref(db, "users/" + user.uid + "/stats"); 
        var stats = [];
        onValue(node1, (snapshot) => {
            snapshot.forEach(function(childSnapshot) {
              var item = childSnapshot.val(); 
              stats.push(item);
            })
            resolve(stats);
        })
      }
      else {
        setMins(0);
        setSessions(0);
      }
    })
    
    /*var m = '0'
    var s = '0'
    if (user) {
        var node1 = ref(db, "users/" + user.uid + "/stats/minutes"); 
        onValue(node1, (snapshot) => {
            m = (snapshot.val()+'').substring(0,3);
            var item = snapshot.val(); 
        })
        var node2 = ref(db, "users/" + user.uid + "/stats/sessions"); 
        onValue(node2, (snapshot) => {
            s = snapshot.val()+''; 
        })
        console.log(m, s)
        return [m, s];
      }
      return [0, 0];*/
      
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
        <p>total minutes: {mins ? mins.toFixed(1): '--'}</p>
      </div>
      <div className="dash">
        <p>number of sessions: {sessions ? sessions: '--'}</p>
      </div>
      <div className="dash">
        <p>average minutes per session: {mins && sessions && mins!=0 ? (mins/sessions).toFixed(1): '--'}</p>
      </div>
      
    </div>
    </div>
    </>
  )
  
}
 
export default Dashboard;