// https://api.music.apple.com/v1/catalog/{storefront}/genres
import fetch from "node-fetch"


var query = {
    limit: 5, 

}

fetch("https://api.music.apple.com/v1/catalog/us/genres")
.then(res => {
    console.log(res)
})

