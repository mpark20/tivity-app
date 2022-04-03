import { useSpotifyPlayer } from "react-spotify-web-playback-sdk";

const TogglePlay = () => {
    const player = useSpotifyPlayer();
   
    if (player === null) {
        return null;
    }
    return (
      <div className='btn-container'>
        <button onClick={() => player.pause} className='btn white'>pause</button>
        <button onClick={() => player.resume} className='btn white'>resume</button>
      </div>
    );
  };
  export default TogglePlay; 