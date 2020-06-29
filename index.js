// import library
const fs = require('fs');

// Initialize
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const sqlite3 = require('sqlite3').verbose();

// video route
var video = require('./routes/video');
var import_media = require('./routes/import_media')();

var db;

// setting global root file
global.__basedir = __dirname;

app.use('/index_style.css', function(req, res){
        res.sendFile(__basedir + '/views/index_style.css'); 
});

// Make io accessible to our router
app.use(function(req,res,next){
    req.db = db;
    req.io = io;
    next();
});

app.use('/video', video);
app.use('/import_media', import_media);

app.get('/', function(req, res){
    res.sendFile(__basedir + '/views/index.html');
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

    socket.on('load_id', function(load_data){
        var path = `/video/${load_data.media_type}/${load_data.id}`;
        io.to(socket.id).emit("play", path);
    });

    socket.on('load_series_season', function(series_id){
        //GOHERE1
        let sql = `SELECT id, title FROM series_detail where series_id=${series_id}`;

	    db.all(sql, [], (err, rows) => {
	        if (err) {
	            throw err;
	        }

            io.to(socket.id).emit("query_res", rows);
        });
    });

    socket.on('edit_id', function(media_id){

        let sql = `SELECT id, title FROM movies WHERE id = ${media_id}`;

        db.get(sql, [], (err, rows) => {
            if(err){
                throw err;
            }

            io.to(socket.id).emit("edit_query_res", rows);

        });
    });

    socket.on('edit_query_req', function(media_meta_edit){

        let sql = `UPDATE ${media_meta_edit.db} SET title = "${media_meta_edit.title}" WHERE id = ${media_meta_edit.id}`;

        db.run(sql, [], (err) => {
            if(err){
                io.to(socket.id).emit("req_err", "Update row failed");
                throw err;
            } 
        });
    });

    socket.on('query', function(query){
        console.log(query.media_type);

        var media_type = query.media_type;
        var search_text = query.search_text;

        let sql = `SELECT id, title FROM ${media_type} where title LIKE '%${search_text}%'`;

	    db.all(sql, [], (err, rows) => {
	        if (err) {
	            throw err;
	        }

            io.to(socket.id).emit("query_res", rows);
        });
    });
    
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
