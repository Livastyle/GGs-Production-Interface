window.onload = init;

function init(){
	initSceneVisibleTrigger(function(){
		$("#main").addClass("visible");
	}, function(){
		$("#main").removeClass("visible");
	});
	startWS(process);
	$("#main").addClass("visible");
}

function process(data){
	console.log(data);

	var topValue = data.event + " - " +  data.round;
	if(data.fields.overlaytop.checked)
		topValue = data.fields.overlaytop.value;
	insertUpper(topValue);
	
	var bottomValue = getPlayerString(data);
	if(data.fields.overlaybottom.checked)
		bottomValue = data.fields.overlaybottom.value;
	insertLower(bottomValue);
	
	if(firstload){
		firstload = false;
		if(location.hash.length == 0){
			$("#main").addClass("visible");
		}
	}
	
}


function insertUpper(value){
	if(svIsSet("lt_upper", value)) return;
	insertValueResize({
		value:value,
		field:"#upper"
	});
}

function insertLower(value){
	if(svIsSet("lt_lower", value)) return;
	insertValueResize({
		value:value,
		field:"#lower"
	});
}



function getPlayerString(data){
	var nameStr = "";
	var nameArr = [];
	for(index in data.seatorder){
		var seat = data.seatorder[index];
		if(data.player[seat]){
			var name = data.player[seat].nickname;
			if(data.playstyle == 'singles')
				name = data.player[seat].generateddisplayname;
			if(name.length > 0)
				nameArr.push(name);
		}
	}
	for(index in nameArr){
		if(index < nameArr.length-2){
			nameStr += nameArr[index]+", ";
		}else if(index == nameArr.length-2){
			nameStr += nameArr[index]+" & ";
		}else{
			nameStr += nameArr[index];
		}
	}
	return nameStr;
}

