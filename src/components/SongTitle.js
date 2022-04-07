import { usePlaybackState } from "react-spotify-web-playback-sdk";
import { useState, useEffect } from 'react'; 

const SongTitle = () => {
  const playbackState = usePlaybackState(); 
    //playbackState needs to update so it doesn't default to null
  if (playbackState === null) {
      return(
          <p>Not playing</p>
      )
  }
  var title = playbackState.track_window.current_track.name; 
  var artist = playbackState.track_window.current_track.artists[0].name; 

  return (
  <p>Current song: {title}, {artist}</p>
  )
}
export default SongTitle; 