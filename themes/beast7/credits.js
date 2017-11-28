
var loadSubsTimeout;

$(window).on('hashchange', function() {
	if(location.hash === "#used"){
		return;
	}
	if(location.hash === "#toggle"){
		if($("#main").hasClass("anim")){
			location.hash = "#hidden";
		}else{
			location.hash = "#visible";
		}
		$(window).trigger('hashchange');
	}else{
		if(location.hash !== "#visible"){
			$("#main").removeClass("anim");
			if(loadSubsTimeout)
				clearTimeout(loadSubsTimeout);
		}else{
			$("#main").addClass("anim");
			loadSubsTimeout = setInterval("loadSubs()", 2000);
		}
	}
	location.hash = "#used";
});

loadSubs();

function loadSubs(){
	console.log("load subs");
	$.getJSON("./../themes/beast7/subs.php")
	.done(function(data){
		console.log(data);
		if(data.length > 2)
			displaySubs(data);
	})
	.fail(function(){
		console.log("error");
	});
}

function displaySubs(list){
	var html = "";
	
	list.sort();
	
	for(index in list){
		var name = list[index];
		html += '<div class="item item'+(index % 3)+'" style="top:'+(Math.floor(index/3)*30 )+'px;">'+name+'</div>';
	}
	
	$("#subscriber").html(html);
}
