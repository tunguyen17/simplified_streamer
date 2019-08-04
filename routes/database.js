const sqlite3 = require('sqlite3').verbose();
const express = require('express');

let router  = express.Router();

function render_callback(res, search_q, res_q){
    console.log(res_q);
    res.render('query_view', {search_query : search_q, query_res : res_q});
}

function softFindMedia(res, title, media_type, db, callback){
/*
 * Function to query the media that contains the title string
 * 
 * INPUT: 
 * - title: the title of the media
 * - media_type: the type of media (movie, tvshow, music)
 * - db: databse
 *
 */
 
    let sql = `SELECT * FROM ${media_type} WHERE title like '%${title}%'`;
    
    query_promise = db.all(sql, [], (err, rows) => {
        if(err){
            throw err;
        }

        let data = {};
        rows.forEach((row) => {
            data[row['title']] = "browse/" + row['file_path'];
        });
        callback(res, `Search ${title} - type ${media_type}`, data);
    });

}

function parseQuery(raw_query){
/*
 * Function to parse the query
 * INPUT: the raw query where each params is split by & ex title=tosh.0&type=movies
 */
    let query = raw_query.split('&');
    
    let query_dict = {};
    
    query.forEach((item) =>{
        let item_arr = item.split('=')
        query_dict[item_arr[0]] = item_arr[1];
    });

    return query_dict
}

router.get('/', function(req, res, next) {

    //
    // query in the form title=TITLE&type=TYPE

    let db = new sqlite3.Database('./database/media.db', sqlite3.OPEN_READWRITE, (err) => {
          if (err) {
                  console.error(err.message);
                }
          console.log('Connected to the media database.');
    });

    db.close();
});


module.exports = router;
