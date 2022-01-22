import { useEffect, useState } from 'react';
import { getAuth, deleteUser, reauthenticateWithCredential, reauthenticateWithPopup, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, EmailAuthProvider } from "firebase/auth";
import { getDatabase, ref, remove } from "firebase/database";
import Loading from './Loading';

const Account = ( props ) => {
    const auth = getAuth(); 
    const user = auth.currentUser; 
    const db = getDatabase(); 
    var tempUserInfo = []; 

    const [userInfo, setUserInfo] = useState({dn:"", email:"", uid:""});
    const [loading, setLoadingState] = useState(true);
    //add user as a state variable?
    useEffect(()=> {
        setTimeout(() => {
            setFields(); 
            setLoadingState(false);
        }, 1000)
    }, []);

    onAuthStateChanged(auth, (user) => {
        if (user) { 
            console.log("user!"); 
            tempUserInfo = {dn:user.displayName, email:user.email, uid:user.uid};
            
        } else { 
            console.log("no user"); 
        }
    });
    
    function setFields() {   
        setUserInfo(tempUserInfo);
       
    }
    function toggleShowReauth() {
        const ra = document.getElementById("reauthenticate")
        if (user) {
            if (ra.style.display === "none") {
                ra.style.display = "block";
            }
            else {
                ra.style.display = "none";
            }
        }
    }
    function reauth() {
        var password = document.getElementById('password').value; 
        const credential = EmailAuthProvider.credential(user.email, password);
        reauthenticateWithCredential(user, credential)
        .then(()=>{
            deleteAcct(); 
        }).catch((error)=>{
            console.log(error)
        })
    }
    function reauthPopUp() {
        const provider = new GoogleAuthProvider();
        reauthenticateWithPopup(user, provider); 
        deleteAcct(); 
    }
    function deleteAcct() { 
        var node = ref(db, 'users/' + user.uid);
        remove(node); 

        deleteUser(user)
        .then(() => {
            signOut(auth).then(() => {
                console.log("account deleted")
                window.location.reload(); 
            }).catch((error) => {
                console.log(error); 
            });
        })
        .catch((error) => {
          console.log(error); 
        });
    }
    if (loading) {
        return(
            <Loading/>
        )
    }
    return(
        <div id="acct" className="indented">
            
            <h2>account</h2>
            <p>display name: {userInfo.dn}</p>
            <p>email: {userInfo.email}</p>
            <p>user ID: {userInfo.uid}</p>
            <div id="reauthenticate">
                <input type="password" className="text-field" id="password" placeholder="please re-enter your password"/>
                <button className="btn" onClick={reauth} style={{margin: "10px 5px 20px 0"}}>delete account</button>
                <button className="btn" onClick={reauthPopUp} style={{backgroundColor: "#ffa1a1", margin: "10px 5px 20px 0"}}>continue with Google</button>
                <button className="btn white" onClick={toggleShowReauth} style={{margin: "10px 5px 20px 0"}}>cancel</button>
            </div>
            <button className="btn white" id="deleteUser" onClick={toggleShowReauth} style={{float:"none"}}>delete account</button>
        </div> 
    )  
}
export default Account; 