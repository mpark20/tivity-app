import { useEffect, useState } from "react"
import { auth, getAuth, onAuthStateChanged } from "firebase/auth"
const AuthListener = (props) => {
    const auth = getAuth(); 
    onAuthStateChanged(auth, (user) => {
        props.update()
    })

    return null
}
export default AuthListener