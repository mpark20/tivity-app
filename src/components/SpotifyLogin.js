import { useState, useEffect } from 'react';
import WebPlayback from './WebPlayback';

const SpotifyLogin = () => {
    const [token, setToken] = useState('');

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
            { (token === '') ? <button className='btn'><a href='/auth/login'>Login with Spotify</a></button> : <WebPlayback token={token} /> }
        </>
    );

    /*require('dotenv').config({ path: '../../.env'}); 

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
            token = hash.substring(hash.indexOf('='), hash.indexOf('&'));

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
        <div style={{marginLeft: '10%'}}>
        <div className='btn-container'>
            {!token ?
            <button className='btn'><a href={url}>Login to Spotify</a></button>
            : <button className='btn' onClick={logout}>Logout of Spotify</button>}
        </div>
        
        </div>
    )*/
}
export default SpotifyLogin;