
import { WebPlaybackSDK } from 'react-spotify-web-playback-sdk';
import { useCallback } from 'react';
import SongTitle from './SongTitle';
import TogglePlay from './TogglePlay';
import { useEffect, useState } from 'react';

const WebPlayer = (props) => {

    //const AUTH_TOKEN = "BQCXiI-nyHvhiL7Mb7j2KuCHHmZzxkUkKHoOkPjlfH7xH5XZs2b40O89gAS0LGRsJWB6MjNwkc7twtGpyDPflZTmYYnNsstiOIxEUB11_pY3pd8dx4cfpaJ-4w9qxIhSQj6ujsMBYrbtljeTSHcxTpTh16paQVg7Aw"; 
    const AUTH_TOKEN = props.token; 
    const getOAuthToken = useCallback(callback => callback(AUTH_TOKEN), []) 

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
