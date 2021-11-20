import React from 'react';
const Account = ( props ) => {
    return(
        <div id="acct">
            <h2>account</h2>
            <div className="indented">
                <p>display name: {props.dn}</p>
                <p>email: {props.email}</p>
                <p>user ID: {props.uid}</p>
                <p>photo: </p>
            </div>
        </div> 
    )
}
export default Account; 