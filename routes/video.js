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
	content.pipe(response); // Piping the content to response
}

function pipeWithOutRange(path, fileSize, request, response){
    const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
    }
    
	const content = fs.createReadStream(path);
    
    response.writeHead(200, head);
    content.pipe(response);
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
    console.log(toReturn);
    return toReturn;
}

let router  = express.Router();

//	Stream the video

router.get('/', function(req, res, next) {
    res.render('video_view', {p_path : '.', video_path : '.'});
});

router.get('/:path*', function(req, res, next) {
    
    console.log(req.headers.range)

    // Parsing path list
    var path_lst = req.path.split('/');
    path_lst = path_lst.filter(x => x !== ''); 
    var path = path_lst.join('/');
    readContent(path, req, res);

    /*
	const stat = fs.statSync(path)
	const fileSize = stat.size
	const range = req.headers.range
    
	if (range) {

	  	const parts = range.replace(/bytes=/, "").split("-")
	  	const start = parseInt(parts[0], 10)
	  	const end = parts[1]
	  	  ? parseInt(parts[1], 10)
	  	  : fileSize-1
	
	  	const chunksize = (end-start)+1
	  	const file = fs.createReadStream(path, {start, end})
	  	const head = {
	  	  'Content-Range': `bytes ${start}-${end}/${fileSize}`,
	  	  'Accept-Ranges': 'bytes',
	  	  'Content-Length': chunksize,
	  	  'Content-Type': 'video/mp4',
	  }
	
	  res.writeHead(206, head) // code 206 partial content
	  file.pipe(res)
	} else {
	  const head = {
	    'Content-Length': fileSize,
	    'Content-Type': 'video/mp4',
	  }
	  res.writeHead(200, head)
	  fs.createReadStream(path).pipe(res)
	}
    */
});
module.exports = router;

