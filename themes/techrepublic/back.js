window.onload = init;

var cur = 1;

function init(){
	fad();
	setInterval(fad, 4000);
}

function fad(){
	cur++;
	if(cur == 8)
		cur = 1;
	
	$(".item").removeClass("visible");
	$(".item:nth-child("+cur+")").addClass("visible");
}