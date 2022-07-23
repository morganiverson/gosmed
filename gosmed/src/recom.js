import fetch from "node-fetch"
import credentials from "./credentials.json" assert {type: 'json'};
import https from "https"

const ENDPOINT = "https://api.spotify.com/v1/search";
const SEP = 70

// album, artist, track, year, upc, tag:hipster, tag:new, isrc, and genre
let query = {
    "artist": "", 
    "album": "", 
    "track": "", 
    "year": "", 
    "upc":"", 
    "genre": "gospel",
    "type" : "track", 
    "limit": 5, 
}

const getQueryString = (data) => {
	const str = Object.keys(data).map(key =>`${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`);
	return str.join('&');
};


function fetchSearch(AUTH_KEY, query) {

    console.log("Query: \n" + JSON.stringify(query, null, 2))
	console.log("=".repeat(SEP))

    query = getQueryString(query);
	console.log("Formatted Query: \n" + `https://api.spotify.com/v1/search?${query}`)
	console.log("=".repeat(SEP))


    console.log("Initiating Search Request...")
    // https://developer.spotify.com/documentation/web-api/reference/#/operations/search 
    return fetch(`https://api.spotify.com/v1/search?q=${query}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${AUTH_KEY}`
            }
         })
        .then(res => res.json())
        .then(res => res.tracks)
        .then(tracks => {
            console.log("Success!")
        let [ searchResults, next, previous ] = [tracks.items, tracks.next, tracks.previous]
        //tracks.next/previous = next/previous <limit> results (pagination)

        return searchResults
      })
}

function handleSearchResults(results) {
    return results.map(track => {
        return {
            id: track.id, 
            name: track.name,
            artists: track.artists.map(artist => artist.name).join(","), 
            images: track.album.images, 
            album: track.album.name, 
            sample: track.preview_url, 
            popularity: track.popularity
        }
    })


}

// let CLIENT_SECRET, CLIENT_ID, AUTH_KEY = ""; //credentials.spotify.client_secret

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


console.log("Retriving Spotify Credentials...")
let spotify_credentials = credentials.spotify

console.log("=".repeat(SEP))

getAccessToken(spotify_credentials)
.then(token => {
    if(token) {
        console.log("Success!")
        console.log("=".repeat(SEP))
        fetchSearch(token, query)
        .then(res => handleSearchResults(res))
        .then(res => console.log(res, null, 2))
    }
    
})

