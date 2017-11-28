window.onload = init;


firstload = true;

countdownVisible = false;
countdownDueTime = 0;


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


function init(){
	startWS('ws://'+serverip+':5000', ["scoreboardinfo","music"], process);
	setInterval("updateCountdown()", 1000);
}


function process(data, type){
	var timeMargin = 5;
	if(type == 'music'){
		
		var visible = (data.current > timeMargin && data.duration-data.current > timeMargin && data.playing);
		if(visible){
				$("#musicplayer").addClass("visible");
		}else{
				$("#musicplayer").removeClass("visible");
		}
		if(data.duration > 0){
			var p = (data.current / data.duration)*100;
			$("#progress_inner").css("width", p+"%");
		}
		$("#mp_title").text(data.title);
		$("#mp_artist").text(data.artist);

	}
		
	if(type == 'scoreboardinfo'){
		
		$("#upper").text(data.fields.staytuned_top.value);
		$("#lower").text(data.fields.staytuned_bottom.value);
		initCountdown(data.fields.countdown)
	}
	
	if(firstload){
		firstload = false;
		if(location.hash.length == 0){
			$("#main").addClass("visible");
		}
	}
}

function initCountdown(data){
/*
	data.value
	data.checked
*/
	
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
	
	
	
	$("#countdown").html(str);
	
	

	
	
}
