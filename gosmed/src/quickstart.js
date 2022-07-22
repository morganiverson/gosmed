var fs = require('fs');
var readline = require('readline');
var { google } = require('googleapis');
const { Console } = require('console');
var OAuth2 = google.auth.OAuth2;
var hr_count = 70

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/youtube-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/youtube.readonly'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
	process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'youtube-nodejs-quickstart.json';

// Load client secrets from a local file.
var credentials = {}
try {
	console.log("Reading Credentials...")
	credentials = require("./client_secret.json")

	console.log("Successfully Read Credentials! \n")
	console.log(JSON.stringify(credentials.web, null, 2))
	console.log("=".repeat(hr_count))


	// Authorize a client with the loaded credentials, then call the YouTube API.
	authorize(credentials.web, getChannel);
}
catch (e) {
	console.log("Error Loading Credentials!")
	console.log(e)
	console.log("=".repeat(hr_count))
}

// authorize(credentials, getChannel);


/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
	console.log("\nAuthorizing...")

	const [clientId, clientSecret, redirectUrl] = [credentials.client_id, credentials.client_secret, credentials.redirect_uris[0]]

	// obj = { "OAuth2Credentials": {
	// 	"clientId": clientId, 
	// 	"clientSecret": clientSecret, 
	// 	"redirectUrl": redirectUrl
	// }
	// }

	console.log("OAuth Credentials Set!\n"); // \n" + JSON.stringify(obj, null, 2))
	console.log("=".repeat(hr_count));

	var oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

	console.log("Looking for Existing Token...")
	// Check if we have previously stored a token.
	try {
		var token = require(TOKEN_PATH)
		console.log("Token Found!")
		oauth2Client.credentials = JSON.parse(token);
		callback(oauth2Client);
	}
	catch (e) {
		console.log("Existing Token Not Found!")
		getNewToken(oauth2Client, callback)
	}
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback) {
	console.log("Creating A New Token...")
	var authUrl = oauth2Client.generateAuthUrl({
		access_type: 'offline',
		scope: SCOPES
	});
	console.log('Authorize this app by visiting this url: ', authUrl);
	var rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});
	rl.question('Enter the code from that page here: ', function (code) {
		rl.close();
		oauth2Client.getToken(code, function (err, token) {
			if (err) {
				console.log('Error while trying to retrieve access token');
				return;
			}
			oauth2Client.credentials = token;
			storeToken(token);
			callback(oauth2Client);
		});
	});
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
	try {
		fs.mkdirSync(TOKEN_DIR);
	} catch (err) {
		if (err.code != 'EEXIST') {
			throw err;
		}
	}
	fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
		if (err) throw err;
		console.log('Token stored to ' + TOKEN_PATH);
	});
}

/**
 * Lists the names and IDs of up to 10 files.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function getChannel(auth) {
	var service = google.youtube('v3');
	service.channels.list({
		auth: auth,
		part: 'snippet,contentDetails,statistics',
		forUsername: 'GoogleDevelopers'
	}, function (err, response) {
		if (err) {
			console.log('The API returned an error: ' + err);
			return;
		}
		var channels = response.data.items;
		if (channels.length == 0) {
			console.log('No channel found.');
		} else {
			console.log('This channel\'s ID is %s. Its title is \'%s\', and ' +
				'it has %s views.',
				channels[0].id,
				channels[0].snippet.title,
				channels[0].statistics.viewCount);
		}
	});
}