import { getAuth } from "firebase/auth";
import { getDatabase, ref, set, onValue } from "firebase/database";

const Display = (props) => {
    const db = getDatabase();  
    const body = document.querySelector("body");
    var light = true; 
    var dark = false;
    var breakLength = 5; 
    
    //set light, dark, and breakLength to user's saved settings in database. 
    if (props.user) { 
        var node = ref(db, "users/" + props.user.uid + "/settings");
        onValue(node, (snapshot) => {
            snapshotToArray(snapshot);  
        })
        
    }
    if (light===true) {
        body.classList.remove("dark");
        //document.getElementById("lightMode").checked = true; 
        console.log("light") 
    }
    else {
        body.classList.add("dark");
        //document.getElementById("darkMode").checked = true;
        console.log("dark"); 
    }
    
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
        if (props.user) {
            breakLength = document.getElementById("breakLength").value; 
            var settings = {lightMode: light, darkMode: dark, breakLength: breakLength}
            var node = ref(db, 'users/' + props.user.uid + '/settings');
            set(node, settings);
            console.log(settings.breakLength+" "+settings.darkMode+" "+settings.lightMode); 
        }
        else {
            console.log("please log in to save settings."); 
        }
    }
    return(
        <div id="display" className="indented">
            <h2>display</h2>
            <p style={{marginBottom: "5px"}}>color theme:</p>
            <form style={{marginBottom: "20px"}}>
                <div className="checklist">
                <input type="checkbox" placeholder="light" onChange={lightMode} className="checklist" id="lightMode"/>
                <label htmlFor="light" style={{fontSize: "14px"}}>light</label>
                </div>
                <div className="checklist">
                <input type="checkbox" placeholder="dark" onChange={darkMode} id="darkMode"className="checklist"/>
                <label htmlFor="dark" style={{fontSize: "14px"}}>dark</label>
                </div>
            </form>
            <p style={{marginBottom: "5px"}}>break length (minutes):</p>
            <input type="number" className="text-field"id="breakLength" defaultValue={breakLength}/>
            <button className="btn" id="saveSettings" onClick={saveSettings} style={{float:"none"}}>save settings</button>
        </div> 
    );
}
export default Display