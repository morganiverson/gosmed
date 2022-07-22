// Play YT Videos In App: https://www.npmjs.com/package/react-native-youtube
import fetch from "node-fetch";
import clientSecret from './client_secret.json' assert {type: 'json'};
const SEP = 70

const END_POINT = 'https://www.googleapis.com/youtube/v3/search';

/** export **/ const fetchSearchRequest = (searchTerm) => {
  return {
    type: "FETCH_SEARCH_REQUEST",
    searchTerm,
  };
};

/** export **/ const fetchSearchSuccess = (data) => {
  return {
    type: "FETCH_SEARCH_SUCCESS",
    data,
  }
}

/** export **/ const fetchSearchFailure = (message) => {
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
  
  
/** export **/ 
const fetchSearch = (searchTerm) => {
	let query = {
		// part: 'snippet',
		maxResults: 5,
		type: 'video',
		videoDefinition: 'high',
		key: API_KEY,
		q: searchTerm,
	};

	console.log("Query: " + JSON.stringify(query, null, 2))
	console.log("=".repeat(SEP))

	query = queryStringFromObj(query);
	console.log("Formatted Query: " + JSON.stringify(query, null, 2))
	console.log("=".repeat(SEP))


	console.log(fetchSearchRequest(searchTerm));

	return fetch(`${END_POINT}?${query}`)
	.then(d => d.json())
	.then(d => {
		// console.log("Data: \n" + JSON.stringify(d.items.map(item => item.id.videoId), null, 2));

		d = d.items.map(item => item.id.videoId)

		console.log(fetchSearchSuccess(d));
		console.log("=".repeat(SEP))
		return d

	})
	.catch((error) => {
		// console.error(error);
		console.log(fetchSearchFailure(error));
	});
}


var API_KEY = ""
var SEARCH_TERM = "dog"

try {
	console.log("Retriving API Key...")
	// API_KEY = require("./client_secret.json").API_KEY
	API_KEY = clientSecret.API_KEY
	console.log("Successfully Retrieve API Key!")
	console.log("=".repeat(SEP))

	fetchSearch(SEARCH_TERM)
	.then(searchResults => {
		console.log("Search Results(" + searchResults.length + "): " + searchResults)
		// console.log(JSON.stringify(searchResults, null, 2))
		console.log("=".repeat(SEP))

	})
}
catch(e){
	console.log("Error Retrieving API Key!")
	console.log(e)
	
}



