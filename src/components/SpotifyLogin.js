import { useState, useEffect } from 'react';
import WebPlayer from './WebPlayer';


const SpotifyLogin = () => {
    
    require('dotenv').config({ path: '../../.env'}); 

    const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID; 
    const REDIRECT_URI = "http://localhost:3000/callback";
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
    const RESPONSE_TYPE = "token";
    const SCOPES = 'user-read-private user-read-email';

    //redirects user to log into their Spotify account to grant permission to access their data
    const url = AUTH_ENDPOINT+'?response_type='+RESPONSE_TYPE+'&client_id='+CLIENT_ID+'&redirect_uri='+REDIRECT_URI;

    const [token, setToken] = useState("")

    //after granting permission, an access token is generated in the hash
    useEffect(() => {
        const hash =  window.location.hash
        console.log(hash)
        let token = window.localStorage.getItem("token")
        
        //token is extracted and passed as a prop to the WebPlayer component
        if (!token && hash) {
            token = hash.substring(hash.indexOf('=')+1, hash.indexOf('&')); 
            console.log(token);
            window.location.hash = ""
            window.localStorage.setItem("token", token) 
        }
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