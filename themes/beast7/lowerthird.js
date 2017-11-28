var firstload = true;

var sv = {
	"upper":"",
	"lower":""
};
	



$(window).on('hashchange', function() {
	if(location.hash === "#used"){
		return;
	}
	if(location.hash === "#toggle"){
		if($("#main").hasClass("visible")){
			location.hash = "#hidden";
		}else{
			location.hash = "#visible";
		}
		$(window).trigger('hashchange');
	}else{
		if(location.hash !== "#visible"){
			$("#main").removeClass("visible");
		}else{
			$("#main").addClass("visible");
		}
	}
	location.hash = "#used";
});

window.onload = init;

function init(){
	startWS('ws://'+serverip+':5000', process);
}


function process(data){
	console.log(data);
	
	var topValue = data.fields.event.value + " " +  data.fields.round.value;
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