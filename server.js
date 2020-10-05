const Twit = require('twit');


let Tweet = new Twit({
    consumer_key: '1cp0mey96pOKFScLqGRYRLUFy',
    consumer_secret: 'cKyGaVWmZdPhYeY6C2jooeNsSF3mPp8VCY6p5gxV6ioh1d4zxn',
    access_token: '14107059-YPlTtRxFQRi295lKREbf7AB7KTJ2vyNMgYMHxxXvH',
    access_token_secret: 'bHjpFqzSVjfOU9iwSKNCkojZfqyOqYF2VaS8tPirw3enm',
});

var express = require('express');
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var path = require('path');
var Sensor = require('./models/sensors.js');




const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/capteurs', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// viewed at http://localhost:8080
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/client/index.html'));
});
app.get('/tweets', function(req, res) {
    res.sendFile(path.join(__dirname + '/client/tweets.html'));
});

app.get('/dataviz', function(req, res) {
    res.sendFile(path.join(__dirname + '/client/dataviz.html'));
});
app.get('/tweets.js', function(req, res) {
    res.sendFile(path.join(__dirname + '/client/source/js/tweets.js'));
});

app.get('/api/capteurs/:stype', function(req, res) {


    Sensor.find({"sensor_type" : req.params.stype}).exec(function(err, sensorList) {
        if (err) {
            console.log(err);
        }
        console.log(sensorList);
        res.json(sensorList);

    });


});

//- Paramètres de recherche : "javascript" et "iot"
let stream = Tweet.stream('statuses/filter', {
    track: ['#javascript, #iot']
});

//- Ecoute le stream socket.io
stream.on('tweet', (tweet) => {
    io.emit('tweet', {
        'tweet': tweet
    });
});

stream.on('error', function(error) {
    throw error;
});

io.on('connection', (socket) => {
    console.log('a user connected');
});



http.listen(3000, () => {
    console.log('listening on *:3000');
});
