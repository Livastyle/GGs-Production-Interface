
function loadProfile(callback, alwaysCallback){
	
	$.getJSON("./../smashgg_profile.json")
	.done(function(data){

		callback(data);

	}).always(function(){
		alwaysCallback();
	});
}

