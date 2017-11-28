var sv = {
	"caster":{
		1:{"name":"","twitter":"","country":""},
		2:{"name":"","twitter":"","country":""}
	}
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
	putInfo(1, data);
	putInfo(2, data);
}




function putInfo(num, data){
	var $nameElm = $("#cn"+num+" span");
	var $twitterElm = $("#ct"+num+" span");
	//var $flagElm = $("#"+num+"_panel .bottom .flag");

	
	var name = data.caster[num-1].generateddisplayname;
	var twitter = data.caster[num-1].twitter;
	var flag = data.caster[num-1].country;
	
	

	

	var flagurl = '../assets/flags/lowres/'+flag+'.png';
	
	
	if(twitter.length > 0){
		$twitterElm.addClass("visible");
	}else{
		$twitterElm.removeClass("visible");
	}
	$nameElm.text(name);
	$twitterElm.text(twitter);
	//$flagElm.css("background-image","url('"+flagurl+"')");
}
