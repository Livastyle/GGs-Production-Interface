var firstload = true;
var countdownTimeout;
var countdownDueTime = 0;
var dueTimeDate;

var sv = {
	"upper":"",
	"lower":""
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
	console.log(data);
	
	var topVal = data.fields.staytuned_top.value;
	var bottomVal = data.fields.staytuned_bottom.value;
	
	insertText("upper", topVal);
	insertText("lower", bottomVal);
	
	setupCountdown(data);
	
	
	if(firstload){
		firstload = false;
		if(location.hash.length == 0){
			$("#main").addClass("visible");
		}
	}
}

function insertText(id, val) {
	if(sv[id] == val)
		return;
	sv[id] = val;
	
	$b = $("#"+id);
	$bs = $("#"+id+" span");
	
	$b.removeClass("visible");
	setTimeout(function(){
		$bs.text(val).css("font-size", $b.css("font-size"));
		setTimeout(function(){
			while($bs.width() > $b.width())
				$bs.css("font-size", "-=1px");
			$b.addClass("visible");
		}, 20);
	}, 200);
}

function setupCountdown(data){
	var dueHold = 60; // 1 M in sec
	var dueHold = 43200; // 12 H in sec
	var visible = data.fields.countdown.checked;
	countdownDueTime = data.fields.countdown.value+":00";
	var inPast = false;

	dueHold = dueHold*1000; // convert from s to ms
	
	var nowDate = new Date();
	var dueDate = new Date(nowDate.getFullYear()+"-"+(nowDate.getMonth()+1)+"-"+nowDate.getDate()+" "+countdownDueTime);
	
	if(dueDate.getTime()+dueHold < nowDate.getTime()){
		var tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		dueDate = new Date(tomorrow.getFullYear()+"-"+(tomorrow.getMonth()+1)+"-"+tomorrow.getDate()+" "+countdownDueTime);
	}
	inPast = (dueDate.getTime() < nowDate.getTime());
	dueTimeDate = dueDate;
	
	console.log(dueDate.getTime());
	console.log(nowDate.getTime());
	
	if(dueDate.getTime() != dueDate.getTime()){
		visible = false;
	}
	
	if(visible && !inPast){
		// display
		$("#countdown").addClass("visible");
		
		doCountdown();
		
	}else{
		// hide
		hideCountdown();
	}
	
}

function hideCountdown(){
	if(countdownTimeout)
		clearTimeout(countdownTimeout);
	$("#countdown").removeClass("visible");
}

function doCountdown(){
	if(countdownTimeout)
		clearTimeout(countdownTimeout);
	
	var nowDate = new Date();
	var sec = Math.ceil((dueTimeDate.getTime() - nowDate.getTime())/1000);
	if(sec <= 0)
		hideCountdown();
	
	var min = Math.floor(sec / 60);
	var hour = Math.floor(min / 60);
	sec = sec % 60;
	min = min % 60;
	
	hour = (hour<10 ? '0'+hour : hour);
	min = (min<10 ? '0'+min : min);
	sec = (sec<10 ? '0'+sec : sec);

	var str = "<span>"+hour+"</span>:<span>"+min+"</span>:<span>"+sec+"</span>";
	
	$("#countdown").html(str);
	
	countdownTimeout = setTimeout("doCountdown()", 1000);
}






