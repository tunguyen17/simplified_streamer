let fs      = require('fs')
let path    = require('path');
let express = require('express');

let router  = express.Router();
let movie_path = "media/video/movie/"

function process_movies(io, db){

	fs.readdir(movie_path, (err, media_folders) => {

        media_meta_dict = {};

	    for ( folder of media_folders ){
            // Folder name is title name
            // Look into the folder for media file
			movie_dir = movie_path + folder;

            media_meta = {"title" : folder}
            
            files = fs.readdirSync(movie_dir);

			for (f of files){
                // Read the file inside the movie folder
				ext = f.split(".").pop(); // getting the extention
                // getting the path
                if (ext === 'mp4'){
                    // movie with mp4 extention
                    media_meta['file_path'] = movie_dir + '/' +f;
                }

                if (ext === 'srt'){
                    // movie with mp4 extention
                    subtitle_path = movie_dir + f;
                    media_meta['subtitle_path'] = subtitle_path;
                }
			}

            console.log(media_meta);
            db.run(`INSERT INTO movies (title, file_path) values (?, ?)`, [media_meta["title"], media_meta["file_path"]]
            , (err) => {
                if (err){
                    console.log(`WARNING: import ${media_meta["title"]} failed`);
                }
            });


	    }
	});
}

route = function() {
	router.get('/', function(req, res, next) {
	    res.sendFile(__basedir + '/views/import_video.html');
	    console.log("Import Movies");
        
        // declare io and db
        io = req.io;
        db = req.db;

    	//Socket.IO
    	io.on('connection', function (socket) {
    	    console.log('User has connected to Index');
    	    //ON Events
            process_movies(io, db); 
    	});
	});

    return router;
};

module.exports = route;
