var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var TOKEN_DIR = process.env.OPENSHIFT_DATA_DIR + '/.credentials/';
if (process.env.NODE_ENV === 'debug') {
	TOKEN_DIR = './.credentials/';
}
var TOKEN_PATH = TOKEN_DIR + '/gmail.json';

function sendEmail(to, from, replyto, subject, message) {
	fs.readFile(TOKEN_PATH, function processClientSecrets(err, content) {
		if (err) {
			console.log('Error loading client secret file: ' + err);
			return;
		}
		// Authorize a client with the loaded credentials, then call the
		// Gmail API.
		authorize(JSON.parse(content), function (auth) {
			sendMessage(auth, to, from, replyto, subject, message);
		});
	});
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
	var clientSecret = credentials.installed.client_secret;
	var clientId = credentials.installed.client_id;
	var redirectUrl = credentials.installed.redirect_uris[0];
	var auth = new googleAuth();
	var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

	// Check if we have previously stored a token.
	fs.readFile(TOKEN_DIR + 'stored_token.json', function (err, token) {
		if (err) {
			getNewToken(oauth2Client, callback);
		} else {
			oauth2Client.credentials = JSON.parse(token);
			callback(oauth2Client);
		}
	});
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
	var SCOPES = ['https://www.googleapis.com/auth/gmail.send'];
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
				console.log('Error while trying to retrieve access token', err);
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
	fs.writeFile(TOKEN_DIR + 'stored_token.json', JSON.stringify(token));
	console.log('Token stored to ' + TOKEN_DIR + 'stored_token.json');
}

function makeBody(to, from, replyto, subject, message) {
	var str = ["Content-Type: text/plain; charset=\"UTF-8\"\n",
        "MIME-Version: 1.0\n",
        "Content-Transfer-Encoding: 7bit\n",
        "to: ", to, "\n",
        "from: ", from, "\n",
		"reply-to: ", replyto, "\n",
        "subject: ", subject, "\n\n",
        message
    ].join('');

	var encodedMail = new Buffer(str).toString("base64").replace(/\+/g, '-').replace(/\//g, '_');
	return encodedMail;
}

function sendMessage(auth, to, from, replyto, subject, message) {
	var raw = makeBody(to, from, replyto, subject, message);
	var gmail = google.gmail('v1');
	gmail.users.messages.send({
		auth: auth,
		userId: 'me',
		resource: {
			raw: raw
		}
	}, function (err, response) {
		if (err) {
			console.log('error sending email on ' + new Date() + ': ' + err);
		}
	});
}

module.exports = {
	sendEmail: sendEmail
}
