
import { WebPlaybackSDK } from 'react-spotify-web-playback-sdk';
import { useCallback } from 'react';
import SongTitle from './SongTitle';
import TogglePlay from './TogglePlay';
import { useEffect, useState } from 'react';
import spotifyLogo from './spotify-brands.svg'

const WebPlayer = (props) => {
    //const AUTH_TOKEN = "BQA9sNbOv1xjXJm2XnHHg8eRdAhAjIFROvx6nWPKoKhWh2eS8ePgiROfUENT7TU20cbcCfCoz1RuOc7krRsAPWYpfp0Z7CUwoHeTBp9tD0cGNNvld_j2HYkZlTlMZgvel0MSrvaqOz_en_2VSzhr-t9GdzTKtDKauK-qM83qSvbnyUHuKHLTYuGws3lFGXr2vTU"; 
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
