import { getAuth } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";
import SavedLists from "./components/SavedLists"
import './App.css';

const Planner = () => {
  const auth = getAuth(); 
  const user = auth.currentUser; 
  const db = getDatabase(); 
  var savedLists; 

  if (user) {
    var node = ref(db, "users/" + user.uid + "/savedLists"); 
    onValue(node, (snapshot) => {
      console.log(snapshotToArray(snapshot))
    })
  }
  else {
    savedLists = null; 
  }
  function snapshotToArray(snapshot) {
    savedLists = [];

    snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();
        item.key = childSnapshot.key;
        savedLists.push(item);
    });
    return savedLists;
  };
  function showList(index) {
    var item = document.getElementsByClassName("list-contents")[index]
    if (item.style.display === "none") {
      item.style.display = "block";
    }
    else {
      item.style.display = "none"
    }
    
  }
  return (
    <div className="page-container">
      <h2>my saved lists</h2>
      <SavedLists lists={savedLists} user={user} showList={showList}/>
    </div>
  );
}
 
export default Planner;