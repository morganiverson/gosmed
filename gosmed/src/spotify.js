import fetch from "node-fetch"
import credentials from "./credentials.json" assert {type: 'json'};
import { getQueryString } from "./util.js"

const ENDPOINT = "https://api.spotify.com/v1/search";
const SEP = 70

// album, artist, track, year, upc, tag:hipster, tag:new, isrc, and genre
let query = {
    "name": "Gospel Airplay",
    "artist": "", 
    "album": "", 
    "track": "", 
    "year": "", 
    "upc":"", 
    "genre": "",
    "type" : "playlist", 
    "limit": 5, 
}
// MORE END POINTS: 
function fetchFrom(ENDPOINT, QUERY, AUTHENTICATION_TOKEN) {

  let QUERY_STRING, SEARCH_QUERY = ""
  if(QUERY) {
    console.log("Query: \n" + JSON.stringify(QUERY, null, 2))
    console.log("=".repeat(SEP))

    QUERY_STRING = getQueryString(QUERY);
    SEARCH_QUERY = ENDPOINT + "?q=" + QUERY_STRING

    console.log("Formatted Query: \n" + SEARCH_QUERY)
    console.log("=".repeat(SEP))
  }
  else {
    console.log("No Query Details Provided...")
    SEARCH_QUERY = ENDPOINT
    console.log("=".repeat(SEP))
  }
  
  console.log("Initiating Search Request...")

  return fetch(SEARCH_QUERY, {
      method: "GET",
      headers: {
          Authorization: `Bearer ${AUTHENTICATION_TOKEN}`
      }
    })
    .then(res => res.json())
    .then(res => {
      return res
    })
        
}

function getAccessToken(credentials){
    console.log("Retriving Access Token...")

    let auth_body = {
        client_id : credentials.client_id,
        client_secret : credentials.client_secret, 
        grant_type: "client_credentials"
    }


    var auth_options = {
        method: "POST",
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: getQueryString(auth_body)
    };

    return fetch("https://accounts.spotify.com/api/token", auth_options)
    .then(res => res.json())
    .then(res => {
        // console.log(JSON.stringify(res, null, 2))
        return res.access_token
    })
}

/************************************************************************** */
/* MAKE SPOTIFY REQUEST GIVEN ENDPOINT AND QUERY STRING */
/************************************************************************** */
function makeSpotifyRequest(ENDPOINT, QUERY){
  console.log("=".repeat(SEP))
  console.log("Retriving Spotify Credentials...")
  let spotify_credentials = credentials.spotify

  return getAccessToken(spotify_credentials)
  .then(AUTHENTICATION_TOKEN => {
    if(AUTHENTICATION_TOKEN) {
    console.log("Success!")
    console.log("=".repeat(SEP))

    return fetchFrom(ENDPOINT, QUERY, AUTHENTICATION_TOKEN)
    .then(res => {
      return res
    })
      // .then(res => handleSearchResults(res))
      // .then(res => console.log(res, null, 2))
    }
  })
}

const gospel_playlist_query = {
  "id": "2XwIpwg8n1lrn8d7Yyui1b"
}

// makeSpotifyRequest("https://api.spotify.com	/v1/search)
// .then(res => {
//   console.log((res))
// })

function getSpoitfyPlaylist(PLAYLIST_ID) {
  return makeSpotifyRequest("https://api.spotify.com/v1/playlists/" + PLAYLIST_ID)
  .then(res => {
    return res
  // console.log((res))
})
}

getSpoitfyPlaylist(gospel_playlist_query.id)
.then(playlist => {
    return {
      "id": playlist.id,
      "name": playlist.name, 
      "author": playlist.owner.display_name,
      "tracklist": playlist.tracks.items, 
      "image": playlist.images[0], 
      "description": playlist.description,
    }
})
.then(res => res.tracklist)
.then(res => {

  console.log(res[0])
})
