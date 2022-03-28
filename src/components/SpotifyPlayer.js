const SpotifyPlayer = () => {
    const CLIENT_ID = "8f37f0b72dfb4dd98d2007a2192c3037"
    const REDIRECT_URI = "http://localhost:3000/callback"
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
    const RESPONSE_TYPE = "token";

    const url = AUTH_ENDPOINT+'?client_id='+CLIENT_ID+'&response_type='+RESPONSE_TYPE+'&redirect_uri='+REDIRECT_URI;

    return(
        <>
        <button className='btn'><a href={url}>Login to Spotify</a></button>
        </>
    )
}
export default SpotifyPlayer;