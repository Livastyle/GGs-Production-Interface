var firstload = true;

var strikeStageList = [];
var strikeGame = 0;

var vMixApiAddress = "http://10.10.11.4:8088/api";
var vMixSceneName = "Stagestrike HTML";


window.onload = init;

function init(){
	startWS('ws://'+location.host+':5000',["stagestrike"], process);
	initSceneVisibleTrigger(function(){
		$("#main").addClass("visible");
	}, function(){
		$("#main").removeClass("visible");
	});
}

function vMixOverlayTrigger(scene, show, overlayNumber){
	getOverlayNumber(scene, function(inputNumber){
		if(show){
			vMixSendCommand("OverlayInput"+overlayNumber+"In", inputNumber);
		}else{
			vMixSendCommand("OverlayInput"+overlayNumber+"Out", inputNumber);
		}
	});
}
function getOverlayNumber(name, callback){
	$.ajax({
		url: vMixApiAddress,
		dataType: "xml"
	}).done(function(xml){
		console.log(xml);
		var number = $(xml).find("vmix>inputs>input[title='"+name+"']").attr("number");
		callback(number);
	});
}

function vMixSendCommand(func, input){
	console.log("cmd: "+func+" - "+input);
	$.ajax({
		url: vMixApiAddress+"/?function="+func+"&input="+input,
	});
}

function process(data, type){
	console.log(data);

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
			vMixOverlayTrigger(vMixSceneName, true, 1);
		}else{
			$("#stagestrike").removeClass("visible");
			vMixOverlayTrigger(vMixSceneName, false, 1);
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