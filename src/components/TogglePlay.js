import { PhoneMultiFactorGenerator } from "firebase/auth";
import { useSpotifyPlayer, usePlaybackState } from "react-spotify-web-playback-sdk";

const TogglePlay = () => {
    const player = useSpotifyPlayer();
    const playbackState = usePlaybackState(); 
    
    function toggle() {
        console.log(player.togglePlay()); 
        if (playbackState.paused) {
            document.getElementById('play').innerHTML = 'pause'
            
        }
        else {
            document.getElementById('play').innerHTML = 'play'
            console.log('paused')
        }
        
    }
    
    if (player === null) {
        return null;
    }
    return (
      <div className='btn-container'>
        <button onClick={toggle} className='btn white' id="play">play</button>
        <button onClick={toggle} style={{display:'none'}} className='btn white' id="pause">pause</button>
      </div>
    );
  };
  export default TogglePlay; 