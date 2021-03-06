let fs      = require('fs')
let path    = require('path');
let express = require('express');

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

});
module.exports = router;

