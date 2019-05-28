let fs      = require('fs')
let path    = require('path');
let express = require('express');

let router  = express.Router();

router.get('/', function(req, res, next) {

    console.log("At Root Directory");

    fs.readdir('.', (err, items) => {
        var data = {};
        items.map(x => data[x] = './browse/' + x);
        res.render('first_view', {p_path: './browse', dir_path : './', file_lst : data});
    });

    //next();
});


router.get('/:path*', function(req, res){
    
    // Parsing path list
    var path_lst = req.path.split('/');
    path_lst = path_lst.filter(x => x !== ''); 

    console.log(path_lst);
    
    var path = path_lst.join('/');
    var p_path = './browse/' + path + '/..'; 
    console.log(p_path); 
	var full_url =  req.protocol + '://' + req.get("Host") + req.path;

	console.log(full_url);

    if(fs.lstatSync(path).isDirectory()){
        // Read dir when path is a folder
        fs.readdir(path, (err, items) => {
            var data = {};
            items.map(x => data[x] = ( './browse/' + path + "/" + x));
            res.render('first_view', {p_path : p_path, dir_path : path, file_lst : data});
        });
    } else {
        path = '/video/' + path;
        res.render('video_view', {p_path : p_path, video_path : path});
    }
});

module.exports = router;

