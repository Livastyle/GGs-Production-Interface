document.onkeydown = overrideKeyboardEvent;
document.onkeyup = overrideKeyboardEvent;
var keyIsDown = {};

function overrideKeyboardEvent(e){
	var isShortcut = false;
	switch(e.type){
		case "keydown":
			if(!keyIsDown[e.keyCode]){
				keyIsDown[e.keyCode] = true;
				if(e.ctrlKey && e.key in shortcuts){
					isShortcut = true;
					eval("shortcuts."+e.key+"()");
				}
			}
		break;
		case "keyup":
			delete(keyIsDown[e.keyCode]);
			// do key up stuff here
		break;
	}
	if(isShortcut){
		disabledEventPropagation(e);
		e.preventDefault();
		return false;
	}else{
		return true;
	}
}
function disabledEventPropagation(e){
	if(e){
		if(e.stopPropagation){
			e.stopPropagation();
		} else if(window.event){
			window.event.cancelBubble = true;
		}
	}
}