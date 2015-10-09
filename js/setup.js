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

function randomize(){
	var colors = shuffle(["blue", "white", "pink", "green", "orange"]);
	var shiftFactor = shuffle([0,1,2,3,4]);
	var rows = document.getElementById("aliasTableBody").getElementsByTagName("tr");
	
	while(shiftFactor.length>0){
		var i = shiftFactor.shift();
		var row = rows[shiftFactor.length].getElementsByTagName("td");
		row[1].innerHTML = colorWrapper(colors[i]);
		row[2].innerHTML = colorWrapper(colors[mod5(i+1)]);
		row[3].innerHTML = colorWrapper(colors[mod5(i-1)]);
	}
}

function modClosure(modulus){
	return function(n){
		/*The modulo operation in javascript does not behave as expected:
		negative numbers don't wrap around. This function does.*/
		return ((n%modulus)+modulus)%modulus;
	};
}
var mod5 = modClosure(5);

function colorWrapper(color){
	return "<code class=\""+color+"\">Mr. "+capitalize(color)+"</code>";
}

function capitalize(word){
	return word.charAt(0).toUpperCase()+word.slice(1);
}