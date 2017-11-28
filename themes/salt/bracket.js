
var groupTypeId = {
	1:"Single Elimination",
	2:"Double Elimination",
	3:"Round Robin",
};

var bracketPath = {
	"gf2":["gf","gf"],
	"gf":["wf","lf"],
	"wf":["wsf","wsf"],
	"lf":["wf","lsf"],
	"lsf":["lqf","lqf"],
	"lqf":["wsf","l8f"]
};

var canvasDrawn = false;


$(window).on('hashchange', function() {
	if(location.hash === "#used"){
		return;
	}
	if(location.hash === "#toggle"){
		if($("#main").hasClass("bracketvisible")){
			location.hash = "#hidden";
		}else{
			location.hash = "#visible";
		}
		$(window).trigger('hashchange');
	}else{
		if(location.hash !== "#visible"){
			$("#main").removeClass("bracketvisible");
		}else{
			$("#main").addClass("bracketvisible");
		}
	}
	location.hash = "#used";
});


window.onload = load;

setTimeout(function(){
	
	$("#main").addClass("bracketvisible");
	drawCanvas(0);
},1000);

function load(){
	loadBracket(24575, function(data){

		insertSetData(data.event.list);

			

	}, function(){
		setTimeout(load, 4000);
	});
}

function drawCanvas(progress){
	canvasDrawn = true;
	var progressDevide = 100;
	var c = document.getElementById("bg_canvas");
	var ctx = c.getContext("2d");
	var grad= ctx.createLinearGradient(0, 0, 1650, 800);

	ctx.clearRect(0, 0, c.width, c.height);
	ctx.beginPath();
	grad.addColorStop(0, "rgba(255,255,255,1)");
	
	var stop1 = (progress/progressDevide - 0.1);
	var stop2 = (progress/progressDevide + 0.1);
	
	grad.addColorStop((stop1 < 0 ? 0 : stop1), "rgba(255,255,255,1)");
	grad.addColorStop((stop2 > 1 ? 1 : stop2), "rgba(255,255,255,0)");
	grad.addColorStop(1, "rgba(255,255,255,0)");
	ctx.strokeStyle = grad;
	ctx.lineWidth=2;
	  ctx.shadowColor = '#fff';
	  ctx.shadowBlur = 10;
	  ctx.shadowOffsetX = 0;
	  ctx.shadowOffsetY = 0;
	if(true){
		drawDoubleElimination(ctx);
	}
	ctx.stroke();
	progress++;
	if(progress < progressDevide)
		setTimeout("drawCanvas("+progress+")", 20);
}

function drawDoubleElimination(ctx){
	// wf
	ctx.moveTo(330,60);
	ctx.lineTo(375,60);
	ctx.lineTo(375,170);
	ctx.moveTo(330,280);
	ctx.lineTo(375,280);
	ctx.lineTo(375,170);
	ctx.lineTo(420,170);
	
	// gf
	ctx.moveTo(780,170);
	ctx.lineTo(870,170);
	
	// gf2
	ctx.moveTo(1230,170);
	ctx.lineTo(1320,170);
	
	// lqf
	ctx.moveTo(330,520);
	ctx.lineTo(420,520);
	ctx.moveTo(330,740);
	ctx.lineTo(420,740);
	
	// lsf
	ctx.moveTo(780,520);
	ctx.lineTo(825,520);
	ctx.lineTo(825,630);
	ctx.moveTo(780,740);
	ctx.lineTo(825,740);
	ctx.lineTo(825,630);
	ctx.lineTo(870,630);
	
	// lqf
	ctx.moveTo(1230,630);
	ctx.lineTo(1320,630);
}

function loadBracket(eventID, callback, always) {
	var url = "http://"+location.host+"/cp/ajax/smashggbracket.json.php?eventid="+eventID+"&random="+Math.random();
	$.getJSON(url)
	.done(function(data){
		console.debug(data);
		callback(data);
	})
	.always(function(){
		always();
	});
}

function insertSetData(list){
	var set = getGrandFinal2(list);
	insertSetById(list, set.id, "gf2");
}

