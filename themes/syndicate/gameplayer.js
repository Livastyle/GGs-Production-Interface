window.onload = init;
var sponsors = ["afk","controllerchaos","jimmyjoy","mc","ogd","pressfire","smashboards","splyce","stayokay","twitch","zowie"];


function init(){
	initSceneVisibleTrigger(function(){
		$("#main").addClass("visible");
	}, function(){
		$("#main").removeClass("visible");
	});
	insertSponsors(sponsors);

}
function insertSponsors(list){
	list.forEach(function(item){
		$("#sponsors").append('<div class="item item_'+item+'" style="background-image:url(\''+themePath+'/sponsor/'+item+'.png\');"></div>');
	});
}