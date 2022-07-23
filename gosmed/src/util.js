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