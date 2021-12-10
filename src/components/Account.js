import { useEffect, useState } from 'react';
import { getAuth, deleteUser, signOut, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, remove } from "firebase/database";

const Account = ( props ) => {
    const auth = getAuth(); 
    const user = auth.currentUser; 
    const db = getDatabase(); 
    var tempUserInfo = []; 

    const [userInfo, setUserInfo] = useState({dn:"", email:"", uid:""});
    
    useEffect(()=> {
        setTimeout(() => {
            setFields(); 
        }, 1000)
    }, []);

    onAuthStateChanged(auth, (user) => {
        if (user) { 
            console.log("user!"); 
            tempUserInfo = {dn:user.displayName, email:user.email, uid:user.uid};
        } else { 
            console.log("no user"); 
            tempUserInfo = {dn:"",email:"", uid:""}
        }
    });
    
    function setFields() {   
        setUserInfo(tempUserInfo)
        console.log("fields set")
    }
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
    console.log(userInfo.dn)
    return(
        <div id="acct" className="indented">
            <h2>account</h2>
            <p>display name: {userInfo.dn}</p>
            <p>email: {userInfo.email}</p>
            <p>user ID: {userInfo.uid}</p>
            <button className="btn white" id="deleteUser" onClick={deleteAcct} style={{float:"none"}}>delete account</button>
        </div> 
    )  
}
export default Account; 