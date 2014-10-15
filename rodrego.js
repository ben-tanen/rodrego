/*)
var boxes = [{"object": document.getElementById('box0'), "value": 0},
			 {"object": document.getElementById('box1'), "value": 0},
			 {"object": document.getElementById('box2'), "value": 0},
			 {"object": document.getElementById('box3'), "value": 0},
			 {"object": document.getElementById('box4'), "value": 0},
			 {"object": document.getElementById('box5'), "value": 0},
			 {"object": document.getElementById('box6'), "value": 0},
			 {"object": document.getElementById('box7'), "value": 0},
			 {"object": document.getElementById('box8'), "value": 0},
			 {"object": document.getElementById('box9'), "value": 0}]



function clear() {
	for (i=0; i<9; i++) {
		boxes[i]["value"] = 0;
	}
}

function test() {
	var string = '';
	for (i=0; i<9; i++) {
		string += ' ' + boxes[i]["value"];
	}
	console.log(string);
}

console.log(boxes[0]);
console.log(document.getElementById('box0'));

*/

var boxes = [{"object": document.getElementById('demo'), "value": 0}, {"object": document.getElementById('demo2'), "value": 0}];

alert(boxes[0]["object"].innerHTML);