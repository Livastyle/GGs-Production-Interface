function process(type, data){
	console.log(type);
	console.log(data);
	if(type == 'schedule'){
		fillSchedule(data);
		
	}
}

function fillSchedule(list){
	var frag = document.createDocumentFragment();
	list.forEach(function(item){
		if(item.category == 'start'){
			
		}
		var $cont = $('<div class="item" />');
		$cont.append('<div class="label">'+item.label+'</div>');
		$cont.appendTo(frag);
	});
	
	$("#schedule").html(frag);
}

setInterval(function(){
	var now = new Date();
	var h = now.getHours();
	var m = now.getMinutes();
	var s = now.getSeconds();
	
	h = (h<10 ? '0'+h : h);
	m = (m<10 ? '0'+m : m);
	s = (s<10 ? '0'+s : s);
	
	$("#clock").text(h+':'+m+':'+s);
	
}, 1000);