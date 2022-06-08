
import { WebPlaybackSDK } from 'react-spotify-web-playback-sdk';
import { useCallback } from 'react';
import SongTitle from './SongTitle';
import TogglePlay from './TogglePlay';
import { useEffect, useState } from 'react';
import spotifyLogo from './spotify-brands.svg'

const WebPlayer = (props) => {
    //const AUTH_TOKEN = "BQCsUFUjCeUsXLraPOTQzFtHpvH0oz3QDCFiErtIpn2_Q6cASVEwlDQIF7x79LI-shWdgL4q_DNam-16UBvn_ercNO3dQC7TMo1KpH4hS1-3-IMqZ1htsiwNFBkSG2f_4DTSs9yYD6Bk-w"; 
    const AUTH_TOKEN = props.token; 
    const getOAuthToken = useCallback(callback => callback(AUTH_TOKEN), []) 
    console.log(AUTH_TOKEN)
    return(
        <div className='web-player'>
        <WebPlaybackSDK
            deviceName="tivity-app"
            getOAuthToken={getOAuthToken}
            volume={0.5}>
            <SongTitle />
            <TogglePlay/>
        </WebPlaybackSDK>
        <div style={{display: 'flex'}}>
        <a href='https://www.spotify.com/us/'><img src={spotifyLogo} width='16px'/></a>
        <p style={{color: 'gray', fontSize: '12px', alignItems: 'flex-end'}}>&nbsp;Spotify Player </p>
        </div>
        </div>
    )
}
export default WebPlayer; 
