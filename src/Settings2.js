
import './App.css';
import Account from "./components/Account";
import Display from "./components/Display";
import { useEffect } from "react";

const Settings = (props) => { 

    
  return (
    <div className="flex-container" > 
    <div className="page-container">  
      <h1>settings</h1>
      <p class='subtitle'>click the "save settings" button to save your changes</p>
      <Display light={props.light} breakLength={props.breakLength} origin={'guest'}/>
    </div>
    </div>
  )
  
  
}
 
export default Settings;