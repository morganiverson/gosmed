export const getQueryString = (data) => {
	const str = Object.keys(data).map(key =>`${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`);
	return str.join('&');
};

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


export const getSearchQuery = (ENDPOINT, QUERY)  => {
	let QUERY_STRING, SEARCH_QUERY = ""
    console.log("Generating Query String...")
    separator()

	if(QUERY) {
		console.log("Query: \n" + JSON.stringify(QUERY, null, 2))
		separator()
	
		QUERY_STRING = getQueryString(QUERY);
		SEARCH_QUERY = ENDPOINT + "?q=" + QUERY_STRING

	  }
	  else {
		console.log("No Query Details Provided...")
		SEARCH_QUERY = ENDPOINT
		separator()
	  }

      console.log("Full Endpoint Path Generated:\n" + SEARCH_QUERY)
      separator()

	  return SEARCH_QUERY
}

export function separator() {
    console.log("=".repeat(80))
}