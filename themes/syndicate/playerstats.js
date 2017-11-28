
var _fetchedID = 0;
var _fetchedID2 = 0;
var _game = 0;
var _doubles = false;
var _currentPlayer = -1;
var _resultsPages = 0; // will be generated
var _resultsItemsPerPage = 3;
var _resultsCurrentPage = 1;
var _resultRotationTimeout;

var po;

var _tpl;
var _rankingTpl;

window.onload = init;

function init(){
	
	_tpl = $("#listItemTemplate").attr("id", "").remove().clone();
	_rankingTpl = $("#rankingItemTemplate").attr("id", "").remove().clone();
	startWS(process);
	initSceneVisibleTrigger(function(){
		$("#main").addClass("visible");
		resultRotation();
		_resultRotationTimeout = setInterval(resultRotation, 4000);
	}, function(){
		$("#main").removeClass("visible");
		if(_resultRotationTimeout)
			clearTimeout(_resultRotationTimeout);
	});

}

function process(data){
	
	if($("#main").hasClass("visible"))
		return;
	
	console.log(data);
	_game = parseInt(data.game);
	_doubles = (data.playstyle == "doubles");
	
	var player = getParameter("player");
	var seatID = data.seatorder[player-1];
	
	if(!data.player[seatID])
		return;
	
	var playerObj = data.player[seatID];
	var smashggID = parseInt(playerObj.smashgg);
	if(!smashggID || smashggID == 0)
		return;
	

	
	if(_currentPlayer == smashggID)
		return;
	_currentPlayer = smashggID;
	
	var nicknameStr = "";
	for (var i = 0, len = playerObj.nickname.length; i < len; i++)
		nicknameStr+="<span>"+playerObj.nickname[i]+"</span>";
	
	$("#nickname > span").html(nicknameStr).css("font-size", $("#nickname").css("font-size"));
	setTimeout(function(){
		while($("#nickname > span").width() > $("#nickname").width())
			$("#nickname > span").css("font-size", "-=1px");
		
		
		for (var i = 1, len = playerObj.nickname.length; i <= len; i++){
			$("#nickname > span > span:nth-child("+i+")").css("transition", "opacity .5s "+(500 + (i*100))+"ms");
		}
	},30);
	
	var flagurl = './../assets/flags/midres/'+playerObj.country+'.png';
	$("#country").css("background-image","url('"+flagurl+"')");
	
	$("#team, #teamlogo").html("");
	
	var teamStrArr = [];
	playerObj.teams.forEach(function(team){
		teamStrArr.push(team.name);
		$("#teamlogo").append('<div class="item" style="background-image:url(\'./../assets/teams/logo.php?tid='+team.id+'&s=250&inline=1\');" />');
	});
	$("#team").text(teamStrArr.join(", "));
	
	
	
	
	$("#list").html('');
	$("#ranking").html('');
	$("#listwaiting").addClass("visible");
	po = new SmashGGPlayer(smashggID);
	po.setGame(data.game);
	po.setEventType(_doubles ? 'DOUBLES' : 'SINGLES'); 
	po.on('init', function(){
		
		
		po.getRankings(function(list){
			console.log(list);
			
			list.forEach(function(item){
				var $item = _rankingTpl.clone();
				var imageUrl = selectProperRankingIcon(item, 32);
				
				var pubDate = new Date(item.publishedAt * 1000);
				
				
				$item.children('.logo').css("background-image", "url('"+imageUrl+"')");
				$item.children('.rank').text(item.rank);
				$item.children('.year').text(pubDate.getFullYear());
				$("#ranking").append($item);
			});
			
		});
		
		
		po.getNoteableResults({
			displayCount:9,
			recentAmount:30,
			calculatePlacementWeight:true
		},function(list){
			var indexer = 1;
			var pager = 1;
			_resultsPages = Math.ceil(list.length / _resultsItemsPerPage);
			$("#listwaiting").removeClass("visible");
			list.forEach(function(item){
				var $item = _tpl.clone();
				$item.addClass("listitem_"+indexer+" listitem_page_"+pager);
				var imageUrl = selectProperTournamentImage(item, 200, "profile");
				
				$item.children('.logo').css("background-image", "url('"+imageUrl+"')");
				$item.children('.name').text(item.tournament.name);
				$item.find('.placing').text(item.event.entrant.finalPlacement).addClass("number_length_"+(item.event.entrant.finalPlacement).toString().length);
				$item.find('.entrantcount').text(item.event.numEntrants);
				$item.children('.location').text((item.tournament.city || item.tournament.addrState)+", "+ (item.tournament.regionDisplayName || item.tournament.countryCode));
				
				$("#list").append($item);
				if(indexer == _resultsItemsPerPage){
					indexer = 1;
					pager++;
				}else
					indexer++;
			});
		});	
	});
	

}

