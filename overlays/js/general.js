var _jsonTimestamp = 0;

function getParameter(name) {
    var params = location.search.substr(1).split("&");
	for(k in params){
		var tmp = params[k].split("=");
		if(tmp[0] === name)
			return decodeURIComponent(tmp[1]);
	}
	return null;
}

function loadJsonController(callback, alwaysCallback, errorCallback){
	$.ajax({
		type: "GET",
		dataType : 'json',
		cache: false,
		async:true,
		url : "./../controller.json"
	}).done(function(data){
		if(_jsonTimestamp == data.timestamp)
			return;
		_jsonTimestamp = data.timestamp;
		callback(data);
	}).always(function(){
		if(alwaysCallback != undefined)
			alwaysCallback();
	}).fail(function(e1,e2,e3){
		console.log(e2+'-'+e3);
		if(errorCallback != undefined)
			errorCallback(e1,e2,e3);
	});	
}

function getFieldValue(data, name){
	if(typeof data == "object" && data.fields && data.fields[name])
		return data.fields[name].value;
	return "";
}

/*
startWS(String serverLocation, String listenType, Function callback)
startWS(String serverLocation, Function callback)
startWS(Function callback)
*/
var _ws;
function startWS(var1, var2, var3){
	var websocketServerLocation = (typeof(var1) == "string" ? var1 : 'ws://'+location.host+':5000');
	var type = ((typeof(var2) == "string" || typeof(var2) == "object") ? var2 : "scoreboardinfo");
	var callback = var3 || var2 || var1;
	console.log(type);
	
    _ws = new WebSocket(websocketServerLocation);
    _ws.onmessage = function(evt) { 
		var wsdata = JSON.parse(evt.data);
		console.log("maybe incoming: "+ wsdata.type);
		if(typeof type == "object"){
			// check for array
			if(type.indexOf(wsdata.type) == -1)
				return;
		}else{
			// for for string
			if(wsdata.type != type)
				return;
		}
		console.log("incoming: "+ wsdata.type);
		if(callback.length == 1)
			callback(wsdata.data);
		else
			callback(wsdata.data, wsdata.type);
	};
    _ws.onclose = function(){
        //try to reconnect in 5 seconds
        setTimeout(function(){startWS(websocketServerLocation)}, 3000);
    };
}


var _savedValues = {};
function svIsSet(name, value, overwrite){
	if(typeof(overwrite) == "undefined")
		overwrite = true;
	var isIdentical = (svGet(name) === value);
	if(!isIdentical && overwrite)
		svSet(name, value);
	return isIdentical;
}
function svSet(name, value){
	_savedValues[name] = value;
}
function svGet(name){
	if(!_savedValues.hasOwnProperty(name))
		_savedValues[name] = "";
	return _savedValues[name];
}
function svClear(){
	_savedValues = {};
}



var _sceneVisibleTriggerState = null;
function sceneVisibleTrigger(visibleCallback, hiddenCallback){
	if(location.hash === "#used")
		return;
	if(location.hash === "#toggle")
		_sceneVisibleTriggerState = (_sceneVisibleTriggerState !== true);
	else
		_sceneVisibleTriggerState = (location.hash === "#visible");
	location.hash = "#used";
	if(_sceneVisibleTriggerState)
		visibleCallback();
	else
		hiddenCallback();
}

function initSceneVisibleTrigger(c1, c2){
	window.onhashchange = sceneVisibleTrigger.bind(null, c1, c2);
}



/*
string combineNamePrefix(string name, array teams, string fullname, boolean iconAndFullname, string logoBackground)

Description:
combines the nickname with sponsor icons, if available

return: html string

*name:
basic nickname of player (eg. "Armada", "Liva" or "reaper")

*teams:
array of teams objects

*fullname: 
display name, specified in controller software. (eg. "[A]rmada", "C9 | Mango" or "mYi | Liva")

iconAndFullname: (default: false)
 - true = displays both, sponsor icon AND sponsor prefix
 - false = displays icon only. in case any icon is not available, display sponsor prefix only

logoBackground: (default: null)
defines the background the logo will appear on. 
it tries to avoid using the same color for logo and background
*/
function combineNamePrefix(nickname, teams, displayname, iconAndFullname, logoBackground){
	iconAndFullname = (typeof iconAndFullname === 'boolean') ? iconAndFullname : false;
	logoBackground = (typeof logoBackground === 'string') ? logoBackground : "";

	var prefix = [];
	if(teams.length > 0){
		for(index in teams){
			var teamObj = teams[index];
			var filename = './../assets/teams/logo.php?tid='+teamObj.id+'&s=60&inline=1&bg='+logoBackground;
			prefix.push('<img class="teamlogo" src="'+filename+'" alt="'+teamObj.prefix+'" />');
		}
	}
	return prefix.join("")+"<span class=\"nickname\">"+(iconAndFullname ? displayname : nickname)+"</span>";
}


var _animationTimeout = [];
function insertValueResize(customParams){
	// define default params
	var params = {
		value:"",
		field:"",
		child:"span",
		fadeOut:100,
		fadeIn:100,
		crashPrevention:100,
		visibleClass:null,
		hiddenClass:"hidden",
		classMirror:"",
		timeoutName:"",
		callback:null
	};
	
	console.log(customParams);
	
	// override default params
	for(var index in customParams)
		params[index] = customParams[index];
	
	if(customParams.timeoutName && customParams.timeoutName.length > 0)
		params.timeoutName = customParams.timeoutName;
	else
		params.timeoutName =  params.field.replace(/[^a-zA-Z0-9]/g, "");
	
	var $outer = $(params.field);
	var $inner = $(params.field+" "+params.child);
	var $mirror = $(params.classMirror);
	
	if(params.visibleClass && params.visibleClass.length > 0){
		$outer.removeClass(params.visibleClass);
		$mirror.removeClass(params.visibleClass);
	}
	if(params.hiddenClass && params.hiddenClass.length > 0){
		$outer.addClass(params.hiddenClass);
		$mirror.addClass(params.hiddenClass);
	}

	if(_animationTimeout[params.timeoutName])
		clearTimeout(_animationTimeout[params.timeoutName]);
	
	if(typeof(params.callback) == "function") params.callback(1); // status callback
	
	_animationTimeout[params.timeoutName] = setTimeout(function(){
		if(typeof(params.callback) == "function") params.callback(2); // status callback
		$inner.html(params.value).css("font-size", $outer.css("font-size"));
		_animationTimeout[params.timeoutName] = setTimeout(function(){
			if(typeof(params.callback) == "function") params.callback(3); // status callback
			var crashPreventionCounter = 0;
			while($inner.width() > $outer.width()){
				$inner.css("font-size", "-=1px");
				crashPreventionCounter++;
				if(crashPreventionCounter > params.crashPrevention){
					console.error("insertValueResize looped infinitly - cancel");
					console.error(params);
					break;
				}
			}
			if(params.visibleClass && params.visibleClass.length > 0 && params.value.length > 0){
				$outer.addClass(params.visibleClass);
				$mirror.addClass(params.visibleClass);
			}
			if(params.hiddenClass && params.hiddenClass.length > 0 && params.value.length > 0){
				$outer.removeClass(params.hiddenClass);
				$mirror.removeClass(params.hiddenClass);
			}
			_animationTimeout[params.timeoutName] = setTimeout(function(){
				if(typeof(params.callback) == "function") params.callback(4); // status callback
			}, params.fadeIn);
		},40);
	}, params.fadeOut);
}
