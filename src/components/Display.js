
import { getDatabase, ref, set, onValue } from "firebase/database";
import { useEffect } from 'react'; 

const Display = (props) => {
    const db = getDatabase();  
    const body = document.querySelector("body");
    
    var light = true; 
    var dark = false;
    var breakLength = 5; 
    
    useEffect(() => {
        // Runs once, after mounting
        fillValues(); 
    });
    
    //set light, dark, and breakLength to user's saved settings in database. 
    if (props.user) { 
        console.log("test");
        var node = ref(db, "users/" + props.user.uid + "/settings");
        onValue(node, (snapshot) => {
            snapshotToArray(snapshot);  
        })
        
    }
    else {
        setTheme(light); 
    }
    
    function setTheme(light) {
        if (light===true) {
            body.classList.remove("dark"); 
            console.log("light") 
        }
        else {
            body.classList.add("dark");
            console.log("dark"); 
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
    function snapshotToArray(snapshot) {
        var settings = [];
        snapshot.forEach(function(childSnapshot) {
            var option = childSnapshot.val();
            settings.push(option);
        });
        let bl = settings[0];
        let d = settings[1]; 
        let l = settings[2];  
        console.log(settings); 
        breakLength = bl;
        dark = d; 
        light = l;   
        setTheme(l);
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