function resultRotation(){

	
	$(".listitem_page_"+_resultsCurrentPage).addClass("hidden");
	let page = _resultsCurrentPage;
	setTimeout(function(){	
		$(".listitem_page_"+page).removeClass("visible hidden");
	},2000);
	
	
	if(_resultsCurrentPage == _resultsPages)
		_resultsCurrentPage = 1;
	else
		_resultsCurrentPage++;
	
	$(".listitem_page_"+_resultsCurrentPage).addClass("visible");
	
}


function selectProperTournamentImage(item, sizeAim, type){
	var imgList = item.tournament.images;
	imgList.sort(function (a, b) {
		if (a.width > b.width) 
			return -1;
		if (a.width < b.width) 
			return 1;
		return 0;
	});
	var currentImg = "";
	for(let index in imgList){
		var io = imgList[index];
		if(io.type == type && (currentImg.length == 0 || io.width >= sizeAim)){
			currentImg = io.url;
		}
	}
	if(currentImg.length == 0){
		for(let index in imgList){
			var io = imgList[index];
			if(currentImg.length == 0 || io.width >= sizeAim){
				currentImg = io.url;
			}
		}
	}
	return currentImg;
}

function selectProperRankingIcon(item, sizeAim){
	var imgList = item.series.images;
	imgList.sort(function (a, b) {
		if (a.width > b.width) 
			return -1;
		if (a.width < b.width) 
			return 1;
		return 0;
	});
	var currentImg = "";
	for(let index in imgList){
		var io = imgList[index];
		if(io.type == "icon" && (currentImg.length == 0 || io.width >= sizeAim)){
			currentImg = io.url;
		}
	}
	if(currentImg.length == 0){
		for(let index in imgList){
			var io = imgList[index];
			if(currentImg.length == 0 || io.width >= sizeAim){
				currentImg = io.url;
			}
		}
	}
	return currentImg;
}





