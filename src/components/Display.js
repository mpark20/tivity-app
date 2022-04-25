
import { getDatabase, ref, set, onValue } from "firebase/database";
import { getAuth, onAuthStateChanged } from "@firebase/auth";
import { useEffect, useState} from "react";
import Loading from "./Loading"

const Display = (props) => {
    const db = getDatabase();  
    const auth = getAuth(); 
    const body = document.querySelector("body");
    const btns = document.querySelectorAll('.btn'); 
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
    console.log(theme+" "+breakLength);
     
    useEffect(() => {
        const timer = setTimeout(()=> {
                        setLoadingState(false);
                        readSettings(); 
                        fillValues();
                        setUser(auth.currentUser)
                    }, 1000); 
        return() => {
            clearTimeout(timer)
        }
    }, [breakLength, theme]); 

    /*onAuthStateChanged(auth, (user) => {
        if (user) { 
            var node = ref(db, "users/" + user.uid + "/settings");
            onValue(node, (snapshot) => {
                snapshotToArray(snapshot);  
            })
        } else { 
            body.classList.remove("dark"); 
            console.log("light")
            
        }
    });*/

    function readSettings() {
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
            //dark = settings[1]; 
            //light = settings[2]; 
        }
        else {
            setBreakLength(5);
            //dark = false;
            //light = true; 
            setTheme('blue')
            
        }
        
    }

    /*function snapshotToArray(snapshot) {
        var settings = [];
        snapshot.forEach(function(childSnapshot) {
            var option = childSnapshot.val();
            settings.push(option);
        });
        setBreakLength(settings[0]);
        dark = settings[1]; 
        light = settings[2];  
        console.log(settings); 
        
        if (light===true) {
            body.classList.remove("dark"); 
            //console.log("light") 
        }
        else {
            body.classList.add("dark");
            //console.log("dark"); 
        } 
    }*/
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
    
    /*function darkMode() {
        dark = !dark
        if (dark === true) {
           
            light = false; 
            body.classList.add("dark");
            document.getElementById("lightMode").checked = false;
            document.getElementById("darkMode").checked = true; 
        } 
        else {
            lightMode(); 
        }
    }
    function lightMode() {
        light = !light;         
        if (light === true) {
            dark = false; 
            body.classList.remove("dark");
            document.getElementById("darkMode").checked = false;
            
            document.getElementById("lightMode").checked = true;
        } 
        else {
            darkMode(); 
        }
    }*/
    
    /*function saveSettings() {
            if (user) {
                var bl = document.getElementById("breakLength").value;
                console.log(bl) 
                var settings = {breakLength: bl, darkMode: dark, lightMode: light}
                var node = ref(db, 'users/' + user.uid + '/settings');
                set(node, settings)
                document.getElementById("save-message").innerHTML = "saved";
                console.log(settings.breakLength+" "+settings.darkMode+" "+settings.lightMode);
                setBreakLength(bl);
            }
            else {
                document.getElementById("save-message").innerHTML = "please log in to save settings."; 
            }
    }*/
    function saveSettings() {
        
        if (user) {
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
            var settings = {breakLength: bl, theme: th}
            var node = ref(db, 'users/' + user.uid + '/settings');
            set(node, settings)
            document.getElementById("save-message").innerHTML = "saved";
            console.log(settings.breakLength+" "+settings.theme);
            setBreakLength(bl);
        }
        else {
            document.getElementById("save-message").innerHTML = "please log in to save settings."; 
        }
    
    }
    function fillValues() { 
        if (breakLength) {
            document.getElementById("breakLength").value = breakLength;
        }
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

    return(
        <div id="display" className="indented">
            <h2>display</h2>
            <p style={{marginBottom: "5px"}}>color theme:</p>
            <form style={{marginBottom: "20px"}}>
                <div className="checklist">
                <input type="checkbox" placeholder="blue" onChange={blueMode} className="checklist" id="blueMode" />
                <label htmlFor="light" style={{fontSize: "14px"}}>blue</label>
                </div>
                <div className="checklist">
                <input type="checkbox" placeholder="red" onChange={redMode} id="redMode"className="checklist" />
                <label htmlFor="red" style={{fontSize: "14px"}}>red</label>
                </div>
                <div className="checklist">
                <input type="checkbox" placeholder="dark" onChange={darkMode} id="darkMode"className="checklist" />
                <label htmlFor="dark" style={{fontSize: "14px"}}>dark</label>
                </div>
            </form>
            <p style={{marginBottom: "5px"}}>break length (minutes):</p>
            <input type="number" className="text-field"id="breakLength" defaultValue={breakLength}/>
            <button className="btn" id="saveSettings" onClick={saveSettings} style={{float:"none"}}>save settings</button>
            <div id="save-message" className="message"></div>
        </div> 
    );
    
}
export default Display