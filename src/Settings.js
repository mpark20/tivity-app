import { getAuth, deleteUser, signOut, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, remove } from "firebase/database";
import './App.css';
import Account from "./components/Account";
import Display from "./components/Display";
import { useEffect } from "react";

const Settings = () => {
  const auth = getAuth(); 
  const user = auth.currentUser;  
  const db = getDatabase();


  useEffect(() => {
     onAuthStateChanged(auth, (user) => {
      if (user) { 
        document.getElementById("not-logged-in").style.display = "none";
      } else { 
        document.getElementById("not-logged-in").style.display = "block"; 
      }
     });
  }, []);

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
      <Account user={user} deleteAcct={deleteAcct}/>
      <Display/>
    </div>
  )
  
  
}
 
export default Settings;