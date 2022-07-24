import fetch from "node-fetch"
import credentials from "./credentials.json" assert {type: 'json'};
import { getQueryString, getSearchQuery, separator } from "./util.js"

const ENDPOINT = "https://api.spotify.com/v1/search";

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
function fetchFromSpotify(ENDPOINT, QUERY, AUTHENTICATION_TOKEN) {

  const SEARCH_QUERY = getSearchQuery(ENDPOINT, QUERY)
  
  console.log("Initiating Spotify Request...")

  if(AUTHENTICATION_TOKEN == null) {
		return Promise.reject(new Error("Missing AUTHENTICATION_TOKEN!"));
	}
	else {
    return fetch(SEARCH_QUERY, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${AUTHENTICATION_TOKEN}`
        }
      })
      .then(res => res.json())
      .then(res => { return res })
      .catch(e => { return Promise.reject(e) })
  }    
}

function getSpotifyAccessToken(credentials){
  separator()
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
      console.log("Success!")
      separator()
      return res.access_token
    })
    .catch(e => {return Promise.reject(e)})
}

/************************************************************************** */
/* MAKE SPOTIFY REQUEST GIVEN ENDPOINT AND QUERY STRING */
/* Get Access Token and Return Requested Data or Error */
/************************************************************************** */
function makeSpotifyRequest(ENDPOINT, QUERY){
  separator()
console.log("Initiating Spotify Request...")
  return getSpotifyAccessToken(credentials.spotify)
  .then(AUTHENTICATION_TOKEN => {
    return fetchFromSpotify(ENDPOINT, QUERY, AUTHENTICATION_TOKEN)
    .then(res => { return res })
    .catch(e => { return Promise.reject(e) })
  })
}


const gospel_playlist_query = {
  "id": "2XwIpwg8n1lrn8d7Yyui1b"
}

makeSpotifyRequest("https://api.spotify.com	/v1/search", query)
.then(res => {
  console.log((res))
})

function getSpoitfyPlaylist(PLAYLIST_ID) {
  return makeSpotifyRequest("https://api.spotify.com/v1/playlists/" + PLAYLIST_ID)
  .then(res => {
    return res
})
}

// getSpoitfyPlaylist(gospel_playlist_query.id)
// .then(playlist => {
//     return {
//       "id": playlist.id,
//       "name": playlist.name, 
//       "author": playlist.owner.display_name,
//       "tracklist": playlist.tracks.items, 
//       "image": playlist.images[0], 
//       "description": playlist.description,
//     }
// })
// .then(res => res.tracklist)
// .then(res => {

//   console.log(res[0])
// })
