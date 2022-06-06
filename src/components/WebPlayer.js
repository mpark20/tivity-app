
import { WebPlaybackSDK } from 'react-spotify-web-playback-sdk';
import { useCallback } from 'react';
import SongTitle from './SongTitle';
import TogglePlay from './TogglePlay';
import { useEffect, useState } from 'react';

const WebPlayer = () => {
    const AUTH_TOKEN = "BQClMmS9qrY6-BFC0lEyZm8I-YiLhp-LirfFiGJzQCsuLaB4jEPQDbpaQi2YxXvtuMClWJXnqcsf0OjNVPgYrLWy1s_VeJECMGjQSTDoTwjcraHtwZ0L0_ZTqMP41UVo7B94nvoV225dQA4n2-vmJ07PwkBZkrBJ4A"; 
    //const AUTH_TOKEN = props.token; 
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
        </div>
    )
}
export default WebPlayer; 
