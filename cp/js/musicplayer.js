
var audioMusicFolder;
var mpSeekingPercent = 0;
var audioPlayer;;
var mpMusicLibrary = [];
var mpCurrentFile = "";




$("#music-player .progress_outer").on('mousemove', function(e){
	mpSeekingPercent = (e.offsetX / e.currentTarget.clientWidth);
});
$("#music-player .progress_outer").on('click', function(e){
	audioPlayer.currentTime = Math.ceil(audioPlayer.duration * mpSeekingPercent);
});

var lastMusicSend = 0;
function sendMusicData(force){
	var currentTime = Math.ceil(new Date().getTime() / 500); // fix timestamp
	if(lastMusicSend == currentTime && force !== true)
		return;
	lastMusicSend = currentTime;

	var sendObject = {
		"title":"",
		"artist":"",
		"current":0,
		"duration":0,
		"playing":false
	};
	
	var musicObj;
	for(ml_index in mpMusicLibrary){
		if(mpMusicLibrary[ml_index].file == mpCurrentFile){
			musicObj = mpMusicLibrary[ml_index];
			break;
		}
	}
	if(musicObj){
		sendObject.title = musicObj.title;
		sendObject.artist = musicObj.artist;
		sendObject.current = audioPlayer.currentTime;
		sendObject.duration = audioPlayer.duration;
		sendObject.playing = !audioPlayer.paused;
	}
	
	
	//websocket
	if(profile.dest_websocket){
		sendDataToWebsocket(sendObject, "music");
	}
	// json file
	if(profile.dest_json){
		sendMusicDataToJSON(sendObject);
	}
	// xml file
	if(profile.dest_xml){
		sendMusicDataToXML(sendObject);
	}
	// curl request
	if(profile.dest_curl){
		sendMusicDataToCURL(sendObject);
	}
	// create text files
	if(profile.dest_text){
		sendMusicDataToTextFiles(sendObject);
	}

}


function sendMusicDataToJSON(){

}
function sendMusicDataToXML(){

}
function sendMusicDataToCURL(){

}
function sendMusicDataToTextFiles(){

}


function mpPlay(){
	audioPlayer.play();
}

function mpPause(){
	audioPlayer.pause();
}
function mpNext(autoplay){
	if(autoplay == undefined)
		autoplay = !audioPlayer.paused;
	var index = profile.playlist.indexOf(mpCurrentFile);
	index++;
	if(index >= profile.playlist.length)
		index = 0;
	musicCueTrack(profile.playlist[index], autoplay);
}

function mpPrev(autoplay){
	if(autoplay == undefined)
		autoplay = !audioPlayer.paused;
	var index = profile.playlist.indexOf(mpCurrentFile);
	index--;
	if(index < 0)
		index = profile.playlist.length-1;
	musicCueTrack(profile.playlist[index], autoplay);
}


function musicCueTrack(file, autoplay){
	if(!audioMusicFolder || !file)
		return;
	if(autoplay == undefined)
		autoplay = !audioPlayer.paused;
	mpCurrentFile = file;
	audioPlayer.src = audioMusicFolder+mpCurrentFile;
	audioPlayer.oncanplay = function() {
		$("#music-main .tracklist .item").removeClass("playing");
		var musicObj;
		for(ml_index in mpMusicLibrary){
			if(mpMusicLibrary[ml_index].file == mpCurrentFile){
				musicObj = mpMusicLibrary[ml_index];
				break;
			}
		}
		if(musicObj){
			$("#music-main .tracklist .music-item-"+musicObj.id).addClass("playing");
			$("#music-player .progress_text, #sidebar-musicplayer .title").text(musicObj.title+" - "+musicObj.artist);
		}
		if(autoplay){
			audioPlayer.play();
		}
	};

}

function mpAddToPlaylist(file){
	if(typeof profile.playlist != "object")
		profile.playlist = [];
	profile.playlist.push(file);
	displayMusicPlaylist();
}

