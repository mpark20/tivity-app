import React from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth"

const Account = ( props ) => {
    if (props.user) {
        console.log("user!");
          return(
            <div id="acct" className="indented">
                <h2>account</h2>
                <p>display name: {props.user.displayName}</p>
                <p>email: {props.user.email}</p>
                <p>user ID: {props.user.uid}</p>
                <button className="btn white" id="deleteUser" onClick={props.deleteAcct} style={{float:"none"}}>delete account</button>
            </div> 
            )  
    }
    else {
        console.log("no user");
          return(
            <div id="acct" className="indented">
                <h2>account</h2>
                <p>display name: </p>
                <p>email: </p>
                <p>user ID: </p>
            </div>
        )
    }
    function isUser(dn, email, uid) {
        
    }
    function noUser() {
        
    }
    
    
}
export default Account; 