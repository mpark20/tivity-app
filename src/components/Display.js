
import { getDatabase, ref, set, onValue } from "firebase/database";
import { getAuth, onAuthStateChanged } from "@firebase/auth";
import { useEffect, useState} from "react";
import Loading from "./Loading"

const Display = (props) => {
    const db = getDatabase();  
    const auth = getAuth(); 
    const body = document.querySelector("body");
    const [loading, setLoadingState] = useState(true);
    //const [theme, setTheme] = useState(props.light); 
    const [breakLength, setBreakLength] = useState(props.breakLength); 
    const [user, setUser] = useState(auth.currentUser);

    var light = props.light; 
    var dark = !props.light; 
    console.log(light+" "+dark+" "+breakLength);
     
    useEffect(() => {
        setTimeout(()=> {
            setLoadingState(false);
            readSettings(); 
            fillValues();
            setUser(auth.currentUser)
        }, 1000); 
        
    }, [breakLength]); 

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
            setBreakLength(settings[0]);
            dark = settings[1]; 
            light = settings[2]; 
        }
        else {
            setBreakLength(5);
            dark = false;
            light = true; 
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
    
    function darkMode() {
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
    }
    
    function saveSettings() {
        //onAuthStateChanged(auth, (user) => {
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
        //})
        
    }
    function fillValues() { 
        document.getElementById("breakLength").value = breakLength;  
        let lightBox = document.getElementById("lightMode");
        let darkBox = document.getElementById("darkMode");
        if (light===true) {
            lightBox.checked = true; 
            darkBox.checked = false; 
            body.classList.remove("dark");
        }
        else {
            darkBox.checked = true;
            lightBox.checked = false; 
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
            <h2>display</h2>
            <p style={{marginBottom: "5px"}}>color theme:</p>
            <form style={{marginBottom: "20px"}}>
                <div className="checklist">
                <input type="checkbox" placeholder="light" onChange={lightMode} className="checklist" id="lightMode" defaultChecked={light}/>
                <label htmlFor="light" style={{fontSize: "14px"}}>light</label>
                </div>
                <div className="checklist">
                <input type="checkbox" placeholder="dark" onChange={darkMode} id="darkMode"className="checklist" defaultChecked={dark}/>
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