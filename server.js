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
    consumer_key: 'XX',
    consumer_secret: 'XX',
    access_token: 'X-XX',
    access_token_secret: 'XX',
    timeout_ms: 60 * 1000,  // optional HTTP rxequest timeout to apply to all requests.
});


// //Using Twit to import twitter data
// io.sockets.on('connection', function (socket) {
//
//     var stream = T.stream('statuses/filter', {track: watchlist});
//
//     stream.on('tweet', function (tweet) {
//         // when a new Tweet pops into the stream, we get some data from the Tweet object.
//         io.sockets.emit('stream', tweet.user.profile_image_url + ","
//             + tweet.created_at + "," + tweet.id + "," + tweet.text
//             + ", @" + tweet.user.screen_name);
//     });
// });

//
//  stream a sample of public statuses
//
var stream = T.stream('statuses/sample')

stream.on('tweet', function (tweet) {
    console.log(tweet)
})

//
//  filter the twitter public stream by the word 'javascript'.
//
var stream = T.stream('statuses/filter', { track: 'javascript' })

stream.on('tweet', function (tweet) {
    console.log(tweet)
})

//
// filter the public stream by the latitude/longitude bounded box of Nancy
//
var nancy = [ '5.75', '48.48', '6.5', '48.86' ]
var stream = T.stream('statuses/filter', { locations: nancy })

stream.on('tweet', function (tweet) {
    console.log(tweet)
})
