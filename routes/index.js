var express = require('express');
var router = express.Router();
var fs = require('fs');
var util = require('util');
var crypto = require('crypto');
var formidable = require('formidable');
var nodemailer = require('nodemailer');
var imageReturnAmount = 10;
var email = require('./email');
var password = process.env.LOGIN_PASSWORD;
var portfolioPath = process.env.OPENSHIFT_DATA_DIR + '/portfolio/';
var publicPortfolioPath = 'public/images/portfolio/';
if (process.env.NODE_ENV === 'debug') {
	portfolioPath = publicPortfolioPath;
	password = 'test';
}

var sessionKeys = [];
var sessionCookieName = 'sessionid';
/* GET home page. */
router.get('/', function (req, res) {
	res.render('index');
});

router.get('/contact', function (req, res) {
	res.render('contact');
});

//Creation of the publicPortfolioPath should be taken care of by .openshift/action_hooks/deploy
if (!fs.existsSync(portfolioPath)) {
	fs.mkdirSync(portfolioPath);
}

router.get('/sloths', function (req, res) {
	var cookie = req.cookies[sessionCookieName];
	if (!verifySessionId(cookie)) {
		res.redirect('login');
	} else {
		fs.readdir(portfolioPath, function (err, result) {
			if (err) {
				console.error(err);
				result = [];
			}
			res.render('sloths', {
				'images': result
			})
		})
	}
});

router.post('/updateBiography', function (req, res) {
	var cookie = req.cookies[sessionCookieName];
	if (!verifySessionId(cookie)) {
		res.redirect('login');
	} else {
		fs.writeFile("views/aboutStatic.html", req.body.biography, function (err) {
			if (err) {
				return console.log(err);
			}
		});
	}
});


function verifySessionId(cookie) {
	return sessionKeys.indexOf(cookie) > -1;
}

var generateKey = function () {
	var sha = crypto.createHash('sha256');
	sha.update(Math.random().toString());
	return sha.digest('hex');
};

router.get('/portfolio', function (req, res) {
	var start = 0;
	var end = start + 10;
	if (req.query.amount) {
		start = req.query.amount - 10;
		end = req.query.amount;
	}
	var portfolioResult = [];
	fs.readdir(portfolioPath, function (err, result) {
		if (err) {
			console.error(err);
			portfolioResult = [];
		} else {
			for (var i = start; i < end; i++) {
				if (result[i]) {
					portfolioResult.push(result[i]);
				}
			}
			if (req.query.amount) {
				res.send(portfolioResult);
			} else {
				res.render('portfolio', {
					'images': portfolioResult
				})
			}
		}
	})
});

router.get('/recent', function (req, res) {
	res.render('recent')
});

router.get('/aboutStatic', function (req, res) {
	fs = require('fs');
	fs.readFile('views/aboutStatic.html', 'utf8', function (err, data) {
		if (err) {
			return console.log(err);
		}
		res.send(data);
	});
});

router.get('/about', function (req, res) {
	fs.readFile('views/aboutStatic.html', 'utf8', function (err, data) {
		if (err) {
			return console.log(err);
		}
		res.render('about', {
			'biography': data
		})
	});
});

router.get('/getPortfolio', function (req, res) {
	fs.readdir(portfolioPath, function (err, result) {
		if (err) {
			return console.error(err);
		} else {
			res.send({
				'images': result
			})
		}
	})
})

router.get('/login', function (req, res) {
	var cookie = req.cookies[sessionCookieName];
	if (verifySessionId(cookie)) {
		fs.readdir(portfolioPath, function (err, result) {
			if (err) {
				console.error(err);
				result = [];
			}
			res.render('sloths', {
				'images': result
			})
		})
	} else {
		res.render('login');
	}
})

Date.prototype.addHours = function (h) {
	this.setHours(this.getHours() + h);
	return this;
}

router.post('/attemptLogin', function (req, res) {
	if (req.body.password === password) {
		var sessionId = generateKey();
		while (sessionKeys.indexOf(sessionId) > -1) {
			sessionId = generateKey();
		}
		//Need to set one hour expiration here
		res.cookie(sessionCookieName, sessionId, {
			httpOnly: true
		});
		res.redirect('/sloths');
		addId(sessionId);
	} else {
		res.redirect('back');
	}
})

//Should already have verified that sessionId is not in sessionKeys
function addId(sessionId) {
	sessionKeys.push(sessionId);
	setTimeout(function () {
		var index = sessionKeys.indexOf(sessionId);
		sessionKeys.splice(index, 1);
	}, 3600000);
}

router.post('/upload', function (req, res) {
	var cookie = req.cookies[sessionCookieName];
	if (verifySessionId(cookie)) {
		var form = new formidable.IncomingForm();

		form.uploadDir = portfolioPath;

		form.
		on('file', function (field, file) {
			//rename the incoming file to the file's name
			fs.rename(file.path, form.uploadDir + "/" + file.name);
		}).
		on('end', function () {
			res.redirect('back');
		});
		form.parse(req)
	} else {
		res.redirect('back');
	}
})

router.post('/removeimage', function (req, res) {
	var cookie = req.cookies[sessionCookieName];
	if (verifySessionId(cookie)) {
		fs.unlink(portfolioPath + req.body.imageId, function (err) {
			if (err) {
				console.log(err);
			}
		});
	}
	res.redirect('back');
});

router.post('/updateImageOrder', function (req, res) {
	var cookie = req.cookies[sessionCookieName];
	var ids = [];
	if (verifySessionId(cookie)) {
		var images = req.body;
		var name = portfolioPath;
		var uuid = new Date().getTime();
		for (var i = 0; i < images.length; i++) {
			ids.push(uuid);
			fs.rename(portfolioPath + images[i], name + uuid++, function (err) {
				if (err) throw err;
			});
		}
	}
	res.json(ids);
})


router.post('/sendEmail', function (req, res) {
	console.log(req.body.name + ' ' + req.body.email + ' ' + req.body.body);
	sendEmail(req.body.name, req.body.email, req.body.body);
	res.redirect('back');
})

function sendEmail(name, replyTo, body) {
	var to = 'trevordillontattoos@gmail.com';
	//for prod health checks
	if (replyTo === 'jreynoldsdev@gmail.com') {
		to = replyTo;
		replyTo = 'reyno511@umn.edu';
	}
	email.sendEmail(to, 'jreynoldsdev@gmail.com', replyTo, name, body);
}

module.exports = router;
