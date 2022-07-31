const DEFAULT_MAX_RESULTS = 5
const DEFAULT_ORDER = "viewCount"

// # https://developers.google.com/youtube/v3/docs/search/list


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



export class YoutubeQuery {
	constructor(searchTerm, type, order, numResults) {
		this.q = searchTerm
		this.type = type
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


let q = new YoutubeQuery("dog", "video")
console.log(q.getQuery())
