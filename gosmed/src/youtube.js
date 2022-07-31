// Play YT Videos In App: https://www.npmjs.com/package/react-native-youtube
import fetch from "node-fetch";
import credentials from "./credentials.json" assert {type: 'json'};
import { getSearchQuery, separator } from "./util.js"

const END_POINT = 'https://www.googleapis.com/youtube/v3/search';


  let QUERY = {
	maxResults: 5,
	type: 'video',
	videoDefinition: 'high',
	q: "dog", //searchTerm
};

function getYoutubeAPIToken(credentials){
	separator()
    console.log("Retriving Youtube API Token...")
	let API_KEY = ""
	try{
		API_KEY = credentials.api_key
		console.log("Successfully Retrieve API Key!")
		separator()
	}
	catch(e) {
		console.error("Error Retrieving Youtube API Key!")
		API_KEY = null
	}
	return API_KEY
}

function fetchFromYoutube(ENDPOINT, QUERY, API_KEY, qAttribute){
	if(QUERY) QUERY.key = API_KEY;

	const SEARCH_QUERY = getSearchQuery(ENDPOINT, QUERY, qAttribute)

	console.log("Initiating Youtube Request...")
	return fetch(SEARCH_QUERY)
	.then(res => res.json())
	.then(res => { return res })
	.catch((e) => { return Promise.reject(e)});
}
/************************************************************************** */
/* MAKE YOUTUBE REQUEST GIVEN ENDPOINT AND QUERY STRING */
/* Get API Token and Return Requested Data or Error */
/************************************************************************** */
export function makeYoutubeRequest(ENDPOINT, QUERY, qAttribute) {
	console.log("Initialiting Youtube Request...")

	const API_KEY = getYoutubeAPIToken(credentials.youtube.web)

	if(API_KEY == null) {
		return Promise.reject(new Error("Missing API_KEY!"));
	}
	else {
		return fetchFromYoutube(ENDPOINT, QUERY, API_KEY, qAttribute)
		.then(res => { return res})
		.catch(e => { return Promise.reject(e) })
	}
}
 
export function noQueryYoutubeRequest(ENDPOINT) {
	console.log("Initialiting Youtube Request...")

	const API_KEY = getYoutubeAPIToken(credentials.youtube.web)

	if(API_KEY == null) {
		return Promise.reject(new Error("Missing API_KEY!"));
	}
	else {
		return fetchFromYoutube(ENDPOINT, {}, API_KEY)
		.then(res => { return res})
		.catch(e => { return Promise.reject(e) })
	}

}

//  COMPLETE YOUTUBE VIDEO SEARCH BY KEYWORD
export function youtubeSearchByKeyword(youtubeQueryObject, handler) {
	const YOUTUBE_ENDPOINT = 'https://www.googleapis.com/youtube/v3/search';

	return makeYoutubeRequest(YOUTUBE_ENDPOINT, youtubeQueryObject.getQuery(), true)
	.then(res => { 
		return handler(res)
	})
	.catch(e => {
		separator()
		console.log("Error Completing Youtube Request: " + e.message)
		separator()
	})
}

// # EXTRACT SPECIFIC DATA FROM YOUTUBE VIDEO LISTING
export async function handleYoutubeVideoResponse(youtubeResponse) {
	console.log("Getting Video Information...")
	separator()
	const videos = youtubeResponse.items.map(item => item.id.videoId)
	console.log("VIDEO IDS: \n", videos)

	let videoDetails = await Promise.all(videos.map(async video => {
		return makeYoutubeRequest("https://www.googleapis.com/youtube/v3/videos", { part: "snippet", id: video}, false)
		.then(res => res.items[0])
		.then(res => res.snippet)
		.then(res => {
			return "'" + res.title + "' by '" + res.channelTitle + "'"
			// {
			// 	videoTitle: res.title, 
			// 	channelTitle: res.channelTitle, 
			// 	image: res.thumbnails.default
			// }
		})
		.then (res => { return res })
		.catch(e => { return  Promise.reject(e.message) })
	}))

	return videoDetails
}

// module.exports = {
// 	makeYoutubeRequest, 
// 	handleXYoutubeRequest
// }

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
