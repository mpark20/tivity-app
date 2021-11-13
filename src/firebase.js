import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getDatabase } from "firebase/database"

const firebaseConfig = {
    apiKey: "AIzaSyD-9fsFi3McrM8hcEFKACm0Z4IcrV6sinQ",
    authDomain: "tiviti-2021.firebaseapp.com",
    projectId: "tiviti-2021",
    storageBucket: "tiviti-2021.appspot.com",
    messagingSenderId: "419864797007",
    appId: "1:419864797007:web:620e5cd0abbb90b1c9ef3a",
    measurementId: "G-FVN7VG77N2"
  };
  
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getDatabase(app);

