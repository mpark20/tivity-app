import { 
  getAuth, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup, 
  updateProfile, 
  signOut 
} from "firebase/auth";
import { useState } from 'react';
import { getDatabase, ref, set } from "firebase/database";
import "./firebase";



const SignIn = (props) => {  
  const auth = getAuth();
  const db = getDatabase();
  const provider = new GoogleAuthProvider();
  const [user, setUser] = useState(props.user);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      window.location.href = '#/todo'; 
    }
  })

  function showSU() {
    var su = document.getElementById("signup");
    var li = document.getElementById("login");
    su.style.display = "block";
    li.style.display = "none";
  }
  function showLI() {
    var su = document.getElementById("signup");
    var li = document.getElementById("login");
    su.style.display = "none";
    li.style.display = "block";
  }
  function signUp() {   //runs when signup button is clicked
    var email = document.getElementById("new-email").value;
    var password = document.getElementById("new-password").value;
    var uname = document.getElementById("username").value;
    var message = document.getElementById("register-message");
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      set(ref(db, 'users/' + user.uid), {
        displayName: uname,
        email: email,
        savedLists: "",
        settings: {lightMode: "true", darkMode: "false", breakLength: "5"}
      });
      updateProfile(auth.currentUser, {
        displayName: uname, email: email
      }, welMess(message, user));
      
    })
    .catch((error) => {
      errMess(message, error);
    });
  }
  function logIn() {    //runs when login button is clicked
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var message = document.getElementById("login-message");
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      welMess(message, user);
      setUser(auth.currentUser);
      window.location.href = '#/todo';
    })
    .catch((error) => {
      errMess(message, error)
    });
  }
  function signUpGoogle() {   //runs when 'continue with google' is clicked
    signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      //const credential = GoogleAuthProvider.credentialFromResult(result);
      //const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      setUser(auth.currentUser);
      document.getElementById("login-message").innerHTML = "hello "+user.displayName+"!";
      var userNode = ref(db, 'users/' + user.uid); 
      if (!userNode) {
        set(userNode, {
          displayName: user.displayName,
          email: user.email,
          savedLists: "",
          settings: {lightMode: true, darkMode: false, breakLength: "5"}
        });
      }
      
      window.location.href = '#/todo';
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.log(errorCode + "\n" + errorMessage + "\n" + credential); 
    });
  }
  function logOut() {   //runs when logout button is clicked
    signOut(auth).then(() => {
      setUser(null);
      //logOut.style.display = "none";
      //logIn.style.display = "block";
      document.querySelector("body").classList.remove("dark");
    }).catch((error) => {
      console.log(error); 
    });  
  }
  function welMess(message, user) { 
    message.style.color = "black";
    if (user.displayName) {message.innerHTML = "hello "+user.displayName+"!"}
    else {message.innerHTML = "hello "+document.getElementById("username").value+"!"}
    document.getElementById("password").value = ""; 
  }
  function errMess(message, error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    message.innerHTML = (errorMessage + "/n Code: " + errorCode);
    message.style.color = "red";
    document.getElementById("password").value = ""; 
  }
 
  return (
    <div className="flex-container" > 
    <div className="signin" id="signup">
      <h3>sign up</h3>
      <div>
        <input type="text" className="text-field" id="new-email" placeholder="e-mail address"/>
        <input type="text" className="text-field" id="username" placeholder="username"/>
        <input type="password" className="text-field" id="new-password" placeholder="password (6+ characters)"/>
        <button className="btn" onClick={signUp} style={{margin: "10px 5px 20px 0"}}>sign up</button> 
        <button className="btn" onClick={signUpGoogle} style={{backgroundColor: "#ffa1a1", margin: "10px 5px 20px 0"}}>continue with Google</button>
      </div>
      <div onClick={showLI} className="message"><button>log into an existing account</button></div>
      <div className="message" id="register-message"></div>
    </div>
    <div className="signin" id="login">
      <h3>log in to tivity</h3>
      <div>
        <input type="text" className="text-field" id="email" placeholder="e-mail address" />
        <input type="password" className="text-field" id="password" placeholder="password" />
        <button className="btn" onClick={logIn} id="login-btn" style={{margin: "10px 5px 20px 0"}}>log in</button>
        
        <button className="btn" onClick={signUpGoogle} style={{backgroundColor: "#ffa1a1", margin: "10px 5px 20px 0"}}>continue with Google</button>
      </div>
      <div onClick={showSU} className="message"><button>create a new account</button></div>
      <div className="message" id="login-message"></div>
    </div>
    </div>
  );
}
export default SignIn;