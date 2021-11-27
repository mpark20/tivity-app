import React, { Component } from "react";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";
import SavedLists from "./components/SavedLists"
import './App.css';

const Planner = () => {
  const auth = getAuth(); 
  const user = auth.currentUser; 
  const db = getDatabase(); 
  var lists = ["log in to view saved lists"];

  if (user) {
    var node = ref(db, "users/" + user.uid + "/savedLists"); 
    onValue(node, (snapshot) => {
      var savedLists = snapshot.val(); 
      getList(savedLists); 
    })
  }
  function getList(savedLists) {
    lists = savedLists; 
    console.log(lists);
  }
  return (
    <div className="page-container">
      <h2>my saved lists</h2>
      <SavedLists lists={lists}/>
    </div>
  );
}
 
export default Planner;