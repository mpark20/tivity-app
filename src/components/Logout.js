import { getAuth, signOut } from "firebase/auth";
import { useState } from "react";
import { Redirect } from "react-router-dom";

const Logout = (props) => {
    const auth = getAuth(); 
    const [user, setUser] = useState(auth.currentUser); 
    const [status, setStatus] = useState(null); 


    return(
        <>
        <button className="btn" onClick={() => props.logout} id="logout-btn" style={{display: user ? 'block': 'none'}}>log out</button>
        <div id='redirect' style={{display: !status ? <></>: 'block'}}><Redirect to='/auth'/></div>
        </>
    )
}
export default Logout; 