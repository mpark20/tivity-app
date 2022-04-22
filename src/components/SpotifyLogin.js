import { useState, useEffect } from 'react';
import WebPlayer from './WebPlayer';

const SpotifyLogin = () => {
    /*const [token, setToken] = useState('');

    useEffect(() => {

        async function getToken() {
          const response = await fetch('/auth/token');
          const json = await response.json();
          setToken(json.access_token);
        }
    
        getToken();
    
    }, []);

    return (
        <>
            { (token === '') ? <button className='btn'><a href='/auth/login'>Login with Spotify</a></button> : <WebPlayer token={token} /> }
        </>
    );*/

    require('dotenv').config({ path: '../../.env'}); 

    const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID; 
    const REDIRECT_URI = "http://localhost:3000/callback"
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
    const RESPONSE_TYPE = "token";

    const url = AUTH_ENDPOINT+'?client_id='+CLIENT_ID+'&response_type='+RESPONSE_TYPE+'&redirect_uri='+REDIRECT_URI;

    const [token, setToken] = useState("")

    useEffect(() => {
        const hash = window.location.hash
        let token = window.localStorage.getItem("token")
        

        if (!token && hash) {
            token = hash.substring(hash.indexOf('=')+1, hash.indexOf('&')); 

            window.location.hash = ""
            window.localStorage.setItem("token", token) 
        }
        setToken(token)
        console.log(token);
    }, [])
    const startSession = () => {
        setTimeout(()=>{logout()}, 3600000);
    }
    const logout = () => {
        setToken("")
        window.localStorage.removeItem("token")
    }

    return(
        <div className='btn-container'>
            {!token ?
            <button className='btn' onClick={startSession}><a href={url}>connect to Spotify</a></button>
            : <><WebPlayer token={token}/>
              <button className='btn' onClick={logout}>disconnect</button></>}
        </div>
        
    )
}
export default SpotifyLogin;