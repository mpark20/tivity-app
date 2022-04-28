import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useState } from "react";
import { Redirect } from "react-router-dom";

const Logout = (props) => {
    const auth = getAuth(); 
    const [user, setUser] = useState(auth.currentUser); 

    onAuthStateChanged(auth, (user) => {
        if (user) {
            setUser(auth.currentUser); 
        }
        else {
            setUser(null); 
        }
    }
    )

    return(
        <>
        <button className="btn" onClick={() => props.logout()} id="logout-btn" style={{display: user ? 'block': 'none'}}>log out</button>
        
        </>
    )
}
export default Logout; 