function getGrandFinal2(list){
	for(index in list)
		if(list[index].entrant1PrereqId == list[index].entrant2PrereqId)
			return list[index];
	return null;
}

function insertSetById(list, setID, field, forceField){
	
	var useField;
	if($("#item-"+field).length)
		useField = field;
	else{
		var fieldSub = (forceField ? forceField : "0");
		if($("#item-"+field+"1").hasClass("set-"+setID))
			fieldSub = "1";
		if($("#item-"+field+"2").hasClass("set-"+setID))
			fieldSub = "2";
		if(fieldSub == "0")
			if($("#item-"+field+"1").hasClass("done"))
				fieldSub = "2";
			else
				fieldSub = "1";
		useField = field+fieldSub;
	}
	$("#item-"+useField).addClass("done set-"+setID);

	var set = getSetById(list, setID);
	
	if(!$("#item-"+useField).hasClass("setstate"+set.state))
		$("#item-"+useField).removeClass("setstate1 setstate2 setstate3").addClass("setstate"+set.state);
	
	if(set.state == 3){
		$("#item-"+useField).removeClass("winnerp1 winnerp2");
		if(set.winnerId == set.entrant1Id){
			$("#item-"+useField).addClass("winnerp1");
		}else{
			$("#item-"+useField).addClass("winnerp2");
		}
	}
	
	// insert names
	if(set.entrant1name){
		insertNameIntoField("#item-"+useField+" .p1 .name", set.entrant1name);
		$("#item-"+useField+" .p1").removeClass("disabled");
	}else{
		insertNameIntoField("#item-"+useField+" .p1 .name", set.entrant1PrereqStr);
		$("#item-"+useField+" .p1").addClass("disabled");
	}
	if(set.entrant2name){
		insertNameIntoField("#item-"+useField+" .p2 .name", set.entrant2name);
		$("#item-"+useField+" .p2").removeClass("disabled");
	}else{
		insertNameIntoField("#item-"+useField+" .p2 .name", set.entrant2PrereqStr);
		$("#item-"+useField+" .p2").addClass("disabled");
	}
	
	
	
	// insert score
	if(set.entrant1Score != null && set.entrant2Score != null){
		$("#item-"+useField+" .p1 .score .inner").text(set.entrant1Score);
		$("#item-"+useField+" .p2 .score .inner").text(set.entrant2Score);
	}else{
		$("#item-"+useField+" .score .inner").text("");
	}
	
	if(!bracketPath[field])
		return;
	if(set.entrant1PrereqCondition == set.entrant2PrereqCondition){
		insertSetById(list, set.entrant1PrereqId, bracketPath[field][0], fieldSub);
		insertSetById(list, set.entrant2PrereqId, bracketPath[field][1], fieldSub);
	}else{
		if(set.entrant1PrereqCondition == "loser"){
			insertSetById(list, set.entrant1PrereqId, bracketPath[field][0], fieldSub);
			insertSetById(list, set.entrant2PrereqId, bracketPath[field][1], fieldSub);
		}else{
			insertSetById(list, set.entrant1PrereqId, bracketPath[field][1], fieldSub);
			insertSetById(list, set.entrant2PrereqId, bracketPath[field][0], fieldSub);
		}
	}
	
}

function insertNameIntoField(fieldID, value){
	
	var $item = $(fieldID);
	var $itemSpan = $(fieldID+" span");
	
	var oldValue = $item.data("value");
	
	if(!oldValue)
		oldValue = "";
	
	
	
	if(value == oldValue)
		return;
	$item.data("value", value);
	$itemSpan.animate({"opacity":"0"}, 100, function(){
		console.log(value);
		$itemSpan.text(value).css("font-size", $item.css("font-size"));
		setTimeout(function(){
			while($itemSpan.width() > $item.width())
				$itemSpan.css("font-size", "-=1px");
			$itemSpan.animate({"opacity":"1"}, 100);
		}, 20);
	});
	
}


function getSetById(list, setID){
	for(index in list)
		if(list[index].id == setID)
			return list[index];
	return null;
}


