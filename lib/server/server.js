var express = require('express');
var path = require('path');
var pg = require('pg');
var React = require('react');
var Router = require('react-router');
var BodyParser = require('body-parser');
var routes = require('../routes');

const app = express();
app.use(express.static(__dirname + '/../../public'));
const connectionString = process.env.DATABASE_URL || 'postgres://bxujcozubyosgb:m1rgVoS1lEpdCZVRos6uWZVouU@ec2-54-235-146-58.compute-1.amazonaws.com:5432/d42dnjskegivlt?ssl=true';
const port = process.env.PORT || 3000;

// set up Jade
app.use(BodyParser.urlencoded({ extended: false }));
app.use(BodyParser.json());

app.set('views', './views');
app.set('view engine', 'jade');

app.get('/*', function (req, res) {
  if (req.path.indexOf('/database') == -1) {
    res.render('index');
  }
});

var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('JamSesh is listening at http://%s:%s', host, port);
});