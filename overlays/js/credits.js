
var timeout1,timeout2;

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
			hide();
		}else{
			$("#main").addClass("visible"); 
			init();
		}
	}
	location.hash = "#used";
});

function init(){
	
	loadDataJSON(function(data){
		console.log(1);
		var main = document.getElementById("main");
		var box = document.getElementById("credits-roll");
		while (box.firstChild) 
			box.removeChild(box.firstChild);

		var d = document.createDocumentFragment();
		
		d = addItemToFragment(d, data.tournament, "title");
		d = addItemToFragment(d, data.date, "small");
		d = addItemToFragment(d, data.location, "small");
		
		for(index in data.lines){
			var lineObj = data.lines[index];
			d = addItemToFragment(d, lineObj.value, lineObj.type);
		}
		
		d = addItemToFragment(d, "In partnership with", "head");
		d = addImageToFragment(d, "", "img/pressfire.png");
		d = addImageToFragment(d, "", "img/twitch.png");
		d = addImageToFragment(d, "", "img/splyce.png");
		
		
		d = addItemToFragment(d, 30, "space");
		d = addItemToFragment(d, "", "sep");
		d = addItemToFragment(d, 30, "space");
		d = addItemToFragment(d, "Recordings will be uploaded to Youtube.com/GeekyGoonSquad", "small");
		d = addItemToFragment(d, "If you like the stream, please consider to follow us", "small");
		d = addItemToFragment(d, "Subscribe to our Twitch channel to support European Smash!", "small");
		d = addItemToFragment(d, 80, "space");
		d = addImageToFragment(d, "", "img/geekygoonsquad.png");
		d = addItemToFragment(d, "www.GeekyGoonSquad.com", "small");
		d = addItemToFragment(d, 80, "space");
		d = addItemToFragment(d, "Thanks for watching", "normal");
		d = addItemToFragment(d, 80, "space");
		d = addItemToFragment(d, new Date().getFullYear() + " \u00A9 GeekyGoonSquad", "tiny");
		

		box.appendChild(d);
		if(timeout1)
			clearTimeout(timeout1);
		timeout1 = setTimeout(function(){
			console.log(2);
			box.style.opacity = 1;
			box.style.transform = "translateY("+(main.clientHeight)+"px)";
			
			var duration = box.clientHeight / data.speed;
			box.style.transition = "transform "+duration+"s linear, opacity 500ms";
			box.style.transform = "translateY(-"+(box.clientHeight)+"px)";
			if(timeout2)
				clearTimeout(timeout2);
			timeout2 = setTimeout(function(){
				console.log(3);
				box.style.opacity = 0;
			},(duration*1000)-500);
		},400);
	});
}

function hide(){
	if(timeout1)
		clearTimeout(timeout1);
	if(timeout2)
		clearTimeout(timeout2);
	console.log(4);
	var main = document.getElementById("main");
	var box = document.getElementById("credits-roll");
	while (box.firstChild) 
		box.removeChild(box.firstChild);
	box.style.transition = "transform 0s linear, opacity 500ms";
	box.style.transform = "translateY("+(main.clientHeight)+"px)";
	box.style.opacity = 0;
}



function addItemToFragment(frag, value, className){
	var lineElement = document.createElement("div");
	if(className == "space"){
		lineElement.style.height = value+"px";
	}else{
		var str = document.createTextNode(value);
		lineElement.appendChild(str);
	}
	lineElement.className = "item "+className;
	frag.appendChild(lineElement);
	return frag;
}

function addImageToFragment(frag, value, url){
	var lineElement = document.createElement("div");
	var img = new Image();
	img.src = url;
	var str = document.createTextNode(value);
	lineElement.appendChild(img);
	lineElement.appendChild(str);
	lineElement.className = "item image";
	frag.appendChild(lineElement);
	return frag;
}


function loadDataJSON(callback, alwaysCallback, errorCallback){
	$.ajax({
		type: "GET",
		dataType : 'json',
		cache: false,
		async:true,
		url : themePath+"/credits-data.json"
	}).done(function(data){
		callback(data);
	}).always(function(){
		if(alwaysCallback != undefined)
			alwaysCallback();
	}).fail(function(e1,e2,e3){
		console.log(e2+'-'+e3);
		if(errorCallback != undefined)
			errorCallback(e1,e2,e3);
	});	
}


