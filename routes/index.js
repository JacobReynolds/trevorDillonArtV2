var express = require('express');
var router = express.Router();
var fs = require('fs');
var util = require('util');
var formidable = require('formidable');
var loggedIn = false;
//Temp password until prod release
var password = 'password';
var portfolioPath = 'public/images/portfolio/';
/* GET home page. */
router.get('/', function (req, res) {
    res.render('index');
});

router.get('/sloths', function (req, res) {
    if (!loggedIn) {
        res.redirect('login');
    } else {
        fs.readdir(portfolioPath, function (err, result) {
            if (err) {
                return console.error(err);
            } else {
                res.render('sloths', {
                    'images': result
                })
            }
        })
    }
});

router.get('/portfolio', function (req, res) {
    fs.readdir(portfolioPath, function (err, result) {
        if (err) {
            return console.error(err);
        } else {
            res.render('portfolio', {
                'images': result
            })
        }
    })
});

router.get('/recent', function (req, res) {
    res.render('recent')
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
    res.render('login');
})

router.post('/attemptLogin', function (req, res) {
    if (req.body.password === password) {
        loggedIn = true;
        res.redirect('/sloths');
    } else {
        res.redirect('back');
    }
})

router.post('/upload', function (req, res) {
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
    form.parse(req);
})

router.post('/removeimage', function (req, res) {

    fs.unlink(portfolioPath + req.body.imageId, function (err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('back');
        }
    });
});

module.exports = router;

/*console.log(util.inspect(req.body, {
        showHidden: false,
        depth: null
    }));*/
