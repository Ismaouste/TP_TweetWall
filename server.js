// Chargement des lib
var Twit = require('twit');
const express = require('express');
const app = express();
const mongoose = require('mongoose');

// add socket.io
var http = require('http').createServer(app);
var io = require('socket.io')(http);

// connect  DB
mongoose.connect('mongodb://localhost:27017/tweetwall', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('db connected on port 27017');
});

// CREATE ROUTES
app.get('/', function (req, res) {
    res.sendFile(__dirname + "/client/static/index.html");
});
app.get('/tweets', function (req, res) {
    res.sendFile(__dirname + "/client/static/tweets.html");
});

// START server
http.listen(3011, function () {
    console.log('Example app listening on port 3011!')
})
// Your keywords to search within the Tweet Stream
var watchlist = ['javascript'];

// Twitter API credentials
var T = new Twit({
    consumer_key: '1cp0mey96pOKFScLqGRYRLUFy',
    consumer_secret: 'cKyGaVWmZdPhYeY6C2jooeNsSF3mPp8VCY6p5gxV6ioh1d4zxn',
    access_token: '14107059-RJdiElrn8F88TGD4VnKoyInlR7NENZuYSrUcwei3q%3DXiAiOraDfeEgsoUcyjFRLug2MGs20Hd3TBk9PysN39QkDCmaPo',
    access_token_secret: 'lrlY2bZ3ch15K9lbjhOxmplBp0jdckDK7kUt0hLfHH7x2',
    timeout_ms: 60 * 1000,  // optional HTTP request timeout to apply to all requests.
});


//Using Twit to import twitter data
io.sockets.on('connection', function (socket) {

    var stream = T.stream('statuses/filter', {track: watchlist});

    stream.on('tweet', function (tweet) {
        // when a new Tweet pops into the stream, we get some data from the Tweet object.
        io.sockets.emit('stream', tweet.user.profile_image_url + ","
            + tweet.created_at + "," + tweet.id + "," + tweet.text
            + ", @" + tweet.user.screen_name);
    });
});

