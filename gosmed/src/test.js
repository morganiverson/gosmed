// import { makeSpotifyRequest } from "./spotify"
import { makeYoutubeRequest, youtubeSearchByKeyword, handleYoutubeVideoResponse } from "./youtube.js"
import { spotifySearchByKeyword, handleSpotifyPodcastResponse, spotifyPlaylistRequest, handleSpotifyPlaylistResponse } from "./spotify.js"
import { YoutubeQuery, SpotifyQuery } from "./class.js"

import { separator } from "./util.js"
import * as fs from 'fs'

import spotify_top_gospel from "./data/spotify_source.json" assert {type: "json"}


console.log("Spotify Request Test")
let writeTestResults = {}

// youtubeSearchByKeyword(new YoutubeQuery("bible study", "video"), handleYoutubeVideoResponse)


// spotifySearchByKeyword(new SpotifyQuery("christian", "show", 25), handleSpotifyPodcastResponse)
let top_gospel = spotify_top_gospel.map(playlist => {
	return spotifyPlaylistRequest(playlist["playlist_id"], (res) => {
		let [playlistName, songs] = [res.name, res.tracks.items]
		songs = songs.slice(0, 5).map(song => {
			return song.track.name + " [by " + song.track.artists.map(artist => artist.name).join(",") + "]"
		})
		writeTestResults[playlist["category"]] = songs
	})
})




// console.log(top_gospel)
Promise.all(top_gospel)
.then(() => {
	fs.writeFileSync("./data/spotify_gospel.json", JSON.stringify(writeTestResults, null, 2))
})

