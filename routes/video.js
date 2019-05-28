let fs      = require('fs')
let path    = require('path');
let express = require('express');

let router  = express.Router();

//
//	Stream the video
//
router.get('/', function(req, res, next) {
    res.render('video_view', {p_path : '.', video_path : '.'});
});

router.get('/:path*', function(req, res, next) {
    
    console.log(req.path);
    
    // Parsing path list
    var path_lst = req.path.split('/');
    path_lst = path_lst.filter(x => x !== ''); 
    var path = path_lst.join('/');

    var stream = fs.createReadStream(path);
	

	//console.log(res);		
    stream.on('open', () => {
        console.log("Start Steaming");
        stream.pipe(res);
    });

    stream.on('error', (err) => {
        console.log(err);
    });

    stream.on('close', () => {
        console.log("FILE CLOSED");
    });

});
module.exports = router;

