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
import { getDatabase, ref, set } from "firebase/database";
import "./firebase"
//someone@example.com, 000000 
const SignIn = () => {  
  const auth = getAuth();
  const db = getDatabase();
  const provider = new GoogleAuthProvider();
  onAuthStateChanged(auth, (user) => {
    var login = document.getElementById("login-btn");
    var logout = document.getElementById("logout-btn");
    if (user) {
      login.style.display = "none";
      logout.style.display = "block";
    } else {
      login.style.display = "block";
      logout.style.display = "none";
    }
  });
  
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
  function signUp() {
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
  function logIn() {
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var message = document.getElementById("login-message");
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      welMess(message, user);  
    })
    .catch((error) => {
      errMess(message, error)
    });
  }
  function signUpGoogle() {
    signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      //const credential = GoogleAuthProvider.credentialFromResult(result);
      //const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      document.getElementById("login-message").innerHTML = "hello "+user.displayName+"!";
      var userNode = ref(db, 'users/' + user.uid); 
      if (!userNode) {
        set(ref(userNode), {
          displayName: user.displayName,
          email: user.email,
          savedLists: "",
          settings: {lightMode: true, darkMode: false, breakLength: "5"}
        });
      }
      
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
      console.log(errorCode + "\n" + errorMessage + "\n" + credential); 
    });
  }
  function logOut() {
    signOut(auth).then(() => {
      logOut.style.display = "none";
      logIn.style.display = "block";
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
    <>
    <div className="signin" id="signup">
      <h3>sign up</h3>
      <div>
        <input type="text" className="text-field" id="new-email" placeholder="e-mail address"/>
        <input type="text" className="text-field" id="username" placeholder="username"/>
        <input type="password" className="text-field" id="new-password" placeholder="password"/>
        <button className="btn" onClick={signUp} style={{margin: "10px 5px 20px 0"}}>sign up</button> 
        <button className="btn" onClick={signUpGoogle} style={{backgroundColor: "#ffa1a1", margin: "10px 5px 20px 0"}}>continue with Google</button>
      </div>
      <div onClick={showLI} className="message"><button>log into an existing account</button></div>
      <div className="message" id="register-message"></div>
    </div>
    <div className="signin" id="login">
      <h3>log in</h3>
      <div>
        <input type="text" className="text-field" id="email" placeholder="e-mail address"/>
        <input type="password" className="text-field" id="password" placeholder="password"/>
        <button className="btn" onClick={logIn} id="login-btn" style={{margin: "10px 5px 20px 0"}}>log in</button>
        <button className="btn" onClick={logOut} id="logout-btn" style={{margin: "10px 5px 20px 0"}}>log out</button>
        <button className="btn" onClick={signUpGoogle} style={{backgroundColor: "#ffa1a1", margin: "10px 5px 20px 0"}}>continue with Google</button>
      </div>
      <div onClick={showSU} className="message"><button>create a new account</button></div>
      <div className="message" id="login-message"></div>
    </div>
    </>
  );
}
export default SignIn;