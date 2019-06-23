//Import packages
const fs = require('fs');
require('dotenv').config()

// Initialize
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// video route
var video = require('./routes/video');
var browse = require('./routes/browse');
var database = require('./routes/database');

app.set('view engine', 'pug');
app.set('views','./views');

app.get('/', function(req, res){
    console.log("At Root Directory");

    fs.readdir('.', (err, items) => {
        var data = {};
        items.map(x => data[x] = x);
        res.render('first_view', {p_path: '/', dir_path : './', file_lst : data});
    });

});

app.use('/video', video);
app.use('/browse', browse);
app.use('/database', database);

app.listen(2030);
