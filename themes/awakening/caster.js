

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
	setCasterName(1, data);
	setCasterName(2, data);
	setCasterTwitter(1, data);
	setCasterTwitter(2, data);
	setCasterFlag(1, data);
	setCasterFlag(2, data);
}

function setCasterName(caster, data){
	var cobj = data.caster[caster-1];
	var nickname = cobj.nickname;
	var team = "";
	var teamList = [];
	var value = "";
	
	for(let i in cobj.teams){
		teamList.push(cobj.teams[i].prefix);
	}
	team = teamList.join(" ");
	if(teamList.length > 0){
		value = '<span class="team">'+team+"</span> "+nickname;
	}else{
		value = nickname;
	}
	
	if(svIsSet("name"+caster, value)) return;
	
	insertValueResize({
		value:value,
		field:"#cn"+caster
	});
	
}
function setCasterTwitter(caster, data){
	var cobj = data.caster[caster-1];
	var value = cobj.twitter;
	
	
	if(svIsSet("twitter"+caster, value)) return;
	
	insertValueResize({
		value:value,
		field:"#ct"+caster
	});
}

function setCasterFlag(caster, data){
	var cobj = data.caster[caster-1];
	var country = 0;
	if(cobj)
		country = cobj.country;
	
	if(svIsSet("country"+caster, country)) return;
	
	var url = './../assets/flags/lowres/'+country+'.png';
	$("#cflag"+caster).css("background-image","url('"+url+"')");
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
