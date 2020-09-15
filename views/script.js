var socket = io();
var text_input_focused = false;        

// Load directory when the page is loaded    
window.onload = function(){

    // Initialize and propangate search result
	search_submit();
    
    // auto play
    document.getElementById("media_player").addEventListener('ended', autoplay_next, false)

    // Add search text listerner for enter key
    // Search box
    search_text.addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            document.getElementById("search_button").click();
        }
    });

    let media_player = document.getElementById("media_player");
    // Add fullscreen ability by pressing f and menu ability | issue: conflict with text box (fixed)

    document.addEventListener("keyup", function(event) {
        event.preventDefault();
        

        // also check document.activeElement.tagName
        text_input_focused = event.target.matches('input, textarea');
        // esc is 27 | toggle menu
        if (event.keyCode === 27) {
            toggle_menu();
        }

        // space_keyCode is 70 | toggle fullscreen
        if (event.keyCode === 70 && !text_input_focused) {
            if(!document.mozFullScreen && !document.webkitIsFullScreen){
                try{
                    media_player.mozRequestFullScreen();
                } catch(err){
                    console.log(err);
                }

                try{
                    media_player.webkitEnterFullScreen();
                } catch(err){
                    console.log(err);
                }

                media_player.focus();
            } else {
                try{
                    document.mozCancelFullScreen();
                } catch(err){
                    console.log(err);
                }

                try{
                    document.webkitExitFullScreen();
                } catch(err){
                    console.log(err);
                }

            }
        }
    });
}

function load_with_id(id, media_type, title = "Howdy"){
    // Load media with the id
    return function() {
        document.getElementById("media_title").innerHTML = title;
        var load_data = {"media_type":media_type, "id":id}
        if(media_type === "series"){
            socket.emit("load_seasons", id)
        } else {
            document.getElementById("title_info").innerHTML = title;
            socket.emit("load_id", load_data);
        }
        //toggle_menu(); // potential bug
    };
}

function load_season_with_id(id, title = "Howdy"){
    // Load media with the id
    return function() {
        document.getElementById("media_title").innerHTML = title;
        var load_data = {"media_type":media_type, "id":id}
        socket.emit("load_episodes", id)
    };
}

function load_episode_with_id(id, title = "Howdy"){
    // Load media with the id
    return function() {
        document.getElementById("media_title").innerHTML = title;
        var load_data = {"media_type":"series", "id":id}
        socket.emit("load_id", load_data)
    };
}

function play_next(){
    var id = parseInt(document.getElementById("episode_id").innerHTML);
    id++;
    document.getElementById("episode_id").innerHTML=id;
    var media_type = document.getElementById("media_type").value;
    var load_data = {"media_type":media_type, "id":id}
    socket.emit("load_id", load_data);
}

function autoplay_next(e){
    setTimeout(play_next, 3000);
}

function play_previous(){
    var id = parseInt(document.getElementById("episode_id").innerHTML);
    id--;
    document.getElementById("episode_id").innerHTML=id;
    var media_type = document.getElementById("media_type").value;
    var load_data = {"media_type":media_type, "id":id}
    socket.emit("load_id", load_data);
}

function clear_info(){
    document.getElementById("title_info").innerHTML = "";
    document.getElementById("episode_title_info").innerHTML = "";
    document.getElementById("media_type_info").innerHTML = "";
    document.getElementById("series_id").innerHTML = "";
    document.getElementById("season_id").innerHTML = "";
    document.getElementById("episode_id").innerHTML = "";
    //console.log("howdy");
};

function edit_with_id(id){
    // edit media with the id - form is pop up 
    return function() {
        document.getElementById("edit_popup").style.display = "block";

        document.getElementById("media_meta_edit").innerHTML = `{"id":${id}, "db":"movies"}`;
        
        socket.emit("edit_id", id)
    };
}

function cancel_edit(){
    // cancel edit form disappear
    document.getElementById("edit_popup").style.display = "none";
    document.getElementById("media_meta_edit").innerHTML = `{"id":"","db":""}`;
}

