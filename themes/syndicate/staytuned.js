window.onload = init;
var sponsors = ["afk","controllerchaos","jimmyjoy","mc","ogd","pressfire","smashboards","splyce","stayokay","twitch","zowie"];

var sponsorRotationCurrent = 0;
var assetsRotationCurrent = 0;
var countdownVisible = false;
var countdownDueTime = 0;

function init(){
	initSceneVisibleTrigger(function(){
		$("#main").addClass("visible");
	}, function(){
		$("#main").removeClass("visible");
	});
	startWS(process);
	$("#main").addClass("visible");
	setInterval("updateCountdown()", 1000);
	
	insertSponsors(sponsors);
}

function insertSponsors(list){
	list.forEach(function(item){
		$("#sponsors .list").append('<div class="item" style="background-image:url(\''+themePath+'/sponsor/'+item+'.png\');"></div>');
	});
	sponsorRotation();
	setInterval(sponsorRotation, 2000);
}
function sponsorRotation(){
	$currentItem = $("#sponsors .list .item:nth-child("+sponsorRotationCurrent+")");
	sponsorRotationCurrent++;
	if(sponsorRotationCurrent > $("#sponsors .list .item").length)
		sponsorRotationCurrent = 1;
	$nextItem = $("#sponsors .list .item:nth-child("+sponsorRotationCurrent+")");
	$currentItem.removeClass("visible");
	$nextItem.addClass("visible");
}


function process(data){
	console.log(data);
	
	var upper = data.fields.staytuned_top.value;
	var lower = data.fields.staytuned_bottom.value;
	
	if(!svIsSet("upper", upper)){
		insertValueResize({
			value:upper,
			field:"#upper"
		});
	}	
	if(!svIsSet("upper", lower)){
		insertValueResize({
			value:lower,
			field:"#lower"
		});
	}

	initCountdown(data.fields.countdown);
}

function initCountdown(data){
	countdownVisible = data.checked;
	countdownDueTime = data.value+":00";
}

function updateCountdown(){
	if(!countdownVisible){
		$("#countdown").css("opacity","0");
		return;
	}
	var nowDate = new Date();
	var dueDate = new Date(nowDate.getFullYear()+"-"+(nowDate.getMonth()+1)+"-"+nowDate.getDate()+" "+countdownDueTime);
	
	if(dueDate.getTime()+2*60*60*1000 < nowDate.getTime()){
		var tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		dueDate = new Date(tomorrow.getFullYear()+"-"+(tomorrow.getMonth()+1)+"-"+tomorrow.getDate()+" "+countdownDueTime);
	}
	
	if(dueDate.getTime() < nowDate.getTime()){
		str = "<span>00</span>:<span>00</span>:<span>00</span>";
		$("#countdown").css("opacity","0");
	}else{
		var sec = Math.ceil((dueDate.getTime() - nowDate.getTime())/1000);
		var min = Math.floor(sec / 60);
		var hour = Math.floor(min / 60);
		sec = sec % 60;
		min = min % 60;
		
		hour = (hour<10 ? '0'+hour : hour);
		min = (min<10 ? '0'+min : min);
		sec = (sec<10 ? '0'+sec : sec);

		str = "<span>"+hour+"</span>:<span>"+min+"</span>:<span>"+sec+"</span>";
		$("#countdown").css("opacity","1");
	}
	$("#countdown .inner").html(str);
}