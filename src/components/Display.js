import { getDatabase, ref, set, onValue } from "firebase/database";
import { getAuth, updateProfile, updateEmail } from "@firebase/auth";
import { useEffect, useState} from "react";
import Loading from "./Loading"

const Display = (props) => {
    const db = getDatabase();  
    const auth = getAuth(); 
    const body = document.querySelector("body");
    const [loading, setLoadingState] = useState(true);
    const [theme, setTheme] = useState(props.theme); 
    const [breakLength, setBreakLength] = useState(props.breakLength); 
    const [user, setUser] = useState(auth.currentUser);
   
    var blue = false; 
    var red = false; 
    var dark = false; 

    if (theme == 'blue') {
        blue = true;
        red = false; 
        dark = false; 
    }
    if (theme == 'red') {
        red = true;
        blue = false; 
        dark = false; 
    }
    if (theme == 'dark') {
        dark = true;
        blue = false; 
        red = false; 
    }
      
    //fillValues(); 
    
     
    useEffect(() => {
        /*const timer = setTimeout(()=> {
                        setLoadingState(false);
                        readSettings(); 
                        fillValues();
                        setUser(auth.currentUser)
                    }, 1000); 
        return() => {
            clearTimeout(timer)
        }*/
        setUser(auth.currentUser); 
        readSettings()
        .then(() => {
            console.log(theme+" "+breakLength);
            setLoadingState(false);
            fillValues();
        })
    }, [breakLength, theme]); 


    function readSettings() {
        return new Promise((resolve, reject) => {
            var settings = [];
            if (user) { 
                var node = ref(db, "users/" + user.uid + "/settings");
                onValue(node, (snapshot) => {
                    snapshot.forEach(function(childSnapshot) {
                        var option = childSnapshot.val();
                        settings.push(option);
                    });
                })
                setBreakLength(parseInt(settings[0]));
                setTheme(settings[1]); 
            }
            else {
                let loc = localStorage.getItem('theme'); 
                let loc2 = localStorage.getItem('breakLength');
                if (loc == null) {
                    localStorage.setItem('theme', theme);
                }
                if (loc2 == null) {
                    localStorage.setItem('breakLength', breakLength);
                }
                setTheme(loc);
                setBreakLength(loc2);
            }
            resolve(); 
        })
        
        
    }

    function blueMode() {
        //setTheme('blue');
        blue = true;  
        red = false; 
        dark = false; 
        body.classList.remove('dark');
        body.classList.remove('red')
        document.getElementById('redMode').checked = false;
        document.getElementById('darkMode').checked = false; 
    }
    function redMode() {
        //setTheme('red');
        blue = false;  
        red = true; 
        dark = false; 
        body.classList.remove("dark");
        body.classList.add("red");
        console.log('red!!!')
        document.getElementById('blueMode').checked = false;
        document.getElementById('darkMode').checked = false; 
    }
    function darkMode() {
        //setTheme('dark');
        blue = false;  
        red = false; 
        dark = true; 
        body.classList.remove("red");
        body.classList.add("dark");
        document.getElementById('redMode').checked = false;
        document.getElementById('blueMode').checked = false; 
    }
    
    
    function saveSettings() {
        var bl = document.getElementById("breakLength").value;
        var th = '';
        let blueBox = document.getElementById("blueMode");
        let redBox = document.getElementById('redMode');
        let darkBox = document.getElementById("darkMode");

        if (blueBox.checked == true) {
            th = 'blue'
        }
        else if (redBox.checked == true) {
            th = 'red'
        }
        if (darkBox.checked == true) {
            th = 'dark'
        }
        if (user) {
            var dname = document.getElementById("edit-displayName").value;
            var email = document.getElementById("edit-email").value;
            var settings = {breakLength: bl, theme: th}
            var node = ref(db, 'users/' + user.uid + '/settings');
            set(node, settings)

            updateProfile(auth.currentUser, {
                displayName: dname
            })
            updateEmail(auth.currentUser, email)  
            .then(() => {
                document.getElementById("save-message").innerHTML = "saved";
                console.log(user.displayName + ' ' + user.email)
                window.location.reload(); 
            })  
            
            //console.log(settings.breakLength+" "+settings.theme);
            //setBreakLength(bl);
        }
        else {
            localStorage.setItem('theme', th);
            localStorage.setItem('breakLength', bl);
        }
    
    }
    function fillValues() { 
        /*if (breakLength) {
            document.getElementById("breakLength").value = breakLength;
        }*/
        let blueBox = document.getElementById("blueMode");
        let redBox = document.getElementById('redMode');
        let darkBox = document.getElementById("darkMode");
        if (blue === true) {
            console.log('test')
            blueBox.checked = true;
            redBox.checked = false;  
            darkBox.checked = false; 
            body.classList.remove("dark");
            body.classList.remove('red');
        }  
        if (red === true) {
            blueBox.checked = false;
            redBox.checked = true;  
            darkBox.checked = false; 
            body.classList.remove("dark");
            body.classList.add('red');
            
            
            
        } 
        if (dark === true) {
            blueBox.checked = false;
            redBox.checked = false;  
            darkBox.checked = true; 
            body.classList.remove('red');
            body.classList.add("dark");
        }  
         
        
    }
    if (loading) {
        return(
            <Loading/>
        )
    }
    return(
        <div id="display" className="indented">
            
            <h4 style={{marginBottom: "5px"}}>color theme:</h4>
            <form style={{marginBottom: "20px"}}>
                <div className="checklist">
                <input type="checkbox" placeholder="blue" onChange={blueMode} className="checklist" id="blueMode" />
                <label htmlFor="light" style={{fontSize: "14px"}}>cool</label>
                </div>
                <div className="checklist">
                <input type="checkbox" placeholder="red" onChange={redMode} id="redMode"className="checklist" />
                <label htmlFor="red" style={{fontSize: "14px"}}>warm</label>
                </div>
                <div className="checklist">
                <input type="checkbox" placeholder="dark" onChange={darkMode} id="darkMode"className="checklist" />
                <label htmlFor="dark" style={{fontSize: "14px"}}>dark</label>
                </div>
            </form>
            <h4 style={{marginBottom: "5px"}}>break length:</h4>
            <div style={{fontStyle:'italic', fontSize: '12px'}}>(minutes)</div>
            <input type="number" className="text-field"id="breakLength" defaultValue={breakLength ? breakLength : 5} style={{width: '10%'}}/>
            
            <button className="btn" id="saveSettings" onClick={saveSettings} style={{float:"none"}}>save settings</button>
            <div id="save-message" className="message"></div>
        </div> 
    );
    
}
export default Display