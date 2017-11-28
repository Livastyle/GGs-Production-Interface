window.onload = init;

function init(){
	initSceneVisibleTrigger(function(){
		$("#main").addClass("visible");
	}, function(){
		$("#main").removeClass("visible");
	});
	startWS(process);
}

function process(data){
	console.log(data);
	insertName(1, data);
	insertName(2, data);
	
	insertTwitter(1, data);
	insertTwitter(2, data);
}

function insertName(num, data){
	var co = data.caster[num-1];
	if(svIsSet("name"+num, co.nickname)) return;
	insertValueResize({
		value:co.nickname,
		field:"#cn"+num
	});
}
function insertTwitter(num, data){
	var co = data.caster[num-1];
	if(svIsSet("twitter"+num, co.twitter)) return;
	insertValueResize({
		value:co.twitter,
		field:"#ct"+num,
		visibleClass:"visible",
		classMirror:"#c"+num
	});
}