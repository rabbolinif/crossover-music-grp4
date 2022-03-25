import  {useState, useEffect} from "react";
import axios from "axios";



export default function SearchArtist() {
    const CLIENT_ID = "7a40ecf446d440f9adc096e425773457"
    const REDIRECT_URI = "http://localhost:3000"
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
    const RESPONSE_TYPE = "token"

    const [token, setToken] = useState("")

    useEffect(() => {
        const hash = window.location.hash
        let token = window.localStorage.getItem("token")

        if (!token && hash) {
            token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

            window.location.hash = ""
            window.localStorage.setItem("token", token)
        }

        setToken(token)

    }, [])

    const logout = () => {
        setToken("")
        window.localStorage.removeItem("token")
    }
    const [searchKey, setSearchKey] = useState("")
    const [artists, setArtists] = useState([])

    const searchArtists = async (e) => {
        e.preventDefault()
        const {data} = await axios.get("https://api.spotify.com/v1/search", {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                q: searchKey,
                type: "artist,album,track"
            }
        })
    
        setArtists(data.artists.items)
        console.log(artists)
    }

    return(
        <>
        <div className="Spotify-Login">
        {!token ?    
        <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Login to Spotify</a>
        : <button onClick={logout}>Logout</button>}
        </div>
        <div className="music-wrapper">
        <div className="Artist-Search">
        <h1>Search </h1>
        <form onSubmit={searchArtists}>
        <input type="text" onChange={e => setSearchKey(e.target.value)}/>
        <button type={"submit"}>Search</button>
        </form>
        <div className="Search-Result">
            {artists.map(artist => (
                <div key={artist.id}>
                        <a href={artist.external_urls.spotify} target="_blank" rel="noreferrer"> {artist.images.length ? <img width={"60px"} src={artist.images[0].url} alt=""/> : <div>No Image</div>} </a>
                        {artist.name}
                </div>
            ))}
        </div>
       
        </div>
        <div className="player">
        <h1>Album of the week</h1>
        <iframe src="https://open.spotify.com/embed/album/1DFixLWuPkv3KT3TnV35m3" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media" title="player"></iframe>
        </div> 
        </div>
    </>
    )
}