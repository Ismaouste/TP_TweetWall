// Chargement des lib
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
db.once('open', function() {
    // we're connected!
    console.log('db connected on port 27017');
});

// CREATE ROUTES
app.get('/', function (req, res) {
    res.sendFile( __dirname +  "/client/index.html" );

});

// START server

http.listen(3011, function () {
    console.log('Example app listening on port 3040!')
})
