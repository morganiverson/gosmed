// import { makeSpotifyRequest } from "./spotify"
import { makeYoutubeRequest, handleXYoutubeRequest } from "./youtube.js"

import { separator } from "./util.js"
/**
 * Your request can also use the Boolean NOT (-) and OR (|) operators 
 * to exclude videos or to find videos that are associated with one of 
 * several search terms. For example, to search for videos matching 
 * either "boating" or "sailing", set the q parameter value to 
 * boating|sailing. Similarly, to search for videos matching either 
 * "boating" or "sailing" but not "fishing", set the q parameter 
 * value to boating|sailing -fishing. Note that the pipe character 
 * must be URL-escaped when it is sent in your API request. 
 * The URL-escaped value for the pipe character is %7C.
 */
// Youtube Topic Ids: https://gist.github.com/stpe/2951130dfc8f1d0d1a2ad736bef3b703
// "/m/06bvp | Religion"
// "/m/02mscn Christian music"


let youtubeQuery = {
		maxResults: 5,
		type: 'video',
		videoDefinition: 'high',
		q: "bible study", //searchTerm,
		// safeSearch: "none", 
		// topicId: "", 
		// videoCategoryId: "", 
		order: "rating" //"rating", "viewCount"
}

const youtubeEndpoint = 'https://www.googleapis.com/youtube/v3/search';

console.log("Request 1")
makeYoutubeRequest(youtubeEndpoint, youtubeQuery, true)
.then(res => {
	const videos = res.items.map(item => item.id.videoId)
	console.log(videos)
	// handleXYoutubeRequest(res)

	videos.forEach(video => {
		makeYoutubeRequest("https://www.googleapis.com/youtube/v3/videos", { part: "snippet", id: video}, false)
		.then(res => res.items[0])
		.then(res => res.snippet)
		.then(res => {
			return {
				videoTitle: res.title, 
				channelTitle: res.channelTitle, 
				image: res.thumbnails.default}
		})
		.then(res => {
			console.log(res)
		})
	})
})
.catch(e => {
	console.log("Error Completing Youtube Request: " + e.message)
	separator()
})


// let q = {q: { test: 1}}
// console.log(encodeURIComponent(JSON.stringify(q)))

