import { getAuth } from "firebase/auth";
import AccountSettings from "./components/AccountSettings";
import FunctionSettings from "./components/FunctionSettings";

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
    <div className="page-container" id='settings'>  
      <h1>settings</h1>
      <p className='subtitle'>click the "save settings" button to save your changes</p>
      
      <AccountSettings/>
      <br/>
      <FunctionSettings light={props.light} breakLength={props.breakLength} origin={'returning'}/>
    </div>
    </div>
  )
  
  
}
 
export default Settings;