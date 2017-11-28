var firstload = true;

console.log(1);

var sv = {
	"caster":{
		1:{"name":"","twitter":"","country":""},
		2:{"name":"","twitter":"","country":""},
		3:{"name":"","twitter":"","country":""}
	}
};
	
var padding = {"castername": 40, "castertwitter": 30};


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
	console.log("init");
	startWS('ws://'+serverip+':5000', process);
}


function process(data){
	console.log(data);
	
	setupOverlay(data);
	
	putInfo(1, data);
	putInfo(2, data);
	putInfo(3, data);
	
	if(firstload){
		firstload = false;
		if(location.hash.length == 0){
			$("#main").addClass("visible");
		}
	}
}


function putInfo(caster, data){
	var cnum = caster-1;
	var castername = data.caster[cnum].nickname;
	var castertwitter = data.caster[cnum].twitter;
	var castercountry = data.caster[cnum].country;
	
	var flagUrl = themePath+"/flags/1/"+castercountry+".png";
	
	var $item = $("#c"+caster);
	$item.children(".top").children("span").text(castername);
	$item.children(".bottom").children("span").text(castertwitter);
	$item.children(".bottom").children(".flag").css("background-image","url('"+flagUrl+"')");
	if(castertwitter.length > 0){
		$item.children(".bottom").addClass("filled");
	}else{
		$item.children(".bottom").removeClass("filled");
	}
}

function setupOverlay(data){
	var setupArr = [
		["mid"],
		["mid"],
		["left","right"],
		["left","mid","right"]
	];
	var casterCount = 0;
	for(index in data.caster){
		var index = parseInt(index);
		var castObj = data.caster[index];
		if(castObj.id != "0"){
			casterCount++;
			$("#c"+(index+1)).addClass("visible");
		}else{
			$("#c"+(index+1)).removeClass("visible");
		}
	}
	
	$("#casterpanels").removeClass("setup1 setup2 setup3").addClass("setup"+casterCount);
	
	var setup = setupArr[casterCount];
	console.log(setup);
	$(".panel").removeClass("left mid right");
	$(".panel.visible").each(function(k,v){
		$(v).addClass(setup[k]);
	});
	if(casterCount == 2 || casterCount == 0){
		$("#logo").removeClass("topright");
	}else{
		$("#logo").addClass("topright");
	}
	
}
