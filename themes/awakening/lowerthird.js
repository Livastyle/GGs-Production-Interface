

window.onload = init;

function init(){
	initSceneVisibleTrigger(function(){
		$("#main").addClass("visible");
	}, function(){
		$("#main").removeClass("visible");
	});
	startWS(process);
}

function process(data, type){
	var topValue = data.event + " " +  data.round;
	if(data.fields.overlaytop.checked)
		topValue = data.fields.overlaytop.value;
	insertValue("upper", topValue);
	
	var bottomValue = getPlayerString(data);
	if(data.fields.overlaybottom.checked)
		bottomValue = data.fields.overlaybottom.value;
	insertValue("lower", bottomValue);
}

function insertValue(field, value){
	if(svIsSet(field, value)) return;
	insertValueResize({
		value:value,
		field:"#"+field+" .inner"
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
