import React from 'react';
import { onAuthStateChanged, getAuth } from '@firebase/auth';

const Account = ( props ) => {
    var dn=""; 
    var email = "";
    var uid = ""
    var auth = getAuth(); 
    const user = auth.currentUser; 

    onAuthStateChanged(auth, (user) => {
        if (user) { 
            console.log("user!");
        } else { 
            console.log("no user"); 
        }
    }, setFields());

    function setFields() { 
        if (user) {
            dn = user.displayName; 
            email = user.email; 
            uid = user.uid;
        }  
        return [dn, email, uid];  
    }
    /*if (props.user) {
        console.log("user!");
        dn=props.user.displayName; 
        email=props.user.email; 
        uid=props.user.uid; 
    }
    else {
        console.log("no user");
    }*/
    return(
    <div id="acct" className="indented">
        <h2>account</h2>
        <p>display name: {dn}</p>
        <p>email: {email}</p>
        <p>user ID: {uid}</p>
        <button className="btn white" id="deleteUser" onClick={props.deleteAcct} style={{float:"none"}}>delete account</button>
    </div> 
    )  
}
export default Account; 