//Import packages
const fs = require('fs');

// Initialize
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// video route
var video = require('./routes/video');
var browse = require('./routes/browse');

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

/*
app.get('/browse/:path*', function(req, res){
    
    // Parsing path list
    var path_lst = req.path.split('/');
    path_lst = path_lst.filter(x => x !== ''); 

    console.log(path_lst);
    
    var path = path_lst.join('/');
    var p_path = path + '/..'; 
    
	var full_url =  req.protocol + '://' + req.get("Host") + req.path;

	console.log(full_url);

    if(fs.lstatSync(path).isDirectory()){
        // Read dir when path is a folder
        fs.readdir(path, (err, items) => {
            var data = {};
            items.map(x => data[x] = (path + "/" + x));
            res.render('first_view', {p_path : p_path, dir_path : path, file_lst : data});
        });
    } else {

        //var vid_path = 'http://localhost:2030/videos/tosh_0/tosh_0_s07.mp4';
        res.render('video_view', {p_path : p_path, video_path : path});
		
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
         
    }
});
*/

app.use('/video', video);
app.use('/browse', browse);

app.listen(2030);
