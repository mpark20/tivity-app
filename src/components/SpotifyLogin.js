import { useState, useEffect } from 'react';
import WebPlayer from './WebPlayer';

const SpotifyLogin = () => {
    
    require('dotenv').config({ path: '../../.env'}); 

    const CLIENT_SECRET = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;
    const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID; 
    const REDIRECT_URI = "http://localhost:3000/callback"
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
    const RESPONSE_TYPE = "token";
    const SCOPES = 'user-read-private user-read-email';

    

    //const url = AUTH_ENDPOINT+'?client_id='+CLIENT_ID+'&scope='+SCOPES+'&response_type='+RESPONSE_TYPE+'&redirect_uri='+REDIRECT_URI;
    const url = AUTH_ENDPOINT+'?response_type='+RESPONSE_TYPE+'&client_id='+CLIENT_ID+'&scope='+SCOPES+'&redirect_uri='+REDIRECT_URI;


    const [token, setToken] = useState("")

    useEffect(() => {
        const hash = window.location.hash
        let token = window.localStorage.getItem("token")
        console.log(hash);
        
        if (!token && hash) {
            token = hash.substring(hash.indexOf('=')+1, hash.indexOf('&')); 
            console.log(token);
            window.location.hash = ""
            window.localStorage.setItem("token", token) 
        }
        console.log(token);
        setToken(token)
        
    }, [])
  
    const logout = () => {
        setToken("")
        window.localStorage.removeItem("token")
    }

    return(
        <div className='btn-container'>
            {!token ?
            <button className='btn' ><a href={url}>connect to Spotify</a></button>
            : <><WebPlayer token={token}/>
              <button className='btn' onClick={logout}>disconnect</button></>}
        </div>
        
    )
}
export default SpotifyLogin;