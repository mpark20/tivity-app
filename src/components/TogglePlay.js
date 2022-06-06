//import { PhoneMultiFactorGenerator } from "firebase/auth";
import { useSpotifyPlayer, usePlaybackState } from "react-spotify-web-playback-sdk";

const TogglePlay = () => {
    const player = useSpotifyPlayer();
    const playbackState = usePlaybackState(); 
    
    function pause() {
      player.pause()
      .then(() => {
        console.log('paused')
        console.log(playbackState)
      }).catch((err) => {console.log(err)})
      
    }
    
    if (player === null) {
        return null;
    }
    return (
      <div className='btn-container'>
        <button onClick={pause} className='btn white' id="pause">pause</button>
        <button onClick={() => player.resume()} className='btn white' id="pause">play</button>
      </div>
    );
  };
  export default TogglePlay; 