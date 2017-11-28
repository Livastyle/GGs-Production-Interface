var firstload = true;

var strikeStageList = [];
var strikeGame = 0;

var sv = {
	"upper":"",
	"lower":""
};
	


window.onload = init;

function init(){
	startWS('ws://'+serverip+':5000',["scoreboardinfo","stagestrike"], process);
	initSceneVisibleTrigger(function(){
		$("#main").addClass("visible");
	}, function(){
		$("#main").removeClass("visible");
	});
	logoRotation();
	timeUpdate();
	setInterval("timeUpdate()", 10000);
}

function timeUpdate(){
	var now = new Date();
	var h = now.getHours();
	var m = now.getMinutes();
	h = (h < 10 ? '0'+h : h);
	m = (m < 10 ? '0'+m : m);
	$("#timevalue").text(h+":"+m);
}

function logoRotation(){
	setTimeout("logoRotation()", 4000);
	var $currentItem = $("#sponsorlogos").children(".visible").first();
	var $nextItem = $currentItem.next();
	if($nextItem.length == 0)
		$nextItem = $("#sponsorlogos").children().first();
	$currentItem.removeClass("visible");
	$nextItem.addClass("visible");
}

function process(data, type){
	console.log(data);
	if(type == 'scoreboardinfo'){
		
		var topValue = data.event + " " +  data.round;
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
	if(type == 'stagestrike'){
		
		strikeGame = data.game;
		console.log(strikeGame);
		// are we currently in a striking situation ?
		if(data.currentStriker != 0){
			
			// check if stagelist has changed
			if(!compareArray(data.stageList, strikeStageList)){
				updateStageListHTML(data.stageList);
			}
			
			var stillIn = data.stageList.concat();
			if(data.strikes && data.strikes.length && data.strikes.length > 0){
				for(index in data.strikes){
					var stage = data.strikes[index].stage;
					var player = data.strikes[index].player;
					$("#stageitem_"+stage).addClass("out");
					var removeAtIndex = stillIn.indexOf(stage);
					if(removeAtIndex > -1)
						stillIn.splice(removeAtIndex, 1);
				}
			}
			for(index in stillIn){
				$("#stageitem_"+stillIn[index]).removeClass("out");
			}
			
			if(stillIn.length == 1){
				$("#stagestrike").addClass("done");
				$("#stagestrike_label span").text("Starter Stage");
			}else{
				$("#stagestrike").removeClass("done");
				$("#stagestrike_label span").text("Starter Stage Striking");
			}
			
			
			$("#stagestrike").addClass("visible");
		}else{
			$("#stagestrike").removeClass("visible");
		}
	}
}

function updateStageListHTML(newList){
	strikeStageList = newList;
	$("#stagestrike_items").html('');
	for(index in strikeStageList){
		var stage = strikeStageList[index];
		console.log(index);
		
		var $item = $('<div class="item" id="stageitem_'+stage+'" />');
		// $item.css("left", (220*index)+"px");
		
		var $itemBg = $('<div class="item-inner" />');
		$itemBg.css("background-image", "url('./../assets/stages/"+strikeGame+"/"+stage+".jpg')");
		
		$item.append($itemBg);
		
		$item.appendTo("#stagestrike_items");
	}
	
	
}

function compareArray(a,b){
	if(a.length != b.length)
		return false;
	for(ai in a){
		var inB = false;
		for(bi in b)
			if(b[bi] == a[ai])
				inB = true;
		if(!inB)
			return false;
	}
	return true;
}


function insertUpper(value){
	console.log(value);
	
	if(sv.upper == value)
		return;
	
	sv.upper = value;
	
	var $b = $("#upper");
	var $bs = $("#upper span");
	
	$bs.removeClass("visible");
	setTimeout(function(){
		$bs.text(value).css("font-size", $b.css("font-size"));
		setTimeout(function(){
			while($b.width() < $bs.width())
				$bs.css("font-size", "-=1px");
			$bs.addClass("visible");
		}, 20);
	}, 200);
}

function insertLower(value){

	if(sv.lower == value)
		return;
	
	sv.lower = value;
	
	var $b = $("#lower");
	var $bs = $("#lower span");
	
	$bs.removeClass("visible");
	setTimeout(function(){
		$bs.text(value).css("font-size", $b.css("font-size"));
		setTimeout(function(){
			while($b.width() < $bs.width())
				$bs.css("font-size", "-=1px");
			$bs.addClass("visible");
		}, 20);
	}, 200);
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
