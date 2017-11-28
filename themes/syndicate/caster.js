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
	insertName(3, data);
	

	insertTwitter(1, data);
	insertTwitter(2, data);
	insertTwitter(3, data);

	insertFlag(1, data);
	insertFlag(2, data);
	insertFlag(3, data);

}

function insertName(num, data){
	var co = data.caster[num-1];
	if(svIsSet("name"+num, co.nickname)) return;
	insertValueResize({
		value:co.nickname,
		field:"#c"+num+" .name",
		visibleClass:"visible",
		classMirror:"#c"+num
	});
}
function insertTwitter(num, data){
	var co = data.caster[num-1];
	if(svIsSet("twitter"+num, co.twitter)) return;
	insertValueResize({
		value:co.twitter,
		field:"#c"+num+" .twitter",
		visibleClass:"visible"
	});
}
function insertFlag(num, data){
	var co = data.caster[num-1];
	var value = 0;
	if(co)
		value = co.country;
	
	if(svIsSet("flag"+num, value)) return;
	
	var url = './../assets/flags/midres/'+value+'.png';
	$("#c"+num+" .flag .inner").css("background-image","url('"+url+"')");
	
	if(value == 0){
		$("#c"+num+" .flag").addClass("hidden");
	}else{
		$("#c"+num+" .flag").removeClass("hidden");
	}
}

