import { getAuth, onAuthStateChanged } from "firebase/auth";
import './App.css';
import Account from "./components/Account";
import Display from "./components/Display";
import { useEffect } from "react";

const Settings = (props) => {
  const auth = getAuth();
  //const user = props.user; 
  /*useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) { 
        document.getElementById("not-logged-in").style.display = "none";
      } else { 
        document.getElementById("not-logged-in").style.display = "block"; 
      }
    });
  }, []);*/

  return (
    <div className="flex-container" > 
    <div className="page-container">  
      <h1>settings</h1>
      <p className='subtitle'>click the "save settings" button to save your changes</p>
      
      <Account/>
      <br/>
      <Display light={props.light} breakLength={props.breakLength} origin={'returning'}/>
    </div>
    </div>
  )
  
  
}
 
export default Settings;