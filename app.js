var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var busboy = require('connect-busboy');

var http = require('http');
var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(busboy());
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));
app.use('/', routes);
app.use('/sloths', routes);
app.use('/login', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


// Set up pinging so app does not go to sleep
setInterval(function() {
fs.writeFile(process.env.OPENSHIFT_LOG_DIR + "ping.log", "pinging site at: " + process.env.OPENSHIFT_APP_DNS, function(err) {
    if(err) {
        return console.log(err);
    }
}); 
    http.get(process.env.OPENSHIFT_APP_DNS);
}, 300000);

fs.writeFile(process.env.OPENSHIFT_LOG_DIR + "ping.log", "pinging site at: " + $
    if(err) {
        return console.log(err);
    }
}); 
    http.get(process.env.OPENSHIFT_APP_DNS);




var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;
var ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

app.listen(port, ip);

module.exports = app;
