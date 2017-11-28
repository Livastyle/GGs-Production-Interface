function process(type, data){
	if(type == 'scoreboardinfo'){
		$("#score").text(data.score[2]);
	}
}