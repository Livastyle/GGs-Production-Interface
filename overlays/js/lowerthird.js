

function getPlayerNameOrder(data){
	var returnString = "";
	var playerArr = [];
	var index;
	for(index in data.seatorder){
		var playerObject = data.player[data.seatorder[index]];
		if(playerObject && playerObject.nickname && playerObject.nickname.length > 0){
			playerArr.push(playerObject);
		}
	}
	for(index in playerArr){
		var name = "";
		index = parseInt(index);
		if(playerArr.length > 2){
			name = playerArr[index].nickname;
		}else{
			name = playerArr[index].generateddisplayname;
		}
		if(returnString.length > 0){
			returnString += ((index+1 == playerArr.length) ? " & " : ", ");
		}
		returnString += name;
	}
	return returnString;
}