var SmashGGPlayer = function(id){ 
	let _this = this;
	let _id = id;
	let _game = 0;
	let _eventtype = 0;
	
	let _params = {
		displayCount:10,
		recentAmount:null,
		includeEntrantCounts:false,
		calculatePlacementWeight:false
	};
	
	
	let _onList = {};
	
	let _data = {};
	
	let _rankings = {};
	
	
	
	var searchStr = 'player/' + _id;
	$.getJSON("./../cp/ajax/smashgg.json.php?url="+encodeURI(searchStr))
	.done(function(data){
		_data = data.entities;
		console.log(_data);
		
		// fill rankings object
		if(_data.rankingSeries && _data.rankingSeries.length > 0){
			for(let ri in _data.rankingSeries){
				let ro = _data.rankingSeries[ri];
				_rankings[ro.id] = ro;
			}
		}
		
		_onFire('init');
	});
	
	
	/*
	_params = {
		
		displayCount - how many to actually display
		recentAmount - how many recent tournaments to be valid
		includeEntrantCounts - get entrant count for each event (performance impact)
		calculatePlacementWeight - (requires includeEntrantCounts) - get most noteable results
	}
	*/
	this.getNoteableResults = function(overrideParams, callback){

		for(let index in overrideParams) _params[index] = overrideParams[index];
		if(_params.calculatePlacementWeight) _params.includeEntrantCounts = true;

		var resultList = [];
		
		this.getResults(function(ro){
			resultList.push(ro);
		});
		
		resultList.sort(function (a, b) {
			if (a.tournament.endAt > b.tournament.endAt) 
				return -1;
			if (a.tournament.endAt < b.tournament.endAt) 
				return 1;
			return 0;
		});

		
		if(_params.recentAmount != null){
			if(resultList.length > _params.recentAmount)
				resultList.length = _params.recentAmount;
		}
		
		var promiseArr = [];
		
		
		if(_params.includeEntrantCounts){
			for(let resIndex in resultList){
				var resObj = resultList[resIndex];
				promiseArr.push(new Promise(function(resolve, reject) { 
					_this.getEventEntrantCounts(resObj.event.id, function(count){
						resultList[resIndex].event.numEntrants = count;
						resolve();
					});
				}));
			}
		}

		Promise.all(promiseArr).then(function(values){ 
		
			// if possible, check for doubled tournaments
			if(_params.includeEntrantCounts){
				resultList.sort(function (a, b) {
					if (a.event.numEntrants > b.event.numEntrants) 
						return -1;
					if (a.event.numEntrants < b.event.numEntrants) 
						return 1;
					return 0;
				});
				
				var tournamentAlreadyInList = [];
				
				for(let ri in resultList){
					let ro = resultList[ri];
					if(tournamentAlreadyInList.indexOf(ro.tournament.id) == -1){
						tournamentAlreadyInList.push(ro.tournament.id);
					}else{
						resultList.splice(ri, 1);
						ri--;
					}
				}
				
			}
		
			if(_params.calculatePlacementWeight){
				for(let ri in resultList){
					let ro = resultList[ri];
					resultList[ri].worth = ro.event.numEntrants / ro.event.entrant.finalPlacement;
				}
				resultList.sort(function (a, b) {
					if (a.worth > b.worth) 
						return -1;
					if (a.worth < b.worth) 
						return 1;
					return 0;
				});
			}else{
				resultList.sort(function (a, b) {
					if (a.event.finalPlacement > b.event.finalPlacement) 
						return 1;
					if (a.event.finalPlacement < b.event.finalPlacement) 
						return -1;
					return 0;
				});
			}
			if(resultList.length > _params.displayCount)
				resultList.length = _params.displayCount;
			callback(resultList);
			
		}).catch(function(reason){
			console.log(reason);
		});
	}
	
	this.getResults = function(callback){
		var resultList = [];
		_this.getAttendeeEntries(function(ao){
			var to = _getAttendeeTournament(ao);
			if(!to)
				return;
			_getAttendeeEvents(ao, function(eo){
				callback({
					attendee:ao,
					event:eo,
					tournament:to
				});
			});
		});
	};
	
	this.getRankings = function(callback){
		var rankingsList = [];
		if(_data.player.rankings && _data.player.rankings.length > 0){
			for(var ri in _data.player.rankings){
				var ro = _data.player.rankings[ri];
				if(ro.videogameId == _game){
					ro.series = _rankings[ro.seriesId];
					// has icons to display
					if(ro.series.images && ro.series.images.length > 0){
						rankingsList.push(ro);
					}
				}
			}
			
		}
		callback(rankingsList);
	}
	
	this.getEventEntrantCounts = function(eid, callback){
		var searchStr = 'event/' + eid + '?expand[0]=entrantCounts';
		$.getJSON("./../cp/ajax/smashgg.json.php?url="+encodeURI(searchStr))
		.done(function(data){
			try {
				callback(data.entities.event.numEntrants);
			}catch(ex){
				callback(null);
			}
		});
	};
	
	
	
	this.getAttendeeEntries = function(callback){
		for(let index in _data.attendee){
			var attendeeObj = _data.attendee[index];
			if(attendeeObj.entrants && attendeeObj.entrants.length > 0){
				callback(attendeeObj);
			}
		}
	};
	
	let _getAttendeeTournament = function(ao){
		for(let i in _data.tournament){
			let to = _data.tournament[i];
			if(to.id == ao.tournamentId && _checkTournamentApproval(to)){
				return to;
			}
		}
	};
	
	let _getAttendeeEvents = function(ao, callback){
		for(let eventIndex in ao.events){
			var eventObj = ao.events[eventIndex];
			if(eventObj.type == _eventtype && eventObj.videogameId == _game){
				var entrant;
				for(let entrantIndex in ao.entrants){
					if(ao.entrants[entrantIndex].eventId == eventObj.id && ao.entrants[entrantIndex].finalPlacement > 0){
						entrant = ao.entrants[entrantIndex];
						break;
					}
				}
				if(entrant){
					eventObj.entrant = entrant;
					callback(eventObj);
				}
			}
		}
	}
	
	let _checkTournamentApproval = function(to){
		if(!to.approved)
			return false;
		if(to.images.length == 0)
			return false;
		if(to.tournamentType != 1)
			return false;	
		if(to.startAt*1000 > new Date().getTime())
			return false;
		
		// TODO : add more perhabs
		
		return true;
	}
	
	this.setGame = function(game, isSmashggId){
		if(!isSmashggId)
			_game = _this.VIDEOGAME[game];
		else
			_game = game;
	}
	this.setEventType = function(type, isSmashggId){
		if(!isSmashggId)
			_eventtype = _this.EVENTTYPE[type];
		else
			_eventtype = type;
	}
	

	this.on = function(type, callback){
		_onInit(type);
		_onList[type].push(callback);
	}
	
	let _onFire = function(type, data){
		_onInit(type);
		if(_onList[type].length == 0)
			return;
		_onList[type].forEach(function(callback){
			callback(data);
		});
	}
	let _onInit = function(type){
		if(!_onList.hasOwnProperty(type))
			_onList[type] = new Array();	
	}
	
	
	
	// CONSTANTS
	this.VIDEOGAME = { // local : smashgg
		1:1,
		6:2,
		3:3
	};

	this.CHARACTER = { // local : smashgg
		1:6, // fox
		2:5,	// falco
		3:18, // Peach
		4:2, // cf
		5:1, //  bowser
		6:3, // dk
		7:4, // doc
		8:16, // gaw
		9:7, // ganon
		10:8, // ic
		11:9, // jiggs
		12:10, // kirby
		13:11, // link
		14:12, // luigi
		15:13, // mario
		16:14, // marth
		17:15, // mewtwo
		18:17, // ness
		19:19, // Pichu
		20:20, // Pikachu
		21:21, // Roy
		22:22, // Samus
		23:23, // Sheik
		24:25, // Y Link
		25:24, // Yoshi
		26:26, // Zelda
		
		// smash4
		27:27, // mario 
		28:29, // Peach
		29:52, // CF
		30:42, // Kirby
		31:51, // Lucario
		32:28, // Luigi
		33:82, // Bayonetta
		34:30, // Bowser
		35:65, // Bowser Jr
		36:50, // Charizard
		37:80, // Cloud
		38:81, // Corrin
		39:				0, // Mario | BRAWL
		40:70, // Dark pit
		41:34, // diddy kong
		42:33, // DK
		43:31, //  doc
		44:75, // duck hunt
		45:46, // falco
		46:45, // fox
		47:38, // ganon
		48:66, // greninja
		49:57, // ike
		50:48, // jiggs
		51:44, // dedede
		52:35, // link
		53:72, // little mac
		54:0, // DELETED
		55:54, //  lucas
		56:68, // lucina
		57:55, // marth
		58:76, // megaman
		59:43, // meta knight
		60:49, // mewtwo
		61:79, // mii brawler ----
		62:79, // mii sword ------ ALL THE SAME SMASHGG ID
		63:79, // mii gun --------
		64:0, // DELETED
		65:58, // gaw
		66:53, // ness
		67:61, // olimar
		68:77, // pac-man
		69:69, // Palutena
		70:47, // pikachu
		71:59, // pit
		72:62, // rob
		73:67, // robin
		74:64, // rosalinas
		75:56, // roy
		76:78, // ryu
		77:40, // samus
		78:37, // sheik
		79:74, // shulk
		80:63, // sonic
		81:39, // toon link
		82:71, // villager
		83:60, // wario
		84:73, // wii fit
		85:32, // yoshi
		86:36, // zelda
		87:41, // Zero suit samus
		88:				0 // Ike BRAWL
	};

	this.EVENTTYPE = {
		SINGLES:1,
		DOUBLES:2,
		CREWS:5
	};
	
};





