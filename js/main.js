var PlayerSelector = document.getElementById("PlayerSelector");
var ActionSelector = document.getElementById("ActionSelector");
var ToSelector = document.getElementById("ToSelector");
var FromSelector = document.getElementById("FromSelector");
var TextArea = document.getElementById("TextArea");

var BlueOut = document.getElementById("BlueOut");
var WhiteOut = document.getElementById("WhiteOut");
var GreenOut = document.getElementById("GreenOut");
var OrangeOut = document.getElementById("OrangeOut");
var PinkOut = document.getElementById("PinkOut");

var BlueWireOut = document.getElementById("BlueWireOut");
var WhiteWireOut = document.getElementById("WhiteWireOut");
var GreenWireOut = document.getElementById("GreenWireOut");
var OrangeWireOut = document.getElementById("OrangeWireOut");
var PinkWireOut = document.getElementById("PinkWireOut");

var ActionList = document.getElementById("ActionList");

var Wiretaps = [];
var Messages = [];

var UniqueNum = 0;

function addAction(){
	var player = PlayerSelector.value;
	var action = ActionSelector.value;
	var to = ToSelector.value;
	var from = FromSelector.value;
	var text = TextArea.value;

	if(action == "message"){
		Messages.push({
			'From' : player,
			'To' : to,
			'Text' : text,
			'ID' : UniqueNum
		});
	}
	if(action == "spoof"){
		Messages.push({
			'From' : from,
			'To' : to,
			'Text' : text,
			'ID' : UniqueNum
		});
	}
	if(action == "wiretap"){
		Wiretaps.push({
			'Player' : player,
			'Target' : (to != "none") ? to : from,
			'Direction' : (to != "none") ? "to" : "from",
			'ID' : UniqueNum
		});
	}
	
	var li = document.createElement('li');
	var string = wrapColor(player) + " " + action;
	if(to != "none"){
		string += " to " + wrapColor(to);
	}
	if(from != "none"){
		string += " from " + wrapColor(from);
	}
	if(text != ""){
		string += " \"" + text + "\"";
	}
	li.innerHTML = string;
	li.setAttribute('id', UniqueNum + "");
	li.setAttribute('onclick', 'removeAction(this)');
	var div = document.createElement('div');
	div.setAttribute('class', 'row');
	div.appendChild(li);
	ActionList.appendChild(div);
	resetForm();

	UniqueNum += 1;
}

function resetForm(){
	PlayerSelector.value = "blue";
	ActionSelector.value = "message";
	ToSelector.value = "none";
	FromSelector.value = "none";
	TextArea.value = "";
}

function removeAction(el){
	var id = el.getAttribute('id');
	console.log(id);
	
	for(var i=0; i<Messages.length; i++){
		if(Messages[i].ID == id){
			Messages.splice(i,1);
			break;
		}
	}
	for(var i=0; i<Wiretaps.length; i++){
		if(Wiretaps[i].ID == id){
			Wiretaps.splice(i,1);
			break;
		}
	}

	el.parentNode.removeChild(el);
}

function generateOutput(){
	var players = ["blue","white","green","orange","pink"];
	var playerOuts = [BlueOut, WhiteOut, GreenOut, OrangeOut, PinkOut];
	var playerWireOuts = [BlueWireOut, WhiteWireOut, GreenWireOut, OrangeWireOut, PinkWireOut];
	var signatures = [" -Mr. Blue", " -Mr. White", " -Mr. Green", " -Mr. Orange", " -Mr. Pink"];
	var signaturesTo = [" -> Mr. Blue", " -> Mr. White", " -> Mr. Green", " -> Mr. Orange", " -> Mr. Pink"];

	shuffle(Messages);
	clearOutput();

	for(var i=0; i<Messages.length; i++){
		if(Messages[i].To != "none"){
			var message = "\"" + Messages[i].Text + "\"";
			message += signatures[players.indexOf(Messages[i].From)];
			var p = document.createElement('p');
			p.innerHTML = message;
			if(playerOuts[players.indexOf(Messages[i].To)].innerHTML == ""){
				var p2 = document.createElement('p');
				p2.innerHTML = "You received:";
				playerOuts[players.indexOf(Messages[i].To)].appendChild(p2);
			}
			playerOuts[players.indexOf(Messages[i].To)].appendChild(p);
		}
	}

	for(var i=0; i<Wiretaps.length; i++){
		var player = Wiretaps[i].Player;
		var target = Wiretaps[i].Target;
		var direction = Wiretaps[i].Direction;
		for(var j=0; j<Messages.length; j++){
			if(direction == "to" && Messages[j].To == target){
				if(playerWireOuts[players.indexOf(player)].innerHTML == ""){
					var p = document.createElement('p');
					p.innerHTML = "Your wiretap returned:";
					playerWireOuts[players.indexOf(player)].appendChild(p);
				}
				var p = document.createElement('p');
				p.innerHTML = "\"" + Messages[j].Text + "\"";
				p.innerHTML += signatures[players.indexOf(Messages[j].From)];
				p.innerHTML += signaturesTo[players.indexOf(Messages[j].To)];
				playerWireOuts[players.indexOf(player)].appendChild(p);
			}
			if(direction == "from" && Messages[j].From == target){
				if(playerWireOuts[players.indexOf(player)].innerHTML == ""){
					var p = document.createElement('p');
					p.innerHTML = "Your wiretap returned:";
					playerWireOuts[players.indexOf(player)].appendChild(p);
				}
				var p = document.createElement('p');
				p.innerHTML = "\"" + Messages[j].Text + "\"";
				p.innerHTML += signatures[players.indexOf(Messages[j].From)];
				p.innerHTML += signaturesTo[players.indexOf(Messages[j].To)];
				playerWireOuts[players.indexOf(player)].appendChild(p);
			}
		}
	}

	for(var i=0; i<Wiretaps.length; i++){
		var player = Wiretaps[i].Player;
		var index = players.indexOf(player);
		if(playerWireOuts[index].innerHTML == ""){
			playerWireOuts[players.indexOf(player)].innerHTML = "Your wiretap returned nothing.";
		}
	}

	for(var i=0; i<playerOuts.length; i++){
		if(playerOuts[i].innerHTML == "" && playerWireOuts[i].innerHTML == ""){
			playerOuts[i].innerHTML = "There is nothing to report.";
		}
	}
}

function clearOutput(){
	var playerOuts = [BlueOut, WhiteOut, GreenOut, OrangeOut, PinkOut];
	var playerWireOuts = [BlueWireOut, WhiteWireOut, GreenWireOut, OrangeWireOut, PinkWireOut];

	for(var i=0; i<playerOuts.length; i++){
		playerOuts[i].innerHTML = "";
	}
	for(var i=0; i<playerWireOuts.length; i++){
		playerWireOuts[i].innerHTML = "";
	}
}

function shuffle(list){
 var left = list.length;
  
 while (left){
 	x = Math.floor(Math.random()*left--);
 	 
 	y = list[left];
 	list[left] = list[x];
 	list[x] = y;
 }
  
 return list;
}

function wrapColor(color){
	return "<code class=\"" + color + "\">" + color + "</code>";
}