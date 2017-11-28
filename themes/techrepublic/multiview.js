

window.onload = init;
var isWisible = false;

function init(){
	initSceneVisibleTrigger(function(){
		$("#main").addClass("visible");
	}, function(){
		$("#main").removeClass("visible");
	});
	rotateLogos();
	setInterval(rotateLogos, 3000);
}

function rotateLogos(){
	if($("#main").hasClass("visible")){
		$(".item:not(.ggs)").toggleClass("hidden");
	}
}