var sv = {
	"caster":{
		1:{"name":"","twitter":"","country":""},
		2:{"name":"","twitter":"","country":""}
	}
};


window.onload = init;

function init(){
	initSceneVisibleTrigger(function(){
		$("#main").addClass("visible");
	}, function(){
		$("#main").removeClass("visible");
	});
	startWS(process);
		$("#main").addClass("visible");
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
	
	if(!svIsSet("name"+num, name)){
		insertValueResize({
			value:name,
			field:"#cn"+num
		});
	}	
	if(!svIsSet("twitter"+num, twitter)){
		insertValueResize({
			value:twitter,
			field:"#ct"+num
		});
	}
}