function displayMusicPlaylist(){
	$("#music-playlist-tracklist").html("");
	for(pl_index in profile.playlist){
		var musicObj;
		var file = profile.playlist[pl_index];
		for(ml_index in mpMusicLibrary){
			if(mpMusicLibrary[ml_index].file == file){
				musicObj = mpMusicLibrary[ml_index];
				break;
			}
		}
		if(musicObj){
			var $item = $('<div class="item music-item-'+musicObj.id+'" onclick="musicCueTrack(\''+(musicObj.file)+'\');" />');
			$item.append('<div class="title">'+musicObj.title+'</div>');
			$item.append('<div class="artist">'+musicObj.artist+'</div>');
			$("#music-playlist-tracklist").append($item);
		}
	}
}

function displayMusicLibrary(){
	
	mpMusicLibrary.sort(function (a, b) {
		if (a.title < b.title) {
			return -1;
		}
		if (a.title > b.title) {
			return 1;
		}
		return 0;
	});
	
	for(index in mpMusicLibrary){
		var musicObj = mpMusicLibrary[index];
		var $item = $('<div class="item music-item-'+musicObj.id+'" />');
		$item.append('<div class="option"><button onclick="mpAddToPlaylist(\''+(musicObj.file)+'\')"><img src="img/mp-add.png" alt="" /></button></div>');
		$item.append('<div class="title" onclick="musicCueTrack(\''+(musicObj.file)+'\');">'+musicObj.title+'</div>');
		$item.append('<div class="artist" onclick="musicCueTrack(\''+(musicObj.file)+'\');">'+musicObj.artist+'</div>');
		$("#music-tracklist").append($item);
	}
}

function refreshMusicList(){

	$.getJSON("ajax/musiclist.json.php")
	.done(function(data){
		audioMusicFolder = data.folder;
		mpMusicLibrary = [];
		var itemCount = data.list.length;
		for(index in data.list){
			var file = data.list[index];
			musicGetID3(file, function(file, title, artist){
				mpMusicLibrary.push({
					"id":guid(),
					"file":escape(file),
					"title":title,
					"artist":artist
				});
				if(mpMusicLibrary.length == itemCount){
					displayMusicLibrary();
					displayMusicPlaylist();
				}
			});
		
		}
	});


}



function musicGetID3(file, callback){
	ID3.loadTags(audioMusicFolder+file, function() {
		var tags = ID3.getAllTags(audioMusicFolder+file);
		if(tags.artist == undefined){
			tags.artist = "(no artist)";
		}
		if(tags.title == undefined){
			tags.title = "(no title)";
		}
		callback(file, tags.title, tags.artist);
	});
};


function initMusicPlayer(){
	audioPlayer = document.getElementById('music-player-audio');
	
	
	
	audioPlayer.onplay = function() {
		$("#mp-stop-btn, #mp-pause-btn").prop("disabled", false);
		$("#mp-play-btn").prop("disabled", true);
	};
	audioPlayer.onpause = function() {
		$("#mp-stop-btn, #mp-play-btn").prop("disabled", false);
		$("#mp-pause-btn").prop("disabled", true);
		sendMusicData(true);
	};
	audioPlayer.onended = function() {
		sendMusicData(true);
		mpNext(true);
	};
	audioPlayer.ondurationchange = function() {
		var s = Math.floor(audioPlayer.duration % 60);
		var m = Math.floor(audioPlayer.duration/60);
		s = (s<10 ? '0'+s : s);
		m = (m<10 ? '0'+m : m);
		$("#music-player .progress_timer .total").text(m+":"+s);
		
		audioPlayer.ontimeupdate();
	};
	audioPlayer.ontimeupdate = function() {
		var s = Math.floor(audioPlayer.currentTime % 60);
		var m = Math.floor(audioPlayer.currentTime/60);
		var p = ((audioPlayer.currentTime/audioPlayer.duration)*100);
		s = (s<10 ? '0'+s : s);
		m = (m<10 ? '0'+m : m);
		$("#music-player .progress_timer .current").text(m+":"+s);
		$("#music-player .progress_inner").css("width", p+"%");
		
		sendMusicData();
	};

}
