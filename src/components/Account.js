import React from 'react';
const Account = ( props ) => {
    return(
        <div id="acct" className="indented">
            <h2>account</h2>
            <p>display name: {props.dn}</p>
            <p>email: {props.email}</p>
            <p>user ID: {props.uid}</p>
            <button className="btn white" id="deleteUser" onClick={props.deleteAcct} style={{float:"none"}}>delete account</button>
        </div> 
    )
}
export default Account; 