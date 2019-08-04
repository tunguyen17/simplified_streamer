let fs      = require('fs')
let path    = require('path');
let express = require('express');

// Function Def
// REF: https://gist.github.com/padenot/1324734

function pipeWithRange(path, fileSize, range, request, response){

	const parts = range.replace(/bytes=/, "").split("-");
	const start = parseInt(parts[0], 10);
	const end = parts[1]
	  ? parseInt(parts[1], 10)
	  : fileSize-1;
	
	const chunksize = (end-start)+1;
	const content = fs.createReadStream(path, {start, end});
	const head = {
	  'Content-Range': `bytes ${start}-${end}/${fileSize}`,
	  'Accept-Ranges': 'bytes',
	  'Content-Length': chunksize,
	  'Content-Type': 'video/mp4',
	};
	
	response.writeHead(206, head); // code 206 partial content
	return content.pipe(response); // Piping the content to response
}

function pipeWithOutRange(path, fileSize, request, response){
    const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
    }
    
	const content = fs.createReadStream(path);
    
    response.writeHead(200, head);
    return content.pipe(response);
}

/*
 * Read the content and return <stuff>
 * 
 * INPUT: 
 *  - file : path to the file, may be fix this name
 *  - request and response object 
 */

function readContent(path, request, response){
    var toReturn;
    fs.exists(path, function(exists){
        if(exists){
            fs.stat(path, function(error, stat){
                if(error){
                    response.writeHead(500);
                    response.end("<h1>500, internal error. </h1>");
                    toReturn = undefined;
                } else {
                    const fileSize = stat.size;

                    // MAYBE CALLBACK START HERE, callback input range + file 
                    const range = request.headers.range

                    if(range){
                        // CALLBACK read with range
                        pipeWithRange(path, fileSize, range, request, response);
                    } else {
                        // CALLBACK read without range
                        pipeWithOutRange(path, fileSize, request, response);
                    }
                }
            });
        } else {
            console.log("HOWDY, no file here");
            response.writeHead(404);
            response.end("<h1>404, not found.</h1>")
            toReturn = undefined;
        }
    });
    //console.log(toReturn);
    return toReturn;
}

let router  = express.Router();

//	Stream the video

router.get('/:id', function(req, res, next) {

    let sql = `SELECT file_path FROM movies WHERE id = ${req.params.id}`;
    
    query_promise = req.db.get(sql, [], (err, rows) => {
        if(err){
            throw err;
        }
        console.log(rows.file_path);

        readContent(rows.file_path, req, res);
    });
});

module.exports = router;

