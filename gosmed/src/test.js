// import { makeSpotifyRequest } from "./spotify"
import { makeYoutubeRequest, youtubeSearchByKeyword, handleYoutubeVideoResponse } from "./youtube.js"
import { YoutubeQuery } from "./class.js"
import { separator } from "./util.js"
import * as fs from 'fs'


console.log("Youtube Request Test")
let writeTestReults = {}

let bible_study = youtubeSearchByKeyword(new YoutubeQuery("bible study", "video"), handleYoutubeVideoResponse)
.then(response => {
	separator()
	console.log("Youtube Query Response: \n", response)
	writeTestReults["Bible Study"] = response
})

let motivation = youtubeSearchByKeyword(new YoutubeQuery("christian motivational speeches", "video"), handleYoutubeVideoResponse)
.then(response => {
	separator()
	console.log("Youtube Query Response: \n", response)
	writeTestReults["Motivation"] = response
})

let worship = youtubeSearchByKeyword(new YoutubeQuery("christian gospel worship music video", "video"), handleYoutubeVideoResponse)
.then(response => {
	separator()
	console.log("Youtube Query Response: \n", response)
	writeTestReults["Worship Music"] = response
})

let sermon = youtubeSearchByKeyword(new YoutubeQuery("christian bible sermon church", "video"), handleYoutubeVideoResponse)
.then(response => {
	separator()
	console.log("Youtube Query Response: \n", response)
	writeTestReults["Sunday Sermon"] = response
})

const FILE_PATH = "data/youtube.json"

Promise.all([bible_study, motivation, worship, sermon])
.then(() => {
	separator()

	console.log("Writing Youtube Search Results to " + FILE_PATH)

	const str = JSON.stringify(writeTestReults, null, 2)
	fs.writeFileSync(FILE_PATH, str)
	
	separator()
	console.log(str)
})