function submit_edit(){
    // submit edit 
    var media_meta_edit = JSON.parse(document.getElementById("media_meta_edit").innerHTML);
    media_meta_edit["title"] = document.getElementById("media_title_edit").value;

    //console.log(media_meta_edit);

    socket.emit("edit_query_req", media_meta_edit);

    document.getElementById("edit_popup").style.display = "none";
    
    search_submit();
}

function toggle_menu(){
    // toggle menu that show search results
    let menu_container = document.getElementById("menu_container");
    let menu_status = document.getElementById("menu_status");
   
    if(menu_container.style.display === "none"){ 
        menu_container.style.display = "block";
        menu_status.innerHTML = "&darr;";
        document.getElementById("search_text").focus();

    }else{
        menu_container.style.display = "none";
        menu_status.innerHTML = "&uarr;";
        media_player.focus();
    }
}

socket.on("req_err", function(err){
    // when there is an error
    console.log(`Request Error: ${err}`); 
});

socket.on("edit_query_res", function(rows){
    document.getElementById("media_title_edit").value = rows.title;
});

function search_submit(){
    clear_info();
    // submit the search query
    var search_text = document.getElementById("search_text").value;
    var media_type = document.getElementById("media_type").value;
    document.getElementById("media_type_info").innerHTML = media_type;
    var query = {'media_type':media_type, 'search_text': search_text};
    socket.emit("query", query);
}

socket.on("query_res", function(query_res){
    // when the result of a query arrive
    var ul = document.getElementById("media_list");
    var series_title = document.getElementById("media_list").innerHTML;
    ul.innerHTML = "";
    
    var media_type = query_res.media_type;
    var rows = query_res.rows;

    console.log(media_type) 
    console.log(rows) 
    
    if(typeof query_res.rows != "undefined"){
        rows.forEach(function(item){
            // Creating button element
            var li = document.createElement("li");

            var edit_media_button = document.createElement("button");
            edit_media_button.addEventListener('click', edit_with_id(item.id));
            edit_media_button.appendChild(document.createTextNode("Edit"));
            li.appendChild(edit_media_button);

            var media_button = document.createElement("button");
            media_button.addEventListener('click', load_with_id(item.id, media_type, item.title));
            media_button.appendChild(document.createTextNode(item.title));
            li.appendChild(media_button);
            
            // Add to stuff 
            ul.appendChild(li);
        });
    } 
    // Create button elements from data
});

socket.on("seasons_query_res", function(rows){
    // when the result of a query arrive
    var ul = document.getElementById("seasons_list");

    ul.innerHTML = "";
    
    rows.forEach(function(item){
        // Creating button element
        var li = document.createElement("li");

        var edit_media_button = document.createElement("button");
        edit_media_button.addEventListener('click', edit_with_id(item.id));
        edit_media_button.appendChild(document.createTextNode("Edit"));
        li.appendChild(edit_media_button);

        var media_button = document.createElement("button");
        media_button.addEventListener('click', load_season_with_id(item.id, item.title));
        media_button.appendChild(document.createTextNode(item.title));
        li.appendChild(media_button);
        
        // Add to stuff 
        ul.appendChild(li);
    });
});

socket.on("episodes_query_res", function(rows){
    // when the result of a query arrive
    var ul = document.getElementById("episodes_list");

    ul.innerHTML = "";
    
    rows.forEach(function(item){
        // Creating button element
        var li = document.createElement("li");

        var edit_media_button = document.createElement("button");
        edit_media_button.addEventListener('click', edit_with_id(item.id));
        edit_media_button.appendChild(document.createTextNode("Edit"));
        li.appendChild(edit_media_button);

        var media_button = document.createElement("button");
        media_button.addEventListener('click', load_episode_with_id(item.id, item.title));
        media_button.appendChild(document.createTextNode(item.title));
        li.appendChild(media_button);
        
        // Add to stuff 
        ul.appendChild(li);
    });
});

socket.on("play", function(media_url){
    //GOHERE
    var viewer_src = document.getElementById("viewer_source");
    viewer_src.src = media_url;

    media_player.focus();
    media_player.load();
});
