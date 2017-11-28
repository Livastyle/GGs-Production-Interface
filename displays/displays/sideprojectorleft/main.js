function process(type, data){
	if(type == 'scoreboardinfo'){
		$("#score").text(data.score[1]);
		
		$("#character").css("background-image","url('./../assets/thumbnail/"+data.game+"/default/"+data.player[1].character.cid+".png')");
		
	}
}