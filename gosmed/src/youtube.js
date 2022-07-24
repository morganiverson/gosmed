// Play YT Videos In App: https://www.npmjs.com/package/react-native-youtube
import fetch from "node-fetch";
import clientSecret from './client_secret.json' assert {type: 'json'};
import credentials from "./credentials.json" assert {type: 'json'};
import { getSearchQuery, separator } from "./util.js"

const END_POINT = 'https://www.googleapis.com/youtube/v3/search';
 
/**
 * const fetchSearchRequest = (searchTerm) => {
  return {
    type: "FETCH_SEARCH_REQUEST",
    searchTerm,
  };
};

 const fetchSearchSuccess = (data) => {
  return {
    type: "FETCH_SEARCH_SUCCESS",
    data,
  }
}

 const fetchSearchFailure = (message) => {
  return {
    type: "FETCH_SEARCH_FAILURE",
    message,
  };
};

const queryStringFromObj = (data) => {
	const str = Object.keys(data).map(key => (
	  `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`
	));
  
	return str.join('&');
  };
 **/ 
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

function fetchFromYoutube(ENDPOINT, QUERY, API_KEY){
	QUERY.key = API_KEY;

	const SEARCH_QUERY = getSearchQuery(ENDPOINT, QUERY)

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
function makeYoutubeRequest(ENDPOINT, QUERY) {
	console.log("Initialiting Youtube Request...")

	const API_KEY = getYoutubeAPIToken(credentials.youtube.web)
	if(API_KEY == null) {
		return Promise.reject(new Error("Missing API_KEY!"));
	}
	else {
		return fetchFromYoutube(ENDPOINT, QUERY, API_KEY)
		.then(res => { return res})
		.catch(e => { return Promise.reject(e) })
	}
}
 
function handleXYoutubeRequest(res) {
	console.log(res)
}

makeYoutubeRequest(END_POINT, QUERY)
.then(res => {
	handleXYoutubeRequest(res)
})
.catch(e => {
	console.log("Error Completing Youtube Request: " + e.message)
	separator()
})


// try {
// 	console.log("Retriving API Key...")
// 	// API_KEY = require("./client_secret.json").API_KEY
// 	API_KEY = clientSecret.API_KEY
// 	console.log("Successfully Retrieve API Key!")
// 	separator()

// 	// fetchSearch(SEARCH_TERM)
// 	// .then(searchResults => {
// 	// 	console.log("Search Results(" + searchResults.length + "): " + searchResults)
// 	// 	// console.log(JSON.stringify(searchResults, null, 2))
// 	// 	separator()

// 	// })
// }
// catch(e){
// 	console.log("Error Retrieving API Key!")
// 	// console.log(e)
// }

