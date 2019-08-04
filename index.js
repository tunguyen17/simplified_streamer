// import library
const fs = require('fs');

// Initialize
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const sqlite3 = require('sqlite3').verbose();

// video route
var video = require('./routes/video');
var browse = require('./routes/browse');
var database = require('./routes/database');

var db;

// Make io accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});

app.use('/video', video);
app.use('/browse', browse);
app.use('/database', database);

//app.set('view engine', 'pug');
//app.set('views','./views');

app.get('/', function(req, res){
    res.sendFile(__dirname + '/views/index.html');
});

// socket communication
io.on('connection', function(socket){
    console.log('A user connected ', socket.id);
    
    let sql = "SELECT id, title FROM movies";

	db.all(sql, [], (err, rows) => {
	    if (err) {
	        throw err;
	    }

        io.to(socket.id).emit("query_res", rows);
	}); 

    socket.on('load_id', function(media_id){
        var path = "/video/" + media_id;
        io.to(socket.id).emit("play", path);
    });

    /*
    socket.on('query', function(query){
        io.to(socket.id).emit("play", query);
    });
    
    socket.on('load', function(media_url){
        var path = "/video/videos/" + media_url;
        io.to(socket.id).emit("play", path);
    });

    socket.on('load_dir', function(client_dir){
        //console.log(client_dir);

        var path = "videos/" + client_dir
          
        // reading file
        if(fs.lstatSync(path).isDirectory()){
            // Read dir when path is a folder
            fs.readdir(path, (err, items) => {
                var data = {};
                items.map(x => data[x] = fs.lstatSync(path + '/'  + x).isDirectory() );
                io.to(socket.id).emit("dir_data", data);
            });
        } else {
            path = '/video/' + path;
            //res.render('video_view', {p_path : p_path, video_path : path});
        }

    });
    */


    // User disconnected
    socket.on('disconnect', function(){
        console.log('A user disconnected ', socket.id);
    });
});

http.listen(2030, function(){
    console.log("listening on *:2030"); 

    db = new sqlite3.Database('./database/media.db', sqlite3.OPEN_READWRITE, (err) => {
          if (err) {
                  console.error(err.message);
                }
          console.log('Connected to the media database.');
    });
});
