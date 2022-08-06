import fetch from "node-fetch"
import * as jsdom from "jsdom"
const { JSDOM } = jsdom;
import * as fs from 'fs'
// const endpoint = "https://www.bdsradio.com/clientUploads/bdsradiocharts/21.html?cacheBuster=B89686F195B9475BB1D6E26C4945697"
// const CATEGORY = "Christian AC"
import BDS from "./data/bds_source.json" assert { type: "json"}

let src = BDS.filter(item => item["category"] == "Gospel Hip Hop")
console.log(src)


src.forEach(src => {
	const ENDPOINT = src["endpoint"]
	const CATEGORY = src["category"]

	fetch(ENDPOINT)
	.then (res => res.text())
	.then(html => {return new JSDOM(html)})
	.then(dom => {
		getTopSongs(dom.window.document)	
	})

	function getTopSongs(document) {
		let topSongs = {}
		let rowsOfMainTableAsTR = [...document.querySelectorAll("table#grdGenMainChart_ctl00 > tbody > tr")] // ROW OF MAIN CHART TABLE - CHART RANK - 1 IN ID
		// console.log(rowsOfMainTableAsTR.map(item => item.getAttribute("id")))

		// rowsOfMainTableAsTR = [rowsOfMainTableAsTR[0]]
		rowsOfMainTableAsTR.forEach(row => {
			const id = row.getAttribute("id")
			const rank = parseInt(id.substr(id.lastIndexOf("_") + 1)) + 1
			// console.log(rank)
			const spanContainingTableWithSong = [...row.querySelectorAll("tr > td > table > tbody > tr > td > span")] //SPANS CONTAINING SUB TABLE WHERE SONG DETAILS ARE
			// console.log(spanContainingTableWithSong.map(item => item.getAttribute("class")))

			let spansWithDetails = spanContainingTableWithSong.filter(item => ["Chart_Bold", "Chart_Regular"].includes(item.getAttribute("class"))  )
			const [artist, songTitle] = spansWithDetails.map(item => item.innerHTML)

			topSongs[rank] = {
				"rank": rank, 
				"artist": artist, 
				"songTitle": songTitle
			}
			console.log((rank).toString().padStart(2) + "\t" + songTitle.padStart(30) + "\t" + artist.padStart(60))
		
		})	

		let toWrite = {}
		toWrite[CATEGORY] = topSongs
		fs.writeFileSync("data/top" + CATEGORY.replace(/\s+/g, '') + ".json", JSON.stringify(toWrite, null, 2))
	}


})

