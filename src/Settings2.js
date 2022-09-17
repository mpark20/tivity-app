
import './App.css';
import AccountSettings from "./components/AccountSettings";
import FunctionSettings from "./components/FunctionSettings";
import { useEffect } from "react";

const Settings = (props) => { 

    
  return (
    <div className="flex-container" > 
    <div className="page-container" id='settings'>  
      <h1>settings</h1>
      <p className='subtitle'>click the "save settings" button to save your changes</p>
      <FunctionSettings light={props.light} breakLength={props.breakLength} origin={'guest'}/>
    </div>
    </div>
  )
  
  
}
 
export default Settings;