
import { WebPlaybackSDK } from 'react-spotify-web-playback-sdk';
import { useCallback } from 'react';
import SongTitle from './SongTitle';
import TogglePlay from './TogglePlay';
import { useEffect, useState } from 'react';

const WebPlayer = (props) => {

    //const AUTH_TOKEN = "BQBNUOFAPoAWQdrteCq_It371OGhcXJ_jwH9oTDCbSQVrHjRmXVw_qHj0-5cBeNb2hMUpWvqWVBbQ7Kar8cqeS76g6fnBfrCcLK4Xb-Ll1Y6DDVinErJQAhAqM3BIpNzJeemVci8FHkg_w"; ; 
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
