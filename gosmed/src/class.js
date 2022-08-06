const DEFAULT_MAX_RESULTS = 5
const DEFAULT_ORDER = "viewCount"

// # https://developers.google.com/youtube/v3/docs/search/list

export class YoutubeQuery {

	// let youtubeQuery = {
	// 	maxResults: 5,
	// 	type: 'video',
	// 	videoDefinition: 'high',
	// 	q: "bible study", //searchTerm,
	// 	safeSearch: "none", 
	// 	topicId: "", 
	// 	videoCategoryId: "", 
	// 	order: "rating" //"rating", "viewCount"
	// }

	constructor(searchTerm, type, order, numResults) {
		this.q = searchTerm
		this.type = (typeof(type)  == "string") ? type : type.join(",")
		this.order = (order == null ? DEFAULT_ORDER: order)
		this.maxResults = (numResults == null ? DEFAULT_MAX_RESULTS : numResults)
	}

	getQuery() {
		let temp =  {}
		temp.videoDefinition = "high"
		temp.safeSearch = "strict"
		Object.keys(this).map(key => temp[key] = this[key])
		return temp
	}
}

export class SpotifyQuery {
	// let query = {
	// 	"name": "Gospel Airplay",
	// 	"artist": "", 
	// 	"album": "", 
	// 	"track": "", 
	// 	"year": "", 
	// 	"upc":"", 
	// 	"genre": "",
	// 	"type" : "playlist", 
	// 	"limit": 5, 
	// }

	constructor(searchTerm, type, numResults) {
		this.q = searchTerm
		this.type = (typeof(type)  == "string") ? type : type.join(",")
		this.limit = (numResults == null ? DEFAULT_MAX_RESULTS : numResults)
	}

	getQuery() {
		let temp =  {}
		temp.market = "US" // must have for podcasts
		Object.keys(this).map(key => temp[key] = this[key])
		return temp
	}
}

// let q = new SpotifyQuery("dog", "song")
// console.log(q.getQuery())
// 
// console.log(typeof(""))