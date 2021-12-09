
import { getDatabase, ref, set, onValue } from "firebase/database";
import { onAuthStateChanged, getAuth} from "@firebase/auth";
import { useEffect } from "react";

const Display = () => {
    const db = getDatabase();  
    const body = document.querySelector("body");
    const auth = getAuth(); 
    const user = auth.currentUser; 
    
    var light = true; 
    var dark = false;
    var breakLength = 5;

    useEffect(() => {
        setTimeout(()=> {
            fillValues(); 
        }, 1000); 
        //console.log("DOM loaded")
    }, []); 

    onAuthStateChanged(auth, (user) => {
        if (user) { 
            var node = ref(db, "users/" + user.uid + "/settings");
            onValue(node, (snapshot) => {
                snapshotToArray(snapshot);  
            })
        } else { 
            body.classList.remove("dark"); 
            console.log("light")
        }
    });
    
    //set light, dark, and breakLength to user's saved settings in database. 
    /*if (props.user) { 
        var node = ref(db, "users/" + props.user.uid + "/settings");
        onValue(node, (snapshot) => {
            snapshotToArray(snapshot);  
        })
    }
    else {
        //setTheme(light);
        body.classList.remove("dark"); 
        console.log("light")
    }*/
    function snapshotToArray(snapshot) {
        var settings = [];
        snapshot.forEach(function(childSnapshot) {
            var option = childSnapshot.val();
            settings.push(option);
        });
        breakLength = settings[0];
        dark = settings[1]; 
        light = settings[2];  
        console.log(settings); 
        
        if (light===true) {
            body.classList.remove("dark"); 
            console.log("light") 
        }
        else {
            body.classList.add("dark");
            console.log("dark"); 
        } 
    }
    
    function darkMode() {
        dark = !dark; 
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
        light  = !light;         
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
        if (user) {
            breakLength = document.getElementById("breakLength").value; 
            var settings = {lightMode: light, darkMode: dark, breakLength: breakLength}
            var node = ref(db, 'users/' + user.uid + '/settings');
            set(node, settings)
            .then((result) => {
                document.getElementById("save-message").innerHTML = "saved";
                console.log(settings.breakLength+" "+settings.darkMode+" "+settings.lightMode);
            })
            .catch((error) => {
                console.log(error); 
            }) 
        }
        else {
            document.getElementById("save-message").innerHTML = "please log in to save settings."; 
        }
    }
    function fillValues() {
        let lightBox = document.getElementById("lightMode");
        let darkBox = document.getElementById("darkMode");
        if (light===true) {
            lightBox.checked = true; 
            darkBox.checked = false; 
        }
        else {
            darkBox.checked = true;
            lightBox.checked = false; 
        } 
        document.getElementById("breakLength").value = breakLength; 
        console.log(breakLength);
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