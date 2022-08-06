import fetch from "node-fetch"
import credentials from "./data/credentials.json" assert {type: 'json'};
import { getQueryString, getSearchQuery, separator } from "./util.js"

const ENDPOINT = "https://api.spotify.com/v1/search";

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
      // console.log(res)
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

// makeSpotifyRequest("https://api.spotify.com	/v1/search", query)
// .then(res => {
//   console.log((res))
// })

export function spotifyPlaylistRequest(PLAYLIST_ID, handler) {
  return makeSpotifyRequest("https://api.spotify.com/v1/playlists/" + PLAYLIST_ID)
  .then(res => {handler(res)})
}

export function handleSpotifyPlaylistResponse(res) {
	let [playlistName, songs] = [res.name, res.tracks.items]
	
		songs = songs.slice(0, 5).map(song => {
			// return {
			// 	"name": song.track.name,
			// 	"artist": song.track.artists.map(artist => artist.name).join(",")
			// } 
			return song.track.name + " [by " + song.track.artists.map(artist => artist.name).join(",") + "]"
		})
		// console.log(songs)
	
}


export function spotifySearchByKeyword(spotifyQueryObject, handler) {
  makeSpotifyRequest("https://api.spotify.com/v1/search", spotifyQueryObject.getQuery())
  .then(res => handler(res))
}

export function handleSpotifyPodcastResponse(res) {
	console.log(res.shows.items.map(item => item.name + " [by " + item.publisher + "]"))
}
/** 
// function spotifyPodcastSearchByKeyword(spotifyQueryObject, handler) {

// }


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
**/