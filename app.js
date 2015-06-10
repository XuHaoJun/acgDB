var express = require('express');
var logger = require('morgan');
var compression = require('compression');
var killable = require('killable');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(compression());

app.use(logger('dev'));


require('./app/routes').addToExpress(app);

var server = app.listen(process.env.PORT || 3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('App listening at http://%s:%s', host, port);
});

killable(server);

// Handle Ctrl-c.
process.on('SIGINT', function() {
  console.log('Recevie SIGINT.');
  server.kill(function() {
    console.log('http server closed!');
    process.exit();
  });
});
