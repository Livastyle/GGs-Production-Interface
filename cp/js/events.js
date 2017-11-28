var eventHolds = [];


function triggerEvent(name, val){
	log(name, LOGTYPE.INFO); 
	if(eventHolds.indexOf(name) > -1){
		log("Cancel event: "+name, LOGTYPE.INFO);
		return;
	}
	if(val == undefined)
		val = {};
	var evt = $.Event(name, val);
	$(window).trigger(evt);
}
function triggerGlobalEvent(name, val, noLocal){
	if(typeof(noLocal) == undefined)
		noLocal = false;
	log("Triggered Global Event: "+name, LOGTYPE.INFO);
	sendDataToWebsocket({"name":name, "val":val}, "event");
	if(!noLocal)
		triggerEvent(name, val);
}
function holdEvent(name){
	if(eventHolds.indexOf(name) === -1){
		eventHolds.push(name);
		log("Hold event: "+name, LOGTYPE.INFO);
	}
}
function releaseEvent(name){
	var index = eventHolds.indexOf(name);
	if (index > -1) {
		eventHolds.splice(index, 1);
		log("Release event: "+name, LOGTYPE.INFO);
	}
}




$(window).on('setidchanged', function (e) {
	currentSetID = e.setid;
});

$(window).on('refreshthemeslist', function (e) {
    if(e.state==1){
		// clear and wait screen
		$(".global_themelist").prop('disabled', true);
	}
    if(e.state==2){
		// fill data and display
		
		
		var themelistfrag = document.createDocumentFragment();
		var themeselectfrag = document.createDocumentFragment();
		for(index in themeslist){
			var v = themeslist[index];
			$(themeselectfrag).append('<option value="'+v.name+'">'+v.label+'</option>');
			var html = '<div class="item">';
			html += '<div class="preview">';
			if(v.preview[0])
				html += '<img src="./../themes/'+v.name+'/'+v.preview[0]+'" alt="" style="max-width:200px;" />';
			html += '</div>';
			html += '<div class="info">';
			html += '<div style="font-size:20px;font-weight:bold;">'+v.label+'</div>';
			html += '<div style="font-size:10px;margin-bottom:20px;">Version '+v.ver+'</div>';
			html += '<div>Note: '+v.note+'</div>';
			html += '<div>Native resolution: '+v.resolution[0]+"x"+v.resolution[1]+'</div>';
			html += '</div>';
			html += '</div>';
			$(themelistfrag).append(html);
		}
		$(".global_themelist").html(themeselectfrag).prop('disabled', false);
		$("#detailed-themelist").html(themelistfrag);
		
		changeTheme(profile.theme);
	}
});

$(window).on('refreshplayerdatabase', function (e) {
    if(e.state==2){
		// fill data and display
		
		var frag = document.createDocumentFragment();
		for(k in playerdatabaselist)
			$(frag).append('<option value="'+playerdatabaselist[k].nickname+'" />');
		$("#playernamelist").html(frag);
		insertCasterOptions();
		releaseEvent("checkplayername");
		$("#sb-main .playername").trigger("oninput");
	}
});


$(window).on('refreshcountrydatabase', function (e) {
    if(e.state==1){
		// clear and wait screen
		$(".global_countrylist").prop('disabled', true);
	}
    if(e.state==2){
		// fill data and display
		var frag = document.createDocumentFragment();
		$(frag).append('<option value="0"> - Unknown - </option>');
		for(k in countrydatabaselist)
			$(frag).append('<option value="'+countrydatabaselist[k].id+'">'+countrydatabaselist[k].name+'</option>');
		$(".global_countrylist").html(frag).prop('disabled', false);
	}
});
$(window).on('refreshteamdatabase', function (e) {
    if(e.state==1){
		// clear and wait screen
		$(".global_teamlist").prop('disabled', true);
	}
    if(e.state==2){
		// fill data and display
		var frag = document.createDocumentFragment();
		for(k in teamdatabaselist){
			var v = teamdatabaselist[k];
			$(frag).append('<option value="'+v.id+'">'+v.name+'</option>');
		}
		$(".global_teamlist").html(frag).prop('disabled', false);
	}
});
$(window).on('refreshgamedatabase', function (e) {
    if(e.state==1){
		// clear and wait screen
		$(".global_gamelist").prop('disabled', true);
	}
    if(e.state==2){
		// fill data and display
		var frag = document.createDocumentFragment();
		for(k in gamedatabaselist)
			$(frag).append('<option value="'+gamedatabaselist[k].id+'">'+gamedatabaselist[k].name+'</option>');
		
		$(".global_gamelist").html(frag).prop('disabled', false);
		changeGame(_game);
	}
});

$(window).on('autoupdate', function (e) {
	console.log("autoupdate");
	if(e.threshold == undefined)
		e.threshold = false;
	clearTimeout(_autoUpdateTimeout);
	if(_autoupdate)
		if(e.threshold)
			_autoUpdateTimeout = setTimeout(update, profile.autoupdatetime);
		else
			_autoUpdateTimeout = setTimeout(update, 50);
});

$(window).on('disableAutoUpdate', function (e) {
	toggleAutoUpdate(false);
});

$(window).on('checkplayername', function (e) {
	checkPlayerName(e.pf);